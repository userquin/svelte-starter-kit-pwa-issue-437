import { error } from '@sveltejs/kit';
import type { PageServerLoad, Action } from './$types';
import { endpoints } from '$lib/config';
import { createRandomAccount } from '$mocks/data/accounts';
import type { Account } from '$lib/models/types/accounts';
import { getAppError, isAppError } from '$lib/utils/errors';
import { ZodError } from 'zod';

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
			throw error(400, {
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
