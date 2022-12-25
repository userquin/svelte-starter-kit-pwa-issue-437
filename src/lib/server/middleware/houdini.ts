import type { Handle } from '@sveltejs/kit';

import { setSession } from '$houdini';

export const houdini = (async ({ event, resolve }) => {
	const { locals } = event;
	const { token } = (await locals.getSession()) ?? {};
	setSession(event, { user: { token } });

	const response = await resolve(event);
	return response;
}) satisfies Handle;
