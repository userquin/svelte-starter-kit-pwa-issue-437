import { building } from '$app/environment';
import { AuthLogger } from '$lib/utils';
import { redirect, type Handle } from '@sveltejs/kit';
/**
 * Protect the route
 * It shoud be the last middleware
 */
export const guard = (async ({ event, resolve }) => {
	// skip auth logic on build to prevent infinite redirection in production mode
	// FIXME: https://github.com/nextauthjs/next-auth/discussions/6186
	if (building) return resolve(event);

	const { locals } = event;
	// TODO:
	// check if user present
	// get user roles
	// check if role has access to target route

	const { user, roles } = (await locals.getSession()) ?? {};
	AuthLogger.debug('guard:locals.user', user);

	if (event.url.pathname.startsWith('/dashboard')) {
		if (!user) {
			throw redirect(303, `${event.url.origin}/auth/signin?callbackUrl=/dashboard`);
		}
		if (event.url.pathname.startsWith('/dashboard/admin')) {
			if (!roles?.includes('Policy.Write')) {
				throw redirect(303, `${event.url.origin}/dashboard`);
			}
		}
	}
	const response = await resolve(event);
	return response;
}) satisfies Handle;
