import { Logger } from '$lib/utils';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

const log = new Logger('logout:server');

/**
 * This route is set as `post_logout_redirect_uri`
 * Needed it to clear any server set cookies
 */
export const load = (async ({ url, locals, cookies }) => {
	const post_logout_redirect_uri = url.searchParams.get('post_logout_redirect_uri');
	log.debug('load:user:', locals.user);
	log.debug('load:token:', cookies.get('token'));
	cookies.delete('token');
	if (post_logout_redirect_uri) {
		throw redirect(303, post_logout_redirect_uri);
	} else {
		throw redirect(303, '/');
	}
}) satisfies PageServerLoad;
