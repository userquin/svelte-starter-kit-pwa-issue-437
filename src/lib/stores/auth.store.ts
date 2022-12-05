/**
 * Svelte auth store built on `oidc-client-ts`
 * This library shoud be used client-side only, in the browser.
 * This may not work with SSR / SSG
 * `$env/dynamic/public` not working when `prerender = true` for home routes.
 * https://github.com/sveltejs/kit/discussions/7700
 */
import { browser, dev } from '$app/environment';
import { goto } from '$app/navigation';
import { env as dynPubEnv } from '$env/dynamic/public';
import type { Role, User as AppUser } from '$lib/models/types/user';
import { localStorageStore } from '@skeletonlabs/skeleton';
import Cookies from 'js-cookie';
import { Log, User, UserManager, type UserManagerSettings } from 'oidc-client-ts';
import { derived, get, writable } from 'svelte/store';

/**
 * UserManager supports multiple IDP providers
 */

// enable debug logs for `oidc-client-ts`
if (dev) Log.setLevel(Log.DEBUG);
Log.setLogger(console);

const appUrl = browser ? window.location.origin : dynPubEnv.PUBLIC_BASE_URL;
console.log('appUrl...', appUrl, dynPubEnv.PUBLIC_BASE_URL);

function createUserManager(config: UserManagerSettings) {
	const userManager = new UserManager(config);

	userManager.events.addUserLoaded(async () => {
		await userManager.clearStaleState();
	});

	userManager.events.addUserUnloaded(clearUserState);

	return userManager;
}

/**
 * remove current stale user from svelte-store and cookies
 */
function clearUserState() {
	auth.set({ isAuthenticated: false, token: undefined, profile: undefined });
	// unset token/provider cookie
	Cookies.remove('token');
}

const azureUserManager = createUserManager({
	authority: dynPubEnv.PUBLIC_CONFY_SSO_AZUREAD_AUTHORITY,
	client_id: dynPubEnv.PUBLIC_CONFY_SSO_AZUREAD_CLIENT_ID,
	redirect_uri: appUrl + '/callback', // window.location.origin,
	post_logout_redirect_uri: appUrl + '/logout', // window.location.origin,
	scope: 'profile openid User.Read', // email
	filterProtocolClaims: true,
	loadUserInfo: true,
	// workaround for https://github.com/authts/oidc-client-ts/issues/790
	mergeClaims: false
	// accessTokenExpiringNotificationTime: 300,
	// silentRequestTimeout: 20000,
});
const googleUserManager = createUserManager({
	authority: dynPubEnv.PUBLIC_CONFY_SSO_GOOGLE_AUTHORITY,
	client_id: dynPubEnv.PUBLIC_CONFY_SSO_GOOGLE_CLIENT_ID,
	client_secret: dynPubEnv.PUBLIC_CONFY_SSO_GOOGLE_CLIENT_SECRET,
	redirect_uri: appUrl + '/callback', // window.location.origin,
	post_logout_redirect_uri: appUrl, // window.location.origin,
	scope: 'profile openid email',
	filterProtocolClaims: true,
	loadUserInfo: true,
	// workaround for https://github.com/authts/oidc-client-ts/issues/790
	mergeClaims: false,
	// accessTokenExpiringNotificationTime: 300,
	// silentRequestTimeout: 20000,
	metadataSeed: {
		// end_session_endpoint: 'https://www.google.com/accounts/Logout?continue=https://appengine.google.com/_ah/logout',
		end_session_endpoint: appUrl + '/logout'
	},
	extraQueryParams: { access_type: 'offline', prompt: 'consent' },
	revokeTokenTypes: ['access_token'],
	revokeTokensOnSignout: true
});

function getUserManager(provider: Provider) {
	switch (provider) {
		case 'azure':
			return azureUserManager;
		case 'google':
			return googleUserManager;
	}
}

/**
 * Provider
 */
export type Provider = 'azure' | 'google';
const LocalStorageProviderKey = 'AuthenticationProvider';

/**
 * Stores
 */
