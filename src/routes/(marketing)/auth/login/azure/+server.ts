import { ssoAzureADConfig } from '$lib/config';
import { pkceChallenge } from '$lib/utils';
import { COOKIE_CODE_VERIFIER_KEY, COOKIE_STATE_KEY, setCookie } from '$lib/utils/cookies';
import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

const authEndpoint = ssoAzureADConfig.authorization_endpoint;
const authParams = {
	response_type: 'code',
	response_mode: 'query',
	client_id: ssoAzureADConfig.client_id,
	scope: ssoAzureADConfig.scope,
	code_challenge_method: 'S256'
};

export const GET: RequestHandler = async ({ url, locals, cookies }) => {
	// redirect user if logged in
	if (locals.user) {
		throw redirect(302, '/dashboard');
	}
	// otherwise, redirect to auth provider

	const redirect_uri = `${url.origin}/auth/callback/azure`;
	const state = crypto.randomUUID(); // The unguessable random string
	setCookie(cookies, COOKIE_STATE_KEY, state, 5 * 1000);
	const { code_verifier, code_challenge } = pkceChallenge(43);
	setCookie(cookies, COOKIE_CODE_VERIFIER_KEY, code_verifier, 5 * 1000);

	const urlEncoded = new URLSearchParams({ ...authParams, state, code_challenge, redirect_uri }).toString();
	throw redirect(302, `${authEndpoint}?${urlEncoded}`);
};
