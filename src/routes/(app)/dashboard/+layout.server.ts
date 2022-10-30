import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }: { locals: App.Locals }) => {
	if (!locals.user) {
		throw redirect(307, '/auth/login/github');
	}

	return {
		user: locals.user
	};
};
