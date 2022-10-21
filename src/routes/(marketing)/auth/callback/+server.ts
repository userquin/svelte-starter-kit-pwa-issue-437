import { env as dynPriEnv } from '$env/dynamic/private';
import { PUBLIC_GITHUB_API_URL as githubApiBaseUrl } from '$env/static/public';
import type { GithubUser } from '$lib/models/types/user';
import { COOKIE_ACCESS_TOKEN_KEY, COOKIE_REFRESH_TOKEN_KEY, COOKIE_STATE_KEY, getCookie, setCookie, setUser } from '$lib/utils/cookies';
import { error, redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

const client_id = dynPriEnv.CONFY_AUTH_CLIENT_ID;
const client_secret = dynPriEnv.CONFY_AUTH_CLIENT_SECRET;
const auth_token_endpoint = dynPriEnv.CONFY_AUTH_TOKEN_ENDPOINT ?? '';

export const GET: RequestHandler = async ({ url, cookies }) => {
	const cookie_state = getCookie(cookies, COOKIE_STATE_KEY);
	const state = url.searchParams.get('state');
	// To protect against `cross-site request forgery` attacks, verify states are equal
	if (!cookie_state || !state || cookie_state != state) throw error(401, { code: 401, message: 'Login failed. state not equal' });

	const code = url.searchParams.get('code');
	if (!code) throw error(401, { code: 401, message: 'Login failed. code empty' });

	// get accessToken, expires_in
	const { access_token, expires_in, refresh_token, refresh_token_expires_in } = await getToken(code);
	if (!access_token) throw error(401, { code: 401, message: 'Login failed. access_token empty' });

	// get user
	const githubUser: GithubUser = await getUser(access_token);
	setUser(cookies, { github: githubUser }, expires_in);
	setCookie(cookies, COOKIE_ACCESS_TOKEN_KEY, access_token, expires_in);
	// TODO use refresh_token
	setCookie(cookies, COOKIE_REFRESH_TOKEN_KEY, refresh_token, refresh_token_expires_in);

	// get emails
	// const emails = await getEmail(access_token);
	// console.log(emails);

	throw redirect(302, '/dashboard');
};

async function getToken(code: string) {
	const r = await fetch(auth_token_endpoint, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Accept: 'application/json'
		},
		body: JSON.stringify({
			client_id,
			client_secret,
			code
		})
	});
	return await r.json();
}

async function getUser(token: string) {
	const r = await fetch(`${githubApiBaseUrl}/user`, {
		headers: {
			Accept: 'application/json',
			Authorization: `Bearer ${token}`
		}
	});
	return await r.json();
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function getEmail(token: string) {
	const r = await fetch(`${githubApiBaseUrl}/user/emails`, {
		headers: {
			Accept: 'application/json',
			Authorization: `Bearer ${token}`
		}
	});
	return await r.json();
}
