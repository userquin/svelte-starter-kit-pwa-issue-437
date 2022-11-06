import { CONFY_SENTRY_DSN } from '$env/static/private';
// import * as Sentry from '@sentry/browser';
import * as Sentry from '@sentry/svelte';
import { BrowserTracing } from '@sentry/tracing';
import type { Handle, HandleClientError, HandleFetch } from '@sveltejs/kit';

// Initialize the Sentry SDK here
if (CONFY_SENTRY_DSN) {
	Sentry.init({
		dsn: CONFY_SENTRY_DSN,
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

export const handleClientError: HandleClientError = ({ error, event }) => {
	console.log('in hooks.client.ts: handleClientError:', error);
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
