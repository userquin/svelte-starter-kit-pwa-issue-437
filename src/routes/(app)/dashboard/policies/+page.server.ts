import { env as dynPriEnv } from '$env/dynamic/private';
import { CONFY_API_ENDPOINT } from '$env/static/private';
import type { Account, AccountDeleteResult } from '$lib/models/schema';
import { Logger } from '$lib/utils';
import { getAppError, isAppError, isHttpError } from '$lib/utils/errors';
import * as Sentry from '@sentry/svelte';
import { error, invalid } from '@sveltejs/kit';

import assert from 'node:assert';
import type { Actions, PageServerLoad } from './$types';

assert.ok(CONFY_API_ENDPOINT, 'CONFY_API_ENDPOINT not configered');
assert.ok(dynPriEnv.CONFY_API_TOKEN, 'CONFY_API_TOKEN not configered');

const log = new Logger('policies.server');

const query = `
	query SearchPolicies(
		$where: tz_policies_bool_exp
		$limit: Int = 50
		$offset: Int = 0
		$orderBy: [tz_policies_order_by!] = [{ update_time: desc_nulls_last }]
	) {
		counts: tz_policies_aggregate(where: $where) {
			aggregate {
				count
			}
		}
		tz_policies(
			order_by: $orderBy
			limit: $limit
			offset: $offset
			where: $where
		) {
			id
			display_name
			description
			tags
			annotations
			disabled
			template
			create_time
			update_time
			valid_from
			valid_to
			subject_display_name
			subject_domain
			subject_id
			subject_secondary_id
			subject_type
			source_address
			source_port
			destination_address
			destination_port
			protocol
			action
			direction
			app_id
			weight
		}
	}
`;

const delete_mutation = `
	mutation DeletePolicy($id:uuid!) {
		delete_tz_policies_by_pk(id:  $id) {
			display_name
		}
	}
`;

export const load: PageServerLoad = async ({ url, setHeaders }) => {
	const limit = parseInt(url.searchParams.get('limit') ?? '');
	const offset = parseInt(url.searchParams.get('offset') ?? '');
	const subject_type = url.searchParams.get('subType');
	const display_name = url.searchParams.get('name');

	const orderBy = [{ update_time: 'desc_nulls_last' }];
	const where = {
		delete_time: { _is_null: true },
		...(subject_type ? { subject_type: { _eq: subject_type } } : {}),
		...(display_name ? { display_name: { _like: `%${display_name}%` } } : {})
	};
	const variables = { where, limit, offset, orderBy };
	const operationName = 'SearchPolicies';

	try {
		const resp = await fetch(CONFY_API_ENDPOINT, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'x-hasura-admin-secret': dynPriEnv.CONFY_API_TOKEN
			},
			body: JSON.stringify({
				query,
				variables,
				operationName
			})
		});
		if (!resp.ok) throw error(resp.status, resp.statusText);

		const { errors, data } = await resp.json();
		if (errors) return { loadErrors: errors }; // return invalid(400, {loadErrors: errors });

		const policies: Account[] = data.tz_policies; // FIXME use Account model

		// TIXME: tune: This page will have cache for 5min
		// setHeaders({
		// 	'cache-control': 'public, max-age=300'
		// });

		return { policies };
	} catch (err) {
		log.error('accounts:actions:load:error:', err);
		// console.error('accounts:actions:load:error:', err);
		Sentry.setContext('source', { code: 'account' });
		Sentry.captureException(err);

		if (isHttpError(err)) {
			throw error(err.status, err.body);
		}
		if (isAppError(err)) {
			throw error(500, err);
		}
		throw error(500, getAppError(err));
	}
};

export const actions: Actions = {
	delete: async ({ request }) => {
		const formData = await request.formData();
		const id = formData.get('id');
		console.log(id);

		const variables = { id };
		const operationName = 'DeletePolicy';

		try {
			const resp = await fetch(CONFY_API_ENDPOINT, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'x-hasura-admin-secret': dynPriEnv.CONFY_API_TOKEN
				},
				body: JSON.stringify({
					query: delete_mutation,
					variables,
					operationName
				})
			});
			if (!resp.ok) throw error(resp.status, resp.statusText);

			const { errors, data } = await resp.json();
			if (errors) return invalid(400, { actionErrors: errors });

			const actionResult: AccountDeleteResult = data.delete_tz_policies_by_pk;
			if (!actionResult) return invalid(400, { actionErrors: [{ message: 'Not Found' }] });

			return {
				actionResult
			};
		} catch (err) {
			console.error('account:actions:delete:error:', err);
			Sentry.setContext('source', { code: 'policy.delete' });
			Sentry.captureException(err);

			if (isAppError(err)) {
				throw error(500, err);
			}
			throw error(500, getAppError(err));
		}
	}
};
