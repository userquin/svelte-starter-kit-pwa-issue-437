import type { Handle, HandleClientError, HandleServerError } from '@sveltejs/kit';
// import { ENVIRONMENT, SENTRY_DSN } from '$env/static/private';
// import Toucan from 'toucan-js';

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
