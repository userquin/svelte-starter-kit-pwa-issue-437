import { env as dynPriEnv } from '$env/dynamic/private';
import { COOKIE_STATE_KEY, setCookie } from '$lib/utils/cookies';
import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

const authEndpoint = dynPriEnv.CONFY_AUTH_ENDPOINT;
const authParams = {
	client_id: dynPriEnv.CONFY_AUTH_CLIENT_ID ?? '',
	scope: dynPriEnv.CONFY_AUTH_CLIENT_SCOPE ?? ''
};

export const GET: RequestHandler = async ({ url, locals, cookies }) => {
	// redirect user if logged in
	if (locals.user) {
		throw redirect(302, '/dashboard');
	}

	const redirect_uri = `${url.origin}/auth/callback`;
	const state = crypto.randomUUID(); // The unguessable random string
	setCookie(cookies, COOKIE_STATE_KEY, state, 5 * 1000);

	// otherwise, redirect to auth provider
	const urlEncoded = new URLSearchParams({ ...authParams, state, redirect_uri }).toString();
	throw redirect(302, `${authEndpoint}?${urlEncoded}`);
};