export const provider = localStorageStore<Provider>(LocalStorageProviderKey, 'google');
const userManager = derived(provider, ($provider) => getUserManager($provider));
export const auth = writable<{ isAuthenticated: boolean; token?: string; profile?: AppUser }>({ isAuthenticated: false });

/**
 * Public API
 */

/**
 * trigger SSO login
 * @param newProvider
 */
export async function login(newProvider: Provider = 'google') {
	provider.set(newProvider);
	const currentUserManager = get(userManager);
	const user = await currentUserManager.getUser();

	if (user && !user.expired && user.id_token) {
		await setAuth(user);
		await goto('/dashboard');
	} else {
		try {
			await currentUserManager.signinRedirect();
		} catch (err) {
			console.error(err);
		}
	}
}

/**
 * Handle callback if `code` param is present
 * @param params
 */
export async function callback(params: URLSearchParams) {
	const currentUserManager = get(userManager);
	try {
		if (!params.has('code')) throw new Error('auth:store:authenticate: missing code');
		// const user = await userManager.signinCallback();
		const oidcUser = await currentUserManager.signinRedirectCallback();
		await setAuth(oidcUser);

		// TODO send to original target page
		await goto('/dashboard');
	} catch (err) {
		console.error(err);
		await goto('/');
	}
}

/**
 * Rehydrate `user` state from localStorage if exist.
 * when page is full-refeshed, this will reinstate user's state
 * This should be added to root layout's onMount().
 * @param params
 */
export async function rehydrate(params: URLSearchParams) {
	const currentUserManager = get(userManager);
	if (params.has('code')) return;
	let user = await currentUserManager.getUser();
	// check if stale user exist, clean the stores if needed.
	if (!user) {
		clearUserState();
		return;
	}
	if (user.expired) {
		try {
			user = await currentUserManager.signinSilent();
		} catch (err) {
			console.warn(err);
			// if refresh token also expired, then remove local stale user from svelte-store, cookies and local storage
			clearUserState();
			await currentUserManager.removeUser();
			return;
		}
	}
	if (user?.id_token) {
		await setAuth(user);
	}
}

/**
 * trigger SSO logout
 */
export async function logout() {
	const currentUserManager = get(userManager);
	// const post_logout_redirect_uri = window.location.href;
	// await userManager.revokeTokens()
	await currentUserManager.signoutRedirect();
}

/**
 * Private API
 */

/**
 * `setAuth` sets `oidcUser` properties into `auth` store.
 * `oidcUser` is loaded from `sessionStore` if exists or from 'oidc-client-ts` after callback
 * @param oidcUser
 */
async function setAuth(oidcUser: User) {
	const profile = await getProfile(oidcUser);
	auth.set({
		isAuthenticated: true,
		token: oidcUser.id_token,
		profile
	});
	// set token cookie to pass to backend for every request.
	Cookies.set('token', oidcUser.id_token!);
}

async function getProfile(oidcUser: User): Promise<AppUser> {
	const { profile, access_token } = oidcUser;
	const sub = profile.sub;
	const name = profile.name ?? '';
	const email = profile.email ?? (profile.upn as string) ?? '';
	// profile.picture ||= '';
	let picture = profile.picture ?? '';
	const roles = (profile.roles as Role[]) ?? ['Policy.Read' as Role];

	// in the case of provider==Azure, lets get the real picture url
	if (picture?.startsWith('https://graph.microsoft.com')) {
		try {
			picture = await getAzureProfilePicture(access_token);
		} catch (err) {
			console.error(err);
		}
	}

	return { sub, name, email, picture, roles };
}

async function getAzureProfilePicture(access_token: string) {
	const res = await fetch('https://graph.microsoft.com/v1.0/me/photos/48x48/$value', {
		headers: {
			Authorization: `Bearer ${access_token}`,
			'Content-Type': 'image/jpg'
		},
		cache: 'force-cache'
	});
	if (!res.ok) throw { code: res.status, message: res.statusText };

	const data = await res.arrayBuffer();
	const pictureBase64 = btoa(String.fromCharCode(...new Uint8Array(data)));
	// const pictureBase64 = Buffer.from(data).toString('base64');
	return `data:image/jpeg;base64, ${pictureBase64}`;
}
