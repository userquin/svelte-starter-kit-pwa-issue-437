import { ssoAzureADConfig } from '$lib/config';
import type { AzureADUser } from '$lib/models/types/user';
import { COOKIE_ACCESS_TOKEN_KEY, COOKIE_CODE_VERIFIER_KEY, COOKIE_ID_TOKEN_KEY, COOKIE_REFRESH_TOKEN_KEY, COOKIE_STATE_KEY, getCookie, setCookie, setUser } from '$lib/utils/cookies';
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
	const { access_token, expires_in, ext_expires_in, refresh_token, id_token } = await getToken(code, code_verifier, redirect_uri);
	if (!access_token) throw error(401, { code: 401, message: 'Login failed. access_token missing' });

	// get user
	const azureUser: AzureADUser = await getUser(access_token);
	// azureUser.avatar_url = await getProfilePicture(access_token);
	setUser(cookies, { azure: azureUser }, expires_in);
	setCookie(cookies, COOKIE_ACCESS_TOKEN_KEY, access_token, expires_in);
	setCookie(cookies, COOKIE_ID_TOKEN_KEY, id_token, expires_in);
	// TODO: expire refresh_token on time provided by `getToken`
	setCookie(cookies, COOKIE_REFRESH_TOKEN_KEY, refresh_token, ext_expires_in);
	throw redirect(302, '/dashboard');
};

async function getToken(code: string, code_verifier: string, redirect_uri: string) {
	const tokenParams = { client_id, grant_type, redirect_uri, code, code_verifier };
	// HINT: we need `Origin` header, as we are fetching token via back-channel. otherwise you hit error: AADSTS9002327
	const r = await fetch(token_endpoint, {
		method: 'POST',
		headers: { 'Content-Type': 'application/x-www-form-urlencoded', Origin: 'thisismyapp' },
		body: new URLSearchParams(tokenParams).toString()
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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function getProfilePicture(token: string) {
	const res = await fetch('https://graph.microsoft.com/v1.0/me/photos/48x48/$value', {
		headers: {
			Authorization: `Bearer ${token}`,
			'Content-Type': 'image/jpg'
		}
	});

	const data = await res.arrayBuffer();
	const pictureBase64 = Buffer.from(data).toString('base64');
	return `data:image/jpeg;base64, ${pictureBase64}`;
}
