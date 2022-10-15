import type { Handle, HandleClientError, HandleServerError } from '@sveltejs/kit';
// import { ENVIRONMENT, SENTRY_DSN } from '$env/static/private';
// import Toucan from 'toucan-js';

// Red: https://github.com/sveltejs/kit/blob/master/documentation/docs/07-hooks.md

// Invoked for each endpoint called and initially for SSR router
export const handle: Handle = async ({ event, resolve }) => {
	const { cookies } = event;
	let userid = cookies.get('userid');

	if (!userid) {
		// if this is the first time the user has visited this app,
		// set a cookie so that we recognise them when they return
		userid = crypto.randomUUID();
		cookies.set('userid', userid, { path: '/' });
	}

	event.locals.userid = userid;

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
