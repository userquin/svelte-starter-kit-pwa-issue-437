/**
 * Svelte auth store built on `oidc-client-ts`
 * This library shoud be used client-side only, in the browser.
 * This may not work with SSR / SSG
 */
import { browser, dev } from '$app/environment';
import { goto } from '$app/navigation';
import { azureAuthConfig, baseUrl, googlAuthConfig } from '$lib/config-public';
import type { Role, User as AppUser } from '$lib/models/types/user';
import Cookies from 'js-cookie';
import { Log, User, UserManager, type UserManagerSettings, type UserProfile } from 'oidc-client-ts';
import { derived, get, writable } from 'svelte/store';

/**
 * UserManager suports multiple IDP providers
 */

// enable debug logs for `oidc-client-ts`
if (dev) Log.setLogger(console);

const appUrl = dev ? 'http://localhost:5173' : baseUrl;

function createUserManager(config: UserManagerSettings) {
	const userManager = new UserManager(config);

	userManager.events.addUserLoaded(async (user) => {
		userManager.clearStaleState();
		const profile = await getProfile(user.profile, user.access_token);
		auth.update((details) => {
			details.token = user.access_token;
			details.profile = profile;
			return details;
		});
		// set access_token/profile cookie to pass to backend for every request.
		Cookies.set('access_token', user.access_token);
		Cookies.set('user', JSON.stringify({ ...profile, picture: undefined }));
	});

	userManager.events.addUserUnloaded(() => {
		auth.set({ isAuthenticated: false });
		// unset access_token/profile cookie
		Cookies.remove('access_token');
		Cookies.remove('user');
	});

	return userManager;
}

const azureUserManager = createUserManager({
	authority: azureAuthConfig.authority,
	client_id: azureAuthConfig.client_id,
	redirect_uri: appUrl, // window.location.origin,
	post_logout_redirect_uri: appUrl, // window.location.origin,
	scope: 'profile openid User.Read', // email
	filterProtocolClaims: true,
	loadUserInfo: true,
	automaticSilentRenew: true,
	// accessTokenExpiringNotificationTime: 300,
	// silentRequestTimeout: 20000,
	includeIdTokenInSilentRenew: false
});
const googleUserManager = createUserManager({
	authority: googlAuthConfig.authority,
	client_id: googlAuthConfig.client_id,
	client_secret: googlAuthConfig.client_secret,
	redirect_uri: appUrl, // window.location.origin,
	post_logout_redirect_uri: appUrl, // window.location.origin,
	scope: 'profile openid email',
	filterProtocolClaims: true,
	loadUserInfo: true,
	automaticSilentRenew: true,
	// accessTokenExpiringNotificationTime: 300,
	// silentRequestTimeout: 20000,
	includeIdTokenInSilentRenew: false,
	metadataSeed: {
		// end_session_endpoint: 'https://www.google.com/accounts/Logout?continue=https://appengine.google.com/_ah/logout',
		end_session_endpoint: 'http://localhost:5173'
	},
	extraQueryParams: { access_type: 'offline', prompt: 'consent' }
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
		setAuth(user);
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
			const user = await currentUserManager.signinRedirectCallback();
			setAuth(user);
			// TODO send to original target page
			goto('/dashboard');
		} catch (err) {
			console.error(err);
			goto('/');
		}
	} else {
		const user = await currentUserManager.getUser();

		if (user && !user.expired && user.access_token) {
			setAuth(user);
		}
	}
}

/**
 * trigger SSO logout
 */
export async function logout() {
	try {
		const currentUserManager = get(userManager);
		// const post_logout_redirect_uri = window.location.href;
		// await userManager.revokeTokens()
		await currentUserManager.signoutRedirect();
	} catch (err) {
		console.error(err);
	} finally {
		console.log('logout finally');
	}
}

/**
 * silent renew token using renew_token
 */
export async function renewToken() {
	try {
		const currentUserManager = get(userManager);
		const user = await currentUserManager.signinSilent();
		if (user) setAuth(user);
	} catch (err) {
		console.error(err);
		goto('/');
	}
}

/**
 * Private API
 */

async function setAuth(oidcUser: User) {
	const profile = await getProfile(oidcUser.profile, oidcUser.access_token);
	auth.set({
		isAuthenticated: true,
		token: oidcUser.access_token,
		profile
	});
}

async function getProfile(rawProfile: UserProfile, access_token: string): Promise<AppUser> {
	const sub = rawProfile.sub;
	const name = rawProfile.name ?? '';
	const email = rawProfile.email ?? (rawProfile.upn as string) ?? '';
	let picture = rawProfile.picture ?? '';
	const roles = (rawProfile.roles as Role[]) ?? ['Policy.Read' as Role];

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
		}
	});

	const data = await res.arrayBuffer();
	const pictureBase64 = btoa(String.fromCharCode(...new Uint8Array(data)));
	// const pictureBase64 = Buffer.from(data).toString('base64');
	return `data:image/jpeg;base64, ${pictureBase64}`;
}
