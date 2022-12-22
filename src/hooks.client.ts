import { PUBLIC_CONFY_SENTRY_DSN } from '$env/static/public';
// import * as Sentry from '@sentry/browser';
import { dev } from '$app/environment';
import { Logger } from '$lib/utils';
import * as Sentry from '@sentry/svelte';
import { BrowserTracing } from '@sentry/tracing';
import type { HandleClientError } from '@sveltejs/kit';

// Setup logger
if (!dev) {
	Logger.enableProductionMode();
}

// Initialize the Sentry SDK here
if (PUBLIC_CONFY_SENTRY_DSN) {
	Sentry.init({
		dsn: PUBLIC_CONFY_SENTRY_DSN,
		release: __APP_VERSION__,
		initialScope: {
			tags: { source: 'client' }
		},
		integrations: [new BrowserTracing()],

		// Set tracesSampleRate to 1.0 to capture 100%
		// of transactions for performance monitoring.
		// We recommend adjusting this value in production
		tracesSampleRate: 1.0
	});
}

export const handleClientError = (({ error, event }) => {
	console.error('hooks:client:handleClientError:', error);
	Sentry.setExtra('event', event);
	Sentry.captureException(error);

	const err = error as App.Error;
	return {
		message: err.message ?? 'Whoops!',
		context: err.context
	};
}) satisfies HandleClientError;
