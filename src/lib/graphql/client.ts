import { PUBLIC_CONFY_API_ENDPOINT, PUBLIC_CONFY_API_TOKEN } from '$env/static/public';
import { HoudiniClient, type RequestHandlerArgs } from '$houdini';

async function fetchQuery({ fetch, text = '', variables = {}, metadata, session }: RequestHandlerArgs) {
	const url = PUBLIC_CONFY_API_ENDPOINT;
	const result = await fetch(url, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			// Authorization: `Bearer ${session?.user.token}`
			'X-Hasura-Admin-Secret': PUBLIC_CONFY_API_TOKEN
		},
		body: JSON.stringify({
			query: text,
			variables
		})
	});
	return await result.json();
}

export default new HoudiniClient(fetchQuery);
