import { PUBLIC_CONFY_SENTRY_DSN } from '$env/static/public';

import { dev } from '$app/environment';
import { guard, setUser } from '$lib/middleware';
import { Logger } from '$lib/utils';
import * as Sentry from '@sentry/svelte';
import { BrowserTracing } from '@sentry/tracing';
import type { HandleFetch, HandleServerError } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
/**
 * Code in hooks.server.ts will run when the application starts up,
 * making them useful for initializing database clients, Sentry and so on.
 */

// TODO: https://github.com/sveltejs/kit/issues/6731

// Setup logger
if (!dev) {
	Logger.enableProductionMode();
}

// for graceful termination
process.on('SIGINT', function () {
	process.exit();
}); // Ctrl+C
process.on('SIGTERM', function () {
	process.exit();
}); // docker stop

// Read: https://github.com/sveltejs/kit/blob/master/documentation/docs/07-hooks.md

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
// export const handle = sequence(setUser, guard, houdini, logger);
export const handle = sequence(setUser);

export const handleServerError: HandleServerError = ({ error, event }) => {
	console.error('hooks:server:handleServerError:', error);
	Sentry.setExtra('event', event);
	Sentry.captureException(error);
	const err = error as App.Error;
	return {
		message: err.message ?? 'Whoops!',
		context: err.context
	};
};

export const handleFetch: HandleFetch = async ({ event, request, fetch }) => {
	console.log('hooks.server.ts, HandleFetch:');
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
