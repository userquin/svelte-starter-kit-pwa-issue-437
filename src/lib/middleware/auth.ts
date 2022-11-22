import { env as dynPubEnv } from '$env/dynamic/public';
import type { Role, User as AppUser } from '$lib/models/types/user';
import { AuthLogger } from '$lib/utils';
import type { Handle } from '@sveltejs/kit';
import type { JwtPayload, VerifyOptions } from 'jsonwebtoken';
import { decode, verify } from 'jsonwebtoken';
import { JwksClient } from 'jwks-rsa';
import assert from 'node:assert';
import type { OidcMetadata } from 'oidc-client-ts';

assert.ok(dynPubEnv.PUBLIC_CONFY_SSO_GOOGLE_AUTHORITY, 'PUBLIC_CONFY_SSO_GOOGLE_AUTHORITY not configered');
assert.ok(dynPubEnv.PUBLIC_CONFY_SSO_AZUREAD_AUTHORITY, 'PUBLIC_CONFY_SSO_AZUREAD_AUTHORITY not configered');

const openIdGoogleConfig = await getOpenIdConfiguration(dynPubEnv.PUBLIC_CONFY_SSO_GOOGLE_AUTHORITY);
const openIdAzureConfig = await getOpenIdConfiguration(dynPubEnv.PUBLIC_CONFY_SSO_AZUREAD_AUTHORITY);

const clients = new Map<string, JwksClient>([
	[dynPubEnv.PUBLIC_CONFY_SSO_GOOGLE_AUTHORITY, new JwksClient({ jwksUri: openIdGoogleConfig.jwks_uri })],
	[dynPubEnv.PUBLIC_CONFY_SSO_AZUREAD_AUTHORITY, new JwksClient({ jwksUri: openIdAzureConfig.jwks_uri })]
]);
const verifyOptions = new Map<string, VerifyOptions>([
	[
		dynPubEnv.PUBLIC_CONFY_SSO_GOOGLE_AUTHORITY,
		{
			audience: '791772336084-vkt37abstm1du92ofdmhgi30vgd7t0oa.apps.googleusercontent.com',
			issuer: dynPubEnv.PUBLIC_CONFY_SSO_GOOGLE_AUTHORITY,
			algorithms: ['RS256']
		}
	],
	[
		dynPubEnv.PUBLIC_CONFY_SSO_AZUREAD_AUTHORITY,
		{
			audience: '3c90cd4c-c906-401e-b45e-19bf4c152f03',
			issuer: dynPubEnv.PUBLIC_CONFY_SSO_AZUREAD_AUTHORITY,
			algorithms: ['RS256']
		}
	]
]);

export const setUser: Handle = async ({ event, resolve }) => {
	const { cookies } = event;

	const token = cookies.get('token');
	if (token) {
		try {
			const jwt = decode(token, { complete: true });
			const iss = (jwt?.payload as JwtPayload).iss;
			const kid = jwt?.header.kid;
			assert.ok(iss && kid && clients.has(iss) && verifyOptions.has(iss), 'Unknwon issuer');
			const client = clients.get(iss) as JwksClient;
			const key = await client.getSigningKey(kid);
			const signingKey = key.getPublicKey();

			const jwtPayload = verify(token, signingKey, verifyOptions.get(iss)) as JwtPayload;
			// AuthLogger.debug('jwtPayload', jwtPayload);
			const user: AppUser = {
				sub: jwtPayload.sub ?? '',
				name: jwtPayload.name ?? '',
				email: jwtPayload.email ?? jwtPayload.upn ?? '',
				roles: (jwtPayload.roles as Role[]) ?? ['Policy.Read' as Role]
			};
			event.locals.user = user;
			event.locals.token = token;
			// TODO: set new token/session encrypted cookie?
		} catch (error) {
			AuthLogger.error(error);
		}
	}

	return await resolve(event);
};

/**
 * Protect the route
 * It shoud be the last middleware
 */
export const guard: Handle = async ({ event, resolve }) => {
	const { locals } = event;
	// TODO:
	// check if user present
	// get user roles
	// check if role has access to current route
	// AuthLogger.debug('guard:locals.user', locals.user);
	return await resolve(event);
};

async function getOpenIdConfiguration(issuer: string) {
	const resp = await fetch(`${issuer}/.well-known/openid-configuration`);
	return (await resp.json()) as OidcMetadata;
}
