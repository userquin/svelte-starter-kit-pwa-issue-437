import { clearUser } from '$lib/utils/cookies';
import { redirect, type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ cookies }) => {
	clearUser(cookies);

	throw redirect(302, '/');
};
