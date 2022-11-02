import { CONFY_SENTRY_DSN } from '$env/static/private';
// import * as Sentry from '@sentry/browser';
import * as Sentry from '@sentry/svelte';
import { BrowserTracing } from '@sentry/tracing';
import type { Handle, HandleFetch, HandleClientError } from '@sveltejs/kit';

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

export const handle: Handle = async ({ event, resolve }) => {
	console.log('hooks.client.ts, Handle, Token:');
	event.request.headers.set('Authorization', 'Bearer me,me,me');

	const response = await resolve(event);
	// response.headers['authorization'] = 'me,me,me'
	return response;
};
export const handleFetch: HandleFetch = async ({ event, request, fetch }) => {
	console.log('hooks.client.ts, HandleFetch, Token:');
	// request.headers.set('Authorization', 'Bearer me,me,me')

	return fetch(request);
};

export const handleClientError: HandleClientError = ({ error, event }) => {
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
