import { env as dynPubEnv } from '$env/dynamic/public';
import { CachePolicy, DeletePolicyStore, order_by, SearchPoliciesStore } from '$houdini';
import type { AccountDeleteResult } from '$lib/models/schema';
import { Logger } from '$lib/utils';
import { getAppError, isAppError, isHttpError } from '$lib/utils/errors';
import * as Sentry from '@sentry/svelte';
import { error, fail } from '@sveltejs/kit';

import assert from 'node:assert';
import type { Actions, PageServerLoad, RequestEvent } from './$types';

assert.ok(dynPubEnv.PUBLIC_CONFY_API_ENDPOINT, 'PUBLIC_CONFY_API_ENDPOINT not configered');
assert.ok(dynPubEnv.PUBLIC_CONFY_API_TOKEN, 'PUBLIC_CONFY_API_TOKEN not configered');

const log = new Logger('policies.server');

const searchPoliciesStore = new SearchPoliciesStore();
const query = searchPoliciesStore.artifact.raw;

const delete_mutation = new DeletePolicyStore().artifact.raw;

export const load: PageServerLoad = async (event: RequestEvent) => {
	const { url, setHeaders } = event;

	const limit = parseInt(url.searchParams.get('limit') ?? '');
	const offset = parseInt(url.searchParams.get('offset') ?? '');
	const subject_type = url.searchParams.get('subType');
	const display_name = url.searchParams.get('name');

	const orderBy = [{ updated_at: order_by.desc_nulls_first }];
	const where = {
		deleted_at: { _is_null: true },
		...(subject_type ? { subject_type: { _eq: subject_type } } : {}),
		...(display_name ? { display_name: { _like: `%${display_name}%` } } : {})
	};
	const variables = { where, limit, offset, orderBy };
	// const operationName = 'SearchPolicies';

	try {
		/*
		const resp = await fetch(dynPubEnv.PUBLIC_CONFY_API_ENDPOINT, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'x-hasura-admin-secret': dynPubEnv.PUBLIC_CONFY_API_TOKEN
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
		*/
		//----
		const { errors, data } = await searchPoliciesStore.fetch({
			event,
			blocking: true,
			policy: CachePolicy.CacheAndNetwork,
			variables
		});
		console.log('errors', errors);
		if (errors) return { loadErrors: errors };
		if (!data) return { loadErrors: [{ message: 'data null' }] };
		//----

		const count = data.counts?.aggregate?.count;
		//const policies: Account[] = data.tz_policies; // FIXME use Account model
		const policies = data.tz_policies; // FIXME use Account model

		// TIXME: tune: This page will have cache for 5min
		// setHeaders({
		// 	'cache-control': 'public, max-age=300'
		// });

		return { count, policies };
	} catch (err) {
		log.error('accounts:actions:load:error:', err);
		Sentry.setContext('source', { code: 'account' });
		Sentry.captureException(err);

		if (isHttpError(err)) {
			console.log('in isHttpError', err);
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
			const resp = await fetch(dynPubEnv.PUBLIC_CONFY_API_ENDPOINT, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'x-hasura-admin-secret': dynPubEnv.PUBLIC_CONFY_API_TOKEN
				},
				body: JSON.stringify({
					query: delete_mutation,
					variables,
					operationName
				})
			});
			if (!resp.ok) throw error(resp.status, resp.statusText);

			const { errors, data } = await resp.json();
			if (errors) return fail(400, { actionErrors: errors });

			const actionResult: AccountDeleteResult = data.delete_tz_policies_by_pk;
			if (!actionResult) return fail(400, { actionErrors: [{ message: 'Not Found' }] });

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
