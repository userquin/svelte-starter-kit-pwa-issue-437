import { ssoGithubConfig } from '$lib/config';
import { COOKIE_STATE_KEY, setCookie } from '$lib/utils/cookies';
import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

const { client_id, scope, authorization_endpoint } = ssoGithubConfig;

export const GET: RequestHandler = async ({ url, locals, cookies }) => {
	// redirect user if logged in
	if (locals.user) {
		throw redirect(302, '/dashboard');
	}
	// otherwise, redirect to auth provider

	const redirect_uri = `${url.origin}/auth/callback/github`;
	const state = crypto.randomUUID(); // The unguessable random string
	setCookie(cookies, COOKIE_STATE_KEY, state, 5 * 1000);
	const allow_signup = 'true';

	const urlEncoded = new URLSearchParams({ client_id, scope, state, allow_signup, redirect_uri }).toString();
	throw redirect(302, `${authorization_endpoint}?${urlEncoded}`);
};
