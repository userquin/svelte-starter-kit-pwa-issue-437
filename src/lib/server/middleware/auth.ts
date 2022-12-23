import { env as dynPubEnv } from '$env/dynamic/public';
import type { Role, User as AppUser } from '$lib/models/types/user';
import { AuthLogger } from '$lib/utils';
import type { Handle } from '@sveltejs/kit';
import jwt, { type JwtPayload, type VerifyOptions } from 'jsonwebtoken';
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

export const auth = (async ({ event, resolve }) => {
	const { cookies } = event;

	const token = cookies.get('token');
	if (token) {
		try {
			const jwtObj = jwt.decode(token, { complete: true });
			const iss = (jwtObj?.payload as JwtPayload).iss;
			const kid = jwtObj?.header.kid;
			assert.ok(iss && kid && clients.has(iss) && verifyOptions.has(iss), 'Unknwon issuer');
			const client = clients.get(iss) as JwksClient;
			const key = await client.getSigningKey(kid);
			const signingKey = key.getPublicKey();

			const jwtPayload = jwt.verify(token, signingKey, verifyOptions.get(iss)) as JwtPayload;
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
			AuthLogger.warn('bad token. deleteing token cookie');

			// When token expire, this is not working <-- `cookies.delete()` is not deleting cookie when using along with `throw redirect()`
			// cookies.delete('token', { path: '/' });
			//throw redirect(307, `${event.url.origin}/login`); <-- ERR_TOO_MANY_REDIRECTS client error

			// Workaround // <-- so, i have to do this way, with cavities for progressively enhanced forms (clicking form submit button after token expire)
			return new Response(undefined, {
				status: 307,
				headers: {
					location: `${event.url.origin}/login`,
					'set-cookie': `token=; Path=/; Expires=${new Date(0)}`
				}
			});
		}
	}

	const response = await resolve(event);
	return response;
}) satisfies Handle;

async function getOpenIdConfiguration(issuer: string) {
	const resp = await fetch(`${issuer}/.well-known/openid-configuration`);
	return (await resp.json()) as OidcMetadata;
}
