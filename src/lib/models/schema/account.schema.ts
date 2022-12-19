import { stringToArray, stringToJSON, stringToMap } from '$lib/utils/zod.utils';
import { z } from 'zod';

function checkValidDates(ctx: z.RefinementCtx, valid_from: string | undefined | null, valid_to: string | undefined | null) {
	if (valid_from && valid_to && new Date(valid_to) < new Date(valid_from)) {
		ctx.addIssue({
			code: z.ZodIssueCode.custom,
			path: ['valid_to'],
			message: 'valid_to should be after valid_from'
		});
	}
}

export const accountClientSchema = z
	.object({
		display_name: z.string().trim().min(4).max(256),
		description: z.string().trim().max(256).nullish(),
		// tags: z.preprocess(stringToArray, z.array(z.string().trim().min(2)).optional()),
		// annotations: z.preprocess(stringToJSON, z.record(z.string().trim().min(3), z.string().trim().min(3)).optional()),
		tags: z.string().trim().min(2).array().nullish(),
		annotations: z.preprocess(stringToJSON, z.record(z.string().trim().min(3), z.string().trim().min(3)).nullish()),
		// annotations: z.preprocess(stringToMap, z.map(z.string().trim().min(3), z.string().trim().min(3))).nullish(), // nullish() = optional().nullable()
		disabled: z.boolean().optional().default(false),
		template: z.boolean().optional().default(false),
		valid_from: z.string().datetime({ offset: true }).nullish().catch(null), // .transform(str => str ? new Date(str) : undefined),
		valid_to: z.string().datetime({ offset: true }).nullish().catch(null), // .transform(str => str ? new Date(str) : undefined),
		source_address: z.string().trim().nullish(),
		source_port: z.string().trim().nullish(),
		destination_address: z.string().trim().nullish(),
		destination_port: z.string().trim().nullish(),
		protocol: z.enum(['Any', 'IP', 'ICMP', 'IGMP', 'TCP', 'UDP', 'IPV6', 'ICMPV6', 'RM']),
		action: z.enum(['action_permit', 'action_block']),
		direction: z.enum(['direction_egress', 'direction_ingress']),
		app_id: z.string().trim().nullish(),
		weight: z.number().min(0).max(2000).optional().default(1000)
	})
	.superRefine((data, ctx) => checkValidDates(ctx, data.valid_from, data.valid_to));

export const accountBaseSchema = z.object({
	display_name: z.string().trim().min(4).max(256),
	description: z.string().trim().max(256).nullish(),
	tags: z.preprocess(stringToArray, z.array(z.string().trim().min(2)).nullish()),
	// annotations: z.preprocess(stringToJSON, z.record(z.string().trim().min(3), z.string().trim().min(3)).nullish()),
	annotations: z.preprocess(stringToMap, z.map(z.string().trim().min(3), z.string().trim().min(3)).nullish()),
	disabled: z.coerce.boolean().optional().default(false),
	valid_from: z.string().datetime({ offset: true }).nullish().catch(null),
	valid_to: z.string().datetime({ offset: true }).nullish().catch(null),
	source_address: z.string().trim().nullish(),
	source_port: z.string().trim().nullish(),
	destination_address: z.string().trim().nullish(),
	destination_port: z.string().trim().nullish(),
	protocol: z.enum(['Any', 'IP', 'ICMP', 'IGMP', 'TCP', 'UDP', 'IPV6', 'ICMPV6', 'RM']),
	action: z.enum(['action_permit', 'action_block']),
	direction: z.enum(['direction_egress', 'direction_ingress']),
	app_id: z.string().trim().nullish(),
	weight: z.coerce.number().min(0).max(2000).catch(1000)
});

export const accountCreateBaseSchema = accountBaseSchema.extend({
	id: z.string().trim().uuid(),
	subject_display_name: z.string().trim(),
	subject_domain: z.string().trim(),
	subject_id: z.string().trim(),
	subject_secondary_id: z.string().trim(),
	subject_type: z.enum(['subject_type_user', 'subject_type_group', 'subject_type_device', 'subject_type_service_account']),
	template: z.coerce.boolean().optional().default(false)
});

/**
 * system generated data
 */
const accountExtraSchema = z.object({
	created_at: z.string().datetime({ offset: true }),
	created_by: z.string(),
	updated_at: z.string().datetime({ offset: true }),
	updated_by: z.string(),
	deleted_at: z.string().datetime({ offset: true }).nullish()
});

/**
 * for update time validation
 */
export const accountUpdateSchema = accountBaseSchema
	.extend({
		updated_by: z.string()
	})
	.superRefine((data, ctx) => checkValidDates(ctx, data.valid_from, data.valid_to));

/**
 * for create time validation
 */
export const accountCreateSchema = accountCreateBaseSchema
	.extend({
		created_by: z.string(),
		updated_by: z.string().optional()
	})
	.superRefine((data, ctx) => checkValidDates(ctx, data.valid_from, data.valid_to));

/**
 * for API return value validation and to extract the inferred type
 */
export const accountSchema = accountCreateBaseSchema.merge(accountExtraSchema);

export type Account = z.infer<typeof accountSchema>;

export const accountSaveResultSchema = z.object({
	id: z.string().trim().uuid(),
	display_name: z.string().trim(),
	updated_at: z.string().datetime({ offset: true })
});

export type AccountSaveResult = z.infer<typeof accountSaveResultSchema>;

export const accountDeleteResultSchema = z.object({
	display_name: z.string().trim()
});

export type AccountDeleteResult = z.infer<typeof accountDeleteResultSchema>;

export interface RpcErrors {
	errors: {
		extensions: {
			path: string;
			code: string;
		};
		message: string;
	}[];
}
