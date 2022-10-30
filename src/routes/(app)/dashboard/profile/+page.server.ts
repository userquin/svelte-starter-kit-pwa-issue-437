import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }: { locals: App.Locals }) => {
	if (!locals.user) {
		throw redirect(307, '/auth/login/github');
	}

	return {
		user: locals.user
	};
};
