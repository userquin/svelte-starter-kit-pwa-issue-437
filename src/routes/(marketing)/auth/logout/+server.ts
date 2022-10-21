import { clearUser } from '$lib/utils/cookies';
import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ cookies }) => {
	clearUser(cookies);

	throw redirect(302, '/');
};
