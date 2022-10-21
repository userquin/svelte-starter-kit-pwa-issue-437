import { getUser } from '$lib/utils/cookies';
import type { Handle, HandleClientError, HandleServerError } from '@sveltejs/kit';
// import { ENVIRONMENT, SENTRY_DSN } from '$env/static/private';
// import Toucan from 'toucan-js';

// Red: https://github.com/sveltejs/kit/blob/master/documentation/docs/07-hooks.md

// TODO : https://github.com/chientrm/svelty/blob/main/src/hooks.server.ts

// Invoked for each endpoint called and initially for SSR router
export const handle: Handle = async ({ event, resolve }) => {
	const { cookies } = event;
	const user = getUser(cookies);

	event.locals.user = user;

	return resolve(event);
};

export const handleServerError: HandleServerError = ({ error, event }) => {
	console.error(error);
	// example integration with https://sentry.io/
	/*
	if (SENTRY_DSN?.length) {
		const { request } = event,
			sentry = new Toucan({
				dsn: SENTRY_DSN,
				request,
				allowedCookies: /(.*)/,
				allowedHeaders: /(.*)/,
				allowedSearchParams: /(.*)/,
				environment: ENVIRONMENT
			});
		sentry.setExtra('event', event);
	*/
	// Sentry.captureException(error, { event });
};

export const handleClientError: HandleClientError = ({ error, event }) => {
	console.error(error);
	// example integration with https://sentry.io/
	// Sentry.captureException(error, { event });
};

/*
export const handleFetch: HandleFetch = async ({ request, fetch }) => {
	if (request.url.startsWith('https://api.yourapp.com/')) {
		// clone the original request, but change the URL
		request = new Request(
			request.url.replace('https://api.yourapp.com/', 'http://localhost:9999/'),
			request
		);
	}
	return fetch(request);
}
*/
