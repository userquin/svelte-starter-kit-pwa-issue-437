import { error } from '@sveltejs/kit';
import type { PageServerLoad, Action } from './$types';
import { endpoints } from '$lib/config';
import { createRandomAccount } from '$mocks/data/accounts';
import type { Account } from '$lib/models/types/accounts';
import { getErrorMessage } from '$lib/utils/errors';

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

		return { account };
	} catch (err) {
		console.error(err);
		throw error(404, { message: getErrorMessage(err) });
	}
};
