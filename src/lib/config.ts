/**
 * NOTE:
 * To prevent accidentally leaking env variables to the client,
 * only variables prefixed with VITE_ and CONFY_  are exposed to your Vite-processed code.
 */

import { env as dynPriEnv } from '$env/dynamic/private';
import { env as dynPubEnv } from '$env/dynamic/public';
import { GITHUB_API_KEY } from '$env/static/private';
import { PUBLIC_GITHUB_API_URL } from '$env/static/public';

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
export const auth = {
	token: dynPriEnv.CONFY_API_TOKEN
};

export const ssoGithubConfig = {
	authorization_endpoint: dynPriEnv.CONFY_SSO_GITHUB_AUTHORIZATION_ENDPOINT ?? '',
	token_endpoint: dynPriEnv.CONFY_SSO_GITHUB_TOKEN_ENDPOINT ?? '',
	userinfo_endpoint: dynPriEnv.CONFY_SSO_GITHUB_USERINFO_ENDPOINT ?? '',
	logout_endpoint: dynPriEnv.CONFY_SSO_GITHUB_LOGOUT_ENDPOINT ?? '',
	client_id: dynPriEnv.CONFY_SSO_GITHUB_CLIENT_ID ?? '',
	client_secret: dynPriEnv.CONFY_SSO_GITHUB_CLIENT_SECRET ?? '',
	scope: dynPriEnv.CONFY_SSO_GITHUB_SCOPE ?? ''
};

export const ssoAzureADConfig = {
	authorization_endpoint: dynPriEnv.CONFY_SSO_AZUREAD_AUTHORIZATION_ENDPOINT ?? '',
	token_endpoint: dynPriEnv.CONFY_SSO_AZUREAD_TOKEN_ENDPOINT ?? '',
	userinfo_endpoint: dynPriEnv.CONFY_SSO_AZUREAD_USERINFO_ENDPOINT ?? '',
	logout_endpoint: dynPriEnv.CONFY_SSO_AZUREAD_LOGOUT_ENDPOINT ?? '',
	client_id: dynPriEnv.CONFY_SSO_AZUREAD_CLIENT_ID ?? '',
	acr_values: dynPriEnv.CONFY_SSO_AZUREAD_ACR_VALUES ?? '', // level Of Assurance
	scope: dynPriEnv.CONFY_SSO_AZUREAD_SCOPE ?? ''
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
