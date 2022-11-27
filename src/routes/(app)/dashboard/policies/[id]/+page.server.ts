import { env as dynPriEnv } from '$env/dynamic/private';
import { CONFY_API_ENDPOINT } from '$env/static/private';
import { accountCreateSchema, accountUpdateSchema, type Account, type AccountSaveResult } from '$lib/models/schema';
import { getAppError, isAppError, isHttpError, isRedirect } from '$lib/utils/errors';
import { arrayToString, mapToString, removeEmpty, uuidSchema } from '$lib/utils/zod.utils';
import * as Sentry from '@sentry/svelte';
import { error, invalid } from '@sveltejs/kit';
import crypto from 'node:crypto';
import { ZodError } from 'zod';
import type { Actions, PageServerLoad } from './$types';

const getById = `
query GetByID($id: uuid!) {
  tz_policies_by_pk(id: $id) {
    id
    display_name
    description
    tags
    annotations
    disabled
    template
    create_time
    created_by
    update_time
    updated_by
    delete_time
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

const create = `
mutation CreatePolicy($data: tz_policies_insert_input!) {
  insert_tz_policies_one(object: $data) {
    id
	display_name,
	update_time
  }
}
`;

const update = `
mutation UpdatePolicy($id: uuid!, $data: tz_policies_set_input!) {
  update_tz_policies_by_pk(pk_columns: { id: $id }, _set: $data) {
    id
	display_name,
	update_time
  }
}
`;

export const load: PageServerLoad = async ({ params, locals }) => {
	const {
		user: { email },
		token
	} = locals;
	const { id } = params;
	if (id == '00000000-0000-0000-0000-000000000000') {
		const policy: Account = {
			id: '00000000-0000-0000-0000-000000000000',
			display_name: '',
			// tags: new Set(['tz', 'us']),
			// annotations: new Map(Object.entries({ sumo: 'demo' })),
			subject_id: '6e9bf365-8c09-4dd9-b9b2-83f6ab315618',
			subject_type: 'subject_type_user',
			subject_secondary_id: 'sumo@chintagunta.com',
			subject_display_name: '',
			subject_domain: 'chinthagunta.com',
			disabled: false,
			template: false,
			source_address: '',
			source_port: '',
			destination_address: '',
			destination_port: '',
			protocol: 'Any',
			action: 'action_block',
			direction: 'direction_egress',
			weight: 2000,
			create_time: new Date(),
			created_by: email,
			update_time: new Date()
		};
		return { policy };
	}

	const variables = { id };

	try {
		const resp = await fetch(CONFY_API_ENDPOINT, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'x-hasura-admin-secret': dynPriEnv.CONFY_API_TOKEN,
				Authorization: `Bearer ${token}`
			},
			body: JSON.stringify({
				query: getById,
				variables
			})
		});
		if (!resp.ok) throw error(resp.status, resp.statusText);

		const { errors, data } = await resp.json();
		if (errors) return { loadErrors: errors };

		const policy: Account = data.tz_policies_by_pk;
		if (!policy) return { loadErrors: [{ message: 'Not Found' }] };

		// trim dates
		const policyFormatted = {
			...policy,
			...(policy.valid_from && { valid_from: new Date(policy.valid_from).toISOString().slice(0, 16) }),
			...(policy.valid_to && { valid_to: new Date(policy.valid_to).toISOString().slice(0, 16) })
		};

		return { policy: policyFormatted };
	} catch (err) {
		console.error('account:actions:load:error:', err);
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
	save: async ({ params, request, locals }) => {
		const formData = Object.fromEntries(await request.formData());
		const {
			user: { email },
			token
		} = locals;

		try {
			let actionResult: AccountSaveResult;
			const id = uuidSchema.parse(params.id);

			// CREATE
			if (id == '00000000-0000-0000-0000-000000000000') {
				console.log('in CREATE');

				// remove empty fields for CREATE caction
				console.log('CREATE action formData:', formData);
				removeEmpty(formData);
				console.log('CREATE action cleanFormData:', formData);

				formData.id = crypto.randomUUID();
				formData.created_by = email;
				formData.create_time = new Date().toISOString();
				formData.updated_by = email;
				formData.update_time = new Date().toISOString();
				const payload = accountCreateSchema.parse(formData);
				const jsonPayload = {
					...payload,
					...(payload.tags && { tags: arrayToString(payload.tags) }),
					...(payload.annotations && { annotations: mapToString(payload.annotations) }),
					...(payload.valid_from && { valid_from: payload.valid_from.toISOString() }),
					...(payload.valid_to && { valid_to: payload.valid_to.toISOString() }),
					...(payload.create_time && { create_time: payload.create_time.toISOString() }),
					...(payload.update_time && { update_time: payload.update_time.toISOString() })
				};

				const variables = { data: jsonPayload };
				console.log('variables', variables);

				const resp = await fetch(CONFY_API_ENDPOINT, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						'x-hasura-admin-secret': dynPriEnv.CONFY_API_TOKEN,
						Authorization: `Bearer ${token}`
					},
					body: JSON.stringify({
						query: create,
						variables
					})
				});
				if (!resp.ok) throw error(resp.status, resp.statusText);

				const { errors, data } = await resp.json();
				if (errors) return invalid(400, { actionErrors: errors });

				console.log('data', data);
				actionResult = data.insert_tz_policies_one;
				if (!actionResult) return invalid(400, { actionErrors: [{ message: 'Not Found' }] });

				return { actionResult };
				// throw redirect(303, '/dashboard/policies');
			}

			// UPDATE
			else {
				console.log('in UPDATE', formData);
				formData.updated_by = email;
				formData.update_time = new Date().toISOString();
				const payload = accountUpdateSchema.parse(formData);
				console.log('in UPDATE payload', payload);
				const jsonPayload = {
					...payload,
					...(payload.tags && { tags: arrayToString(payload.tags) }),
					...(payload.annotations && { annotations: mapToString(payload.annotations) }),
					...(payload.valid_from && { valid_from: payload.valid_from.toISOString() }),
					...(payload.valid_to && { valid_to: payload.valid_to.toISOString() }),
					...(payload.update_time && { update_time: payload.update_time.toISOString() })
				};

				const variables = { id, data: jsonPayload };
				console.log('variables', variables);

				const resp = await fetch(CONFY_API_ENDPOINT, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						'x-hasura-admin-secret': dynPriEnv.CONFY_API_TOKEN,
						Authorization: `Bearer ${token}`
					},
					body: JSON.stringify({
						query: update,
						variables
					})
				});
				if (!resp.ok) throw error(resp.status, resp.statusText);

				const { errors, data } = await resp.json();
				if (errors) return invalid(400, { actionErrors: errors });

				console.log('data', data);
				actionResult = data.update_tz_policies_by_pk;
				if (!actionResult) return invalid(400, { actionErrors: [{ message: 'Not Found' }] });

				return { actionResult };
			}
		} catch (err) {
			console.log('account:actions:save:error', err);
			if (isRedirect(err)) {
				if (err.status < 310) throw err;
			} else if (err instanceof ZodError) {
				const { formErrors, fieldErrors } = err.flatten();
				console.log('account:actions:save:error', err.flatten());
				return invalid(400, { formErrors, fieldErrors });
			} else if (isAppError(err)) {
				throw error(500, err);
			}
			throw error(500, getAppError(err));
		}
	}
};
