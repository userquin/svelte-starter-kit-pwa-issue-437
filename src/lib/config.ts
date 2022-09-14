/**
 * NOTE:
 * To prevent accidentally leaking env variables to the client,
 * only variables prefixed with VITE_ and CONFY_  are exposed to your Vite-processed code.
 */

import { env as dynPubEnv } from '$env/dynamic/public';
import { env as dynPriEnv } from '$env/dynamic/private';
import { PUBLIC_GITHUB_API_URL } from '$env/static/public';
import { GITHUB_API_KEY } from '$env/static/private';

// dynamic: this config can be imported into client-side code.
export const tenant = {
	domainNane: dynPubEnv.PUBLIC_DOMAIN_NAME
};

// dynamic: this config cannot be imported into client-side code.
export const endpoints = {
	// FIXME: workaround https://github.com/sveltejs/kit/issues/6225 remove ` ?? "localhost:8080"`
	api: dynPriEnv.CONFY_API_ENDPOINT ?? 'localhost:8080',
	payment: dynPriEnv.CONFY_PAYMENT_ENDPOINT
};

// static: GitHub
export const github = {
	apiUrl: PUBLIC_GITHUB_API_URL,
	// private: for server-side use only
	apiKey: GITHUB_API_KEY
};

// Constants
export const siteSeoTwitter = {
	site: '@username',
	title: 'Twitter Card Title',
	description: 'Description of Twitter Card',
	image: 'https://www.example.com/images/cover.jpg',
	imageAlt: 'Alt text for the card!'
};
