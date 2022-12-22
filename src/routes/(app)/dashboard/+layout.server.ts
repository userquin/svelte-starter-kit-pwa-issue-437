import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load = (async ({ locals }) => {
	if (!locals.user) {
		throw redirect(307, '/login');
	}

	return {
		// user: locals.user
		status: 200
	};
}) satisfies LayoutServerLoad;
