/**
 * Protect the route
 * It shoud be the last middleware
 */

import { AuthLogger } from '$lib/utils';
import { redirect, type Handle } from '@sveltejs/kit';

export const guard = (async ({ event, resolve }) => {
	const { locals } = event;
	// TODO:
	// check if user present
	// get user roles
	// check if role has access to target route
	AuthLogger.debug('guard:locals.user', locals.user);

	if (event.url.pathname.startsWith('/dashboard')) {
		if (!event.locals.user) {
			throw redirect(303, `${event.url.origin}/login`);
		}
		if (event.url.pathname.startsWith('/dashboard/admin')) {
			if (!event.locals.user.roles?.includes('Policy.Write')) {
				throw redirect(303, `${event.url.origin}/dashboard`);
			}
		}
	}
	const response = await resolve(event);
	return response;
}) satisfies Handle;
