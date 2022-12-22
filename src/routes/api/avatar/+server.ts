import { COOKIE_ACCESS_TOKEN_KEY, getCookie } from '$lib/utils/cookies';
import type { RequestHandler } from './$types';

// Ref: https://github.com/WayneMorganUK/discord_auth/tree/0b7364d24263b479ce2292a218f98a2a5c4786d2/src/routes/api

export const GET = (async ({ cookies }) => {
	const token = getCookie(cookies, COOKIE_ACCESS_TOKEN_KEY);
	const res = await fetch('https://graph.microsoft.com/v1.0/me/photos/48x48/$value', {
		headers: {
			Authorization: `Bearer ${token}`,
			'Content-Type': 'image/jpg'
		}
	});

	const data = await res.arrayBuffer();
	const pictureBase64 = Buffer.from(data).toString('base64');
	return new Response(String(`data:image/jpeg;base64, ${pictureBase64}`));
}) satisfies RequestHandler;
