import { env as dynPubEnv } from '$env/dynamic/public';
import type { RequestHandlerArgs } from '$houdini';
import { HoudiniClient } from '$houdini';
// import { createClient as createWSClient } from 'graphql-ws';

// For Query & Mutation
async function fetchQuery({ fetch, text = '', variables = {}, metadata, session }: RequestHandlerArgs) {
	const url = dynPubEnv.PUBLIC_CONFY_API_ENDPOINT;
	const result = await fetch(url, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			// Authorization: `Bearer ${session?.user.token}`
			'X-Hasura-Admin-Secret': dynPubEnv.PUBLIC_CONFY_API_TOKEN
		},
		body: JSON.stringify({
			query: text,
			variables
		})
	});
	return await result.json();
}

// For subscription (client only)
/*
let socketClient: SubscriptionHandler | null = null;
if (browser) {
	socketClient = createWSClient({
		url: dynPubEnv.PUBLIC_CONFY_API_ENDPOINT
	});
}

export default new HoudiniClient(fetchQuery, socketClient);
*/

export default new HoudiniClient(fetchQuery);
