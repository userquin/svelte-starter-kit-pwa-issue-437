import { dev } from '$app/environment';
import { ssoAzureADConfig } from '$lib/config';
import { clearUser } from '$lib/utils/cookies';
import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

const { logout_endpoint } = ssoAzureADConfig;

export const GET: RequestHandler = async ({ cookies, url }) => {
	clearUser(cookies);
	if (dev) throw redirect(302, '/');
	throw redirect(302, `${logout_endpoint}?TargetResource=${url.origin}`);
};
