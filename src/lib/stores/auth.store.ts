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
	// unset access_token/profile cookie
	Cookies.remove('access_token');
	Cookies.remove('user');
}

const azureUserManager = createUserManager({
	authority: dynPubEnv.PUBLIC_CONFY_SSO_AZUREAD_AUTHORITY,
	client_id: dynPubEnv.PUBLIC_CONFY_SSO_AZUREAD_CLIENT_ID,
	redirect_uri: appUrl, // window.location.origin,
	post_logout_redirect_uri: appUrl, // window.location.origin,
	scope: 'profile openid User.Read', // email
	filterProtocolClaims: true,
	loadUserInfo: true
	// accessTokenExpiringNotificationTime: 300,
	// silentRequestTimeout: 20000,
});
const googleUserManager = createUserManager({
	authority: dynPubEnv.PUBLIC_CONFY_SSO_GOOGLE_AUTHORITY,
	client_id: dynPubEnv.PUBLIC_CONFY_SSO_GOOGLE_CLIENT_ID,
	client_secret: dynPubEnv.PUBLIC_CONFY_SSO_GOOGLE_CLIENT_SECRET,
	redirect_uri: appUrl, // window.location.origin,
	post_logout_redirect_uri: appUrl, // window.location.origin,
	scope: 'profile openid email',
	filterProtocolClaims: true,
	loadUserInfo: true,
	// accessTokenExpiringNotificationTime: 300,
	// silentRequestTimeout: 20000,
	metadataSeed: {
		// end_session_endpoint: 'https://www.google.com/accounts/Logout?continue=https://appengine.google.com/_ah/logout',
		end_session_endpoint: appUrl
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
function setProvider(newProvider: Provider) {
	window.localStorage.setItem(LocalStorageProviderKey, newProvider);
	provider.set(newProvider);
}

/**
 * Stores
 */
const seedProvider = browser ? window.localStorage.getItem(LocalStorageProviderKey) ?? 'azure' : 'azure';
export const provider = writable(seedProvider as Provider);
const userManager = derived(provider, ($provider) => getUserManager($provider));
export const auth = writable<{ isAuthenticated: boolean; token?: string; profile?: AppUser }>({ isAuthenticated: false });

/**
 * Public API
 */

/**
 * trigger SSO login
 * @param newProvider
 */
export async function login(newProvider: Provider = 'azure') {
	setProvider(newProvider);
	const currentUserManager = get(userManager);
	const user = await currentUserManager.getUser();

	if (user && !user.expired && user.access_token) {
		await setAuth(user);
	} else {
		try {
			await currentUserManager.signinRedirect();
		} catch (err) {
			console.error(err);
		}
	}
}

/**
 * Handle callback if `code` param is present, or rehydrate `user` from localStorage if exist.
 * This should be added to root layout's onMount().
 * @param params
 */
export async function authenticate(params: URLSearchParams) {
	const currentUserManager = get(userManager);

	if (params.has('code')) {
		try {
			// const user = await userManager.signinCallback();
			const oidcUser = await currentUserManager.signinRedirectCallback();
			const profile = await setAuth(oidcUser);

			// set access_token/profile cookies to pass to backend for every request.
			Cookies.set('access_token', oidcUser.access_token);
			Cookies.set('user', JSON.stringify({ ...profile, picture: undefined }));

			// TODO send to original target page
			await goto('/dashboard');
		} catch (err) {
			console.error(err);
			await goto('/');
		}
	} else {
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
		if (user?.access_token) {
			await setAuth(user);
		}
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
		token: oidcUser.access_token,
		profile
	});

	return profile;
}

async function getProfile(oidcUser: User): Promise<AppUser> {
	const { profile, access_token } = oidcUser;
	const sub = profile.sub;
	const name = profile.name ?? '';
	const email = profile.email ?? (profile.upn as string) ?? '';
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
