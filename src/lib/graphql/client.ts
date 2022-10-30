// import { devtoolsExchange } from '@urql/devtools';
// import { cacheExchange } from '@urql/exchange-graphcache';
// import { env as dynPriEnv } from '$env/dynamic/private';
import { env as dynPubEnv } from '$env/dynamic/public';
import { createClient, defaultExchanges } from '@urql/svelte';
// import schema from './urqlGenerated';

// const graphSecret = dynPriEnv.CONFY_API_TOKEN;
const CONFY_API_ENDPOINT1 = dynPubEnv.PUBLIC_CONFY_API_ENDPOINT ?? '';
const CONFY_API_TOKEN1 = dynPubEnv.PUBLIC_CONFY_API_TOKEN ?? '';

export function urqlClient() {
	return createClient({
		url: CONFY_API_ENDPOINT1,
		requestPolicy: 'cache-and-network',
		exchanges: [
			// devtoolsExchange,
			// cacheExchange({
			// 	// schema,
			// 	keys: {
			// 		ImportChecksReturn: () => null,
			// 		ImportDataResult: () => null,
			// 		ImportDataReturn: () => null
			// 	}
			// }),
			...defaultExchanges
		],
		fetchOptions: {
			headers: {
				'Content-Type': 'application/json',
				// 'x-hasura-admin-secret': graphSecret
				'x-hasura-admin-secret': CONFY_API_TOKEN1
			}
		}
	});
}
