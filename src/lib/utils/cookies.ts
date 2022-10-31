// import { encrypt } from '$lib/utils';
import { dev } from '$app/environment';
import type { User } from '$lib/models/types/user';
import { encrypt } from '$lib/utils';
import type { Cookies } from '@sveltejs/kit';
export const COOKIE_ACCESS_TOKEN_KEY = 'sb:access_token';
export const COOKIE_ID_TOKEN_KEY = 'sb:id_token';
export const COOKIE_REFRESH_TOKEN_KEY = 'sb:refresh_token';
export const COOKIE_USER_KEY = 'sb:user';
export const COOKIE_STATE_KEY = 'sb:state';
export const COOKIE_CODE_VERIFIER_KEY = 'sb:code_verifier';

export function setCookie(cookies: Cookies, name: string, value: string, expiresIn = 0) {
	cookies.set(name, value, {
		// send cookie for every page
		path: '/',
		// server side only cookie so you can't use `document.cookie`
		httpOnly: true,
		// only requests from same site can send cookies
		// https://developer.mozilla.org/en-US/docs/Glossary/CSRF
		sameSite: 'strict',
		expires: new Date(Date.now() + expiresIn),
		// only sent over HTTPS in production
		secure: !dev,
		// secure: process.env.NODE_ENV === 'production',
		// set cookie to expire after a month
		maxAge: 60 * 60 * 24 * 30
	});
}

export function getCookie(cookies: Cookies, name: string) {
	return cookies.get(name);
}

export function clearCookie(cookies: Cookies, name: string) {
	cookies.delete(name, { path: '/' });
	// setCookie(cookies, name, '');
}

export function setUser(cookies: Cookies, user: User, expiresIn: number) {
	setCookie(cookies, COOKIE_USER_KEY, encrypt(JSON.stringify(user)), expiresIn);
}

export function getUser(cookies: Cookies) {
	const userString = getCookie(cookies, COOKIE_USER_KEY);
	return userString ? JSON.parse(userString) : null;
}

export function clearUser(cookies: Cookies) {
	cookies.delete(COOKIE_ACCESS_TOKEN_KEY, { path: '/' });
	cookies.delete(COOKIE_ID_TOKEN_KEY, { path: '/' });
	cookies.delete(COOKIE_REFRESH_TOKEN_KEY, { path: '/' });
	cookies.delete(COOKIE_STATE_KEY, { path: '/' });
	cookies.delete(COOKIE_CODE_VERIFIER_KEY, { path: '/' });
	cookies.delete(COOKIE_USER_KEY, { path: '/' });
	// setCookie(cookies, COOKIE_USER_KEY, '');
}
