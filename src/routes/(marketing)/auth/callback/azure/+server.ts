import { ssoAzureADConfig } from '$lib/config';
import type { PingUser } from '$lib/models/types/user';
import { COOKIE_ACCESS_TOKEN_KEY, COOKIE_CODE_VERIFIER_KEY, COOKIE_REFRESH_TOKEN_KEY, COOKIE_STATE_KEY, getCookie, setCookie, setUser } from '$lib/utils/cookies';
import { error, redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

const grant_type = 'authorization_code';
const { client_id, token_endpoint, userinfo_endpoint } = ssoAzureADConfig;

export const GET: RequestHandler = async ({ url, cookies }) => {
	const code_verifier = getCookie(cookies, COOKIE_CODE_VERIFIER_KEY);
	if (!code_verifier) throw error(401, { code: 401, message: 'Login failed. code_verifier missing' });

	const cookie_state = getCookie(cookies, COOKIE_STATE_KEY);
	const state = url.searchParams.get('state');
	// To protect against `cross-site request forgery` attacks, verify states are equal
	if (!cookie_state || !state || cookie_state != state) throw error(401, { code: 401, message: 'Login failed. state not equal' });

	const code = url.searchParams.get('code');
	if (!code) throw error(401, { code: 401, message: 'Login failed. code missing' });

	const redirect_uri = `${url.origin}/auth/callback/azure`;
	const { access_token, expires_in, refresh_token, id_token } = await getToken(code, code_verifier, redirect_uri);
	if (!access_token) throw error(401, { code: 401, message: 'Login failed. access_token missing' });

	// get user
	const pingUser: PingUser = await getUser(access_token);
	setUser(cookies, { ping: pingUser }, expires_in);
	setCookie(cookies, COOKIE_ACCESS_TOKEN_KEY, access_token, expires_in);
	// TODO expire refresh_token on time provided by `getToken`
	setCookie(cookies, COOKIE_REFRESH_TOKEN_KEY, refresh_token, 60 * 60 * 24 * 30);
	throw redirect(302, '/dashboard');
};

async function getToken(code: string, code_verifier: string, redirect_uri: string) {
	const authDetails = { client_id: client_id, grant_type: grant_type, redirect_uri: redirect_uri, code: code, code_verifier: code_verifier };
	const r = await fetch(token_endpoint, {
		method: 'POST',
		headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
		body: new URLSearchParams(authDetails).toString()
	});
	return await r.json();
}

async function getUser(token: string) {
	const r = await fetch(userinfo_endpoint, {
		headers: {
			Authorization: `Bearer ${token}`
		}
	});

	return await r.json();
}
