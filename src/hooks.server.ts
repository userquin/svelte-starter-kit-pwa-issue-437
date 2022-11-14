import { PUBLIC_CONFY_SENTRY_DSN } from '$env/static/public';
import * as Sentry from '@sentry/svelte';
import { BrowserTracing } from '@sentry/tracing';
import type { Handle, HandleFetch, HandleServerError } from '@sveltejs/kit';

/**
 * Code in hooks.server.ts will run when the application starts up,
 * making them useful for initializing database clients, Sentry and so on.
 */

// for graceful termination
process.on('SIGINT', function () {
	process.exit();
}); // Ctrl+C
process.on('SIGTERM', function () {
	process.exit();
}); // docker stop

// Red: https://github.com/sveltejs/kit/blob/master/documentation/docs/07-hooks.md

// TODO : https://github.com/chientrm/svelty/blob/main/src/hooks.server.ts

// Initialize the Sentry SDK here
if (PUBLIC_CONFY_SENTRY_DSN) {
	Sentry.init({
		dsn: PUBLIC_CONFY_SENTRY_DSN,
		release: __APP_VERSION__,
		initialScope: {
			tags: { source: 'server' }
		},
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
	const token = cookies.get('access_token');
	if (token) {
		event.locals.token = token;
	}
	const userString = cookies.get('user');
	if (userString) {
		// TODO: decrypt user cookie
		const user = JSON.parse(userString);
		event.locals.user = user;
	}

	return resolve(event);
};

export const handleServerError: HandleServerError = ({ error, event }) => {
	console.error('hooks:server:handleServerError:', error);
	Sentry.setExtra('event', event);
	Sentry.captureException(error);
	const err = error as App.Error;
	return {
		message: err.message ?? 'Whoops!',
		code: err.code ?? 418,
		context: err.context
	};
};

export const handleFetch: HandleFetch = async ({ event, request, fetch }) => {
	console.log('hooks.server.ts, HandleFetch, Token:');
	const { locals } = event;

	if (request.url.startsWith('https://graph.microsoft.com')) {
		if (locals.token) {
			request.headers.set('Authorization', `Bearer ${locals.token}`);
		}
	}
	/*
	if (request.url.startsWith('https://api.yourapp.com/')) {
		// clone the original request, but change the URL
		request = new Request(
			request.url.replace('https://api.yourapp.com/', 'http://localhost:9999/'),
			request
		);
	}
	*/
	return fetch(request);
};
