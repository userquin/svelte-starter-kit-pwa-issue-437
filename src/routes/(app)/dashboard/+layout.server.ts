import type { LayoutServerLoad } from './$types';

export const load = (async (event) => {
	return {
		session: await event.locals.getSession()
	};
}) satisfies LayoutServerLoad;
