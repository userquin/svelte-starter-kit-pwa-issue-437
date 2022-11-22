import { Logger } from '$lib/utils';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

const log = new Logger('logout:server');

/**
 * This route is set as `post_logout_redirect_uri`
 * needed it for clear any server set cookies
 */
export const load: PageServerLoad = async ({ locals, cookies }) => {
	log.debug('load:user:', locals.user);
	log.debug('load:token:', cookies.get('token'));
	cookies.delete('token');
	throw redirect(303, '/');
};
