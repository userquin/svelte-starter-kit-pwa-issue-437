import type { Handle, HandleServerError, RequestEvent } from '@sveltejs/kit';
import cookie from 'cookie';
// Ref: https://github.com/thiagovarela/nosso/blob/dev/web/src/hooks.ts
// Ref: https://kit.svelte.dev/docs/hooks

// for graceful termination
process.on('SIGINT', function () {
	process.exit();
}); // Ctrl+C
process.on('SIGTERM', function () {
	process.exit();
}); // docker stop

// TODO: Auth:  Either in the endpoint or in hooks.js you can check if the request is authorised - for example by using the Authorization HTTP header

// export const handle: Handle = async ({ event, resolve }) => {
// 	const cookies = cookie.parse(event.request.headers.get('cookie') || '');
// 	const jwt = cookies.jwt && Buffer.from(cookies.jwt, 'base64').toString('utf-8');
// 	event.locals.userid = jwt ? JSON.parse(jwt) : null;
// 	const response = await resolve(event);
//
// 	return response;
// }
//
// export function getSession({ locals }) {
// 	return {
// 		user: locals.user && {
// 			username: locals.user.username,
// 			email: locals.user.email,
// 			image: locals.user.image,
// 			bio: locals.user.bio
// 		}
// 	};
// }

// export function getSession(request: { headers: { cookie: string } }) {
// 	return cookie.parse(request.headers.cookie || '').access_token || null
// }

//  Uncaught exception handler
/** @type {import('@sveltejs/kit').HandleServerError} */
export async function handleError({ error, event }: { error: Error & { frame?: string }; event: RequestEvent }) {
	// example integration with https://sentry.io/
	// Sentry.captureException(error, { event });
	console.log('Error at:', event.url);
	console.error(error);
}
