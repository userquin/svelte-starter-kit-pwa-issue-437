/**
 * NOTE:
 * To prevent accidentally leaking env variables to the client,
 * only variables prefixed with VITE_ and CONFY_  are exposed to your Vite-processed code.
 */

import { env as dynPubEnv } from '$env/dynamic/public';
import { PUBLIC_GITHUB_API_URL } from '$env/static/public';

// dynamic: this config can be imported into client-side code.
export const tenant = {
	domainNane: dynPubEnv.PUBLIC_DOMAIN_NAME
};

// dynamic: Auth
export const baseUrl = dynPubEnv.PUBLIC_BASE_URL ?? '';

export const azureAuthConfig = {
	authority: dynPubEnv.PUBLIC_CONFY_SSO_AZUREAD_AUTHORITY ?? '',
	client_id: dynPubEnv.PUBLIC_CONFY_SSO_AZUREAD_CLIENT_ID ?? ''
};
export const googlAuthConfig = {
	authority: dynPubEnv.PUBLIC_CONFY_SSO_GOOGLE_AUTHORITY ?? '',
	client_id: dynPubEnv.PUBLIC_CONFY_SSO_GOOGLE_CLIENT_ID ?? '',
	client_secret: dynPubEnv.PUBLIC_CONFY_SSO_GOOGLE_CLIENT_SECRET ?? ''
};

// static: GitHub
export const github = {
	apiUrl: PUBLIC_GITHUB_API_URL
};

// static: Constants
export const siteSeoTwitter = {
	site: '@username',
	title: 'Twitter Card Title',
	description: 'Description of Twitter Card',
	image: 'https://www.example.com/images/cover.jpg',
	imageAlt: 'Alt text for the card!'
};
