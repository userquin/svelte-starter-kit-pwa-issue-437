import type { Handle } from '@sveltejs/kit';

import { setSession } from '$houdini';

export const houdini = (async ({ event, resolve }) => {
	const { locals } = event;
	setSession(event, { user: { token: locals.token } });

	const response = await resolve(event);
	return response;
}) satisfies Handle;
