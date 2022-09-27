import type { RequestEvent } from '@sveltejs/kit';
import { error } from '@sveltejs/kit';
import type { PageServerLoad, Action } from './$types';
import { endpoints } from '../../../../../lib/config';
import { createRandomMember } from '$mocks/data/members';

export const load: PageServerLoad = async ({ params }: RequestEvent) => {
	const { id } = params;
	const payload = {
		memberId: id ?? '3YP5VF7QE73',
		startDate: '2022/01/01',
		endDate: '2022/12/31'
	};
	try {
		// const resp = await fetch(`${endpoints.api}/member`, {
		// 	method: 'POST',
		// 	headers: { 'Content-Type': 'application/json' },
		// 	body: JSON.stringify(payload)
		// });
		// const response = await resp.json();
		// const member = response.data;

		const member = createRandomMember();

		return { member };
	} catch (err) {
		console.error(err);
		throw error(404, (err as Error).message);
	}
};
