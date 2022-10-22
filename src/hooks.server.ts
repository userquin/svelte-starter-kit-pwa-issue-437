import { CONFY_SENTRY_DSN } from '$env/static/private';
import { getUser } from '$lib/utils/cookies';
import * as Sentry from '@sentry/svelte';
import { BrowserTracing } from '@sentry/tracing';
import type { Handle, HandleServerError } from '@sveltejs/kit';

// Red: https://github.com/sveltejs/kit/blob/master/documentation/docs/07-hooks.md

// TODO : https://github.com/chientrm/svelty/blob/main/src/hooks.server.ts

// Initialize the Sentry SDK here
if (CONFY_SENTRY_DSN) {
	Sentry.init({
		dsn: CONFY_SENTRY_DSN,
		integrations: [new BrowserTracing()],

		// Set tracesSampleRate to 1.0 to capture 100%
		// of transactions for performance monitoring.
		// We recommend adjusting this value in production
		tracesSampleRate: 1.0
	});
}

// Invoked for each endpoint called and initially for SSR router
export const handle: Handle = async ({ event, resolve }) => {
	const { cookies } = event;
	const user = getUser(cookies);
	// TODO: decrypt user cookie
	event.locals.user = user;

	return resolve(event);
};

export const handleServerError: HandleServerError = ({ error, event }) => {
	console.error(error);
	Sentry.setExtra('event', event);
	Sentry.captureException(error);
	const err = error as App.Error;
	return {
		message: err.message ?? 'Whoops!',
		code: err.code ?? 418,
		context: err.context
	};
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
