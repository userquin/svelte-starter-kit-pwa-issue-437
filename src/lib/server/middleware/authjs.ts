/* eslint-disable */
// @ts-nocheck
// FIXME above
import { env as dynPriEnv } from '$env/dynamic/private';
import AzureAD from '@auth/core/providers/azure-ad';
import GitHub from '@auth/core/providers/github';
import Google from '@auth/core/providers/google';
import { SvelteKitAuth } from '@auth/sveltekit';
import type { Handle } from '@sveltejs/kit';

const AZURE_AD_CLIENT_ID = dynPriEnv.AZURE_AD_CLIENT_ID;
const AZURE_AD_CLIENT_SECRET = dynPriEnv.AZURE_AD_CLIENT_SECRET;
const AZURE_AD_TENANT_ID = dynPriEnv.AZURE_AD_TENANT_ID;
const GITHUB_ID = dynPriEnv.GITHUB_ID;
const GITHUB_SECRET = dynPriEnv.GITHUB_SECRET;
const GOOGLE_ID = dynPriEnv.GOOGLE_ID;
const GOOGLE_SECRET = dynPriEnv.GOOGLE_SECRET;

// TODO: https://hasura.io/learn/graphql/hasura-authentication/integrations/nextjs-auth/

export const authjs = SvelteKitAuth({
	providers: [
		Google({
			clientId: GOOGLE_ID,
			clientSecret: GOOGLE_SECRET,
			authorization: { params: { prompt: 'consent' } }
		}),
		AzureAD({
			clientId: AZURE_AD_CLIENT_ID,
			clientSecret: AZURE_AD_CLIENT_SECRET,
			tenantId: AZURE_AD_TENANT_ID,
			authorization: { params: { scope: 'openid profile User.Read email' } },
			// client: {},
			debug: true
		}),
		GitHub({ clientId: GITHUB_ID, clientSecret: GITHUB_SECRET })
	],
	callbacks: {
		async redirect({ url, baseUrl }) {
			// Allows relative callback URLs
			if (url.startsWith('/')) return `${baseUrl}${url}`;
			// Allows callback URLs on the same origin
			else if (new URL(url).origin === baseUrl) return url;
			return baseUrl;
		},
		// pages: {
		// 	signIn: '/login'
		// },
		async jwt({ token, account, profile }) {
			// console.log('token>>>', token);
			// console.log('account>>>', account);
			// console.log('profile>>>', profile);
			if (account) {
				token.token = account.access_token; // account.id_token
			}
			if (profile) {
				token.email ??= profile.upn;
				token.roles ??= profile.roles;
			}
			// FIXME: for Azure AD picture is base64 and it is too big to fit in cookie.
			// will through `431 Request Header Fields Too Large` unless we remove it.
			if (token.picture?.startsWith('data:')) delete token.picture;
			return token;
		},
		async session({ session, token }) {
			// console.log('in session, token>>>', token);
			session.token = token.token;
			session.roles = token.roles;
			// console.log('in session, session>>>>', session);
			return session;
		}
	}
}) satisfies Handle;
