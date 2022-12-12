import { getAppError, isAppError } from '$lib/utils/errors';
import { createRandomAccount } from '$mocks/data/accounts';
import { error, fail } from '@sveltejs/kit';
import { ZodError } from 'zod';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const { id } = params;
	const payload = { id };
	try {
		const account = createRandomAccount();

		if (!account) throw { code: 404, message: 'not found' };
		return { account };
	} catch (err) {
		// err as App.Error
		if (err instanceof ZodError) {
			throw fail(400, {
				message: 'Invalid request.',
				code: 400,
				context: err.flatten().fieldErrors
			});
		} else if (isAppError(err)) {
			throw error(500, err);
		}
		throw error(500, getAppError(err));
	}
};
