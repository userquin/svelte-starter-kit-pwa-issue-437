import { getAppError, isAppError } from '$lib/utils/errors';
import { createRandomAccount } from '$mocks/data/accounts';
import { error, invalid } from '@sveltejs/kit';
import { ZodError } from 'zod';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const { id } = params;
	const payload = { id };
	try {
		// const resp = await fetch(`${endpoints.api}/account`, {
		// 	method: 'POST',
		// 	headers: { 'Content-Type': 'application/json' },
		// 	body: JSON.stringify(payload)
		// });
		// const response = await resp.json();
		// const account = response;

		const account = createRandomAccount();

		if (!account) throw { code: 404, message: 'not found' };
		return { account };
	} catch (err) {
		// err as App.Error
		if (err instanceof ZodError) {
			throw invalid(400, {
				message: 'Invalid request.',
				code: 400,
				context: err.flatten().fieldErrors
			});
		} else if (isAppError(err)) {
			throw error(err.code, err);
		}
		throw error(500, getAppError(500, err));
	}
};
