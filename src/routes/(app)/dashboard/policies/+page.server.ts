import { auth, endpoints } from '$lib/config';
import { getAppError, isAppError } from '$lib/utils/errors';
import { error } from '@sveltejs/kit';
import { ZodError } from 'zod';
import type { PageServerLoad } from './$types';

const query = `
query ($subject_id: String, $subject_type: String = "subject_type_user", $limit: Int = 50) {
  tz_policies(order_by: {update_time: desc_nulls_last}, limit: $limit, where: {delete_time: {_is_null: true}, subject_id: {_eq: $subject_id}, subject_type: {_eq: $subject_type}}) {
    id
    create_time
    display_name
    subject_type
    subject_display_name
    subject_id
    valid_from
    valid_to
    weight
    source_address
    source_port
    destination_address
    destination_port
    protocol
    action
    template
  }
}
`;

export const load: PageServerLoad = async ({ url }) => {
	const subject_id = url.searchParams.get('subId') ?? '6e9bf365-8c09-4dd9-b9b2-83f6ab315618';
	const subject_type = url.searchParams.get('subType') ?? 'subject_type_user';
	const limit = url.searchParams.get('limit') ?? 50;

	const variables = { subject_id, subject_type, limit };
	const operationName = 'lookupPolicies';

	try {
		const resp = await fetch(`${endpoints.api}`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'x-hasura-admin-secret': `${auth.token}`
			},
			body: JSON.stringify({
				query,
				variables
			})
		});

		// const { errors, response } = await resp.json();
		const response = await resp.json();
		const policies: any[] = response.data.tz_policies;
		console.log(policies);
		if (!policies?.length) throw { code: 404, message: 'not found' };
		return { policies };
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
