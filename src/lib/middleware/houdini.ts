import type { Handle } from '@sveltejs/kit';

import { setSession } from '$houdini';

export const houdini: Handle = async ({ event, resolve }) => {
	const { locals } = event;
	setSession(event, { user: { token: locals.token } });

	return await resolve(event);
};
