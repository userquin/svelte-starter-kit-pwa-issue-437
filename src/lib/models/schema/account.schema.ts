import { stringToArray, stringToBoolean, stringToDate, stringToJSON, stringToMap, stringToNumber } from '$lib/utils/zod.utils';
import { z } from 'zod';
export const accountClientSchema = z
	.object({
		display_name: z.string().trim().min(4).max(256),
		description: z.string().trim().max(256).optional(),
		tags: z.preprocess(stringToArray, z.array(z.string().trim().min(2)).optional()),
		annotations: z.preprocess(stringToJSON, z.record(z.string().trim().min(3), z.string().trim().min(3)).optional()),
		disabled: z.preprocess(stringToBoolean, z.boolean().optional().default(false)),
		valid_from: z.preprocess(stringToDate, z.date().optional()),
		valid_to: z.preprocess(stringToDate, z.date().optional()),
		// valid_from: z.string().datetime().optional(),
		// valid_to: z.string().datetime().optional(),

		source_address: z.string().trim().optional(),
		source_port: z.string().trim().optional(),
		destination_address: z.string().trim().optional(),
		destination_port: z.string().trim().optional(),
		protocol: z.enum(['Any', 'IP', 'ICMP', 'IGMP', 'TCP', 'UDP', 'IPV6', 'ICMPV6', 'RM']),
		action: z.enum(['action_permit', 'action_block']),
		direction: z.enum(['direction_egress', 'direction_ingress']),
		app_id: z.string().trim().optional(),
		weight: z.number().min(0).max(2000).optional().default(1000)
	})
	.superRefine((data, ctx) => {
		if (data.valid_from && data.valid_to && data.valid_to < data.valid_from) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				path: ['valid_to'],
				message: 'valid_to should be after valid_from'
			});
		}
	});

export const accountBaseSchema = z.object({
	display_name: z.string().trim().min(4).max(256),
	description: z.string().trim().max(256).optional(),
	tags: z.preprocess(stringToArray, z.array(z.string().trim().min(2)).optional()),
	// annotations: z.preprocess(stringToJSON, z.record(z.string().trim().min(3), z.string().trim().min(3)).optional()),
	annotations: z.preprocess(stringToMap, z.map(z.string().trim(), z.string().trim()).optional()),
	disabled: z.preprocess(stringToBoolean, z.boolean().optional().default(false)),
	valid_from: z.preprocess(stringToDate, z.date().optional()),
	valid_to: z.preprocess(stringToDate, z.date().optional()),

	source_address: z.string().trim().optional(),
	source_port: z.string().trim().optional(),
	destination_address: z.string().trim().optional(),
	destination_port: z.string().trim().optional(),
	protocol: z.enum(['Any', 'IP', 'ICMP', 'IGMP', 'TCP', 'UDP', 'IPV6', 'ICMPV6', 'RM']),
	action: z.enum(['action_permit', 'action_block']),
	direction: z.enum(['direction_egress', 'direction_ingress']),
	app_id: z.string().trim().optional(),
	weight: z.preprocess(stringToNumber, z.number().min(0).max(2000).optional().default(1000))
});

export const accountCreateBaseSchema = accountBaseSchema.extend({
	id: z.string().trim().uuid(),
	subject_display_name: z.string().trim(),
	subject_domain: z.string().trim(),
	subject_id: z.string().trim(),
	subject_secondary_id: z.string().trim(),
	subject_type: z.enum(['subject_type_user', 'subject_type_group', 'subject_type_device', 'subject_type_service_account']),
	template: z.preprocess(stringToBoolean, z.boolean().optional().default(false))
});

/**
 * system generated data
 */
const accountExtraSchema = z.object({
	create_time: z.preprocess(stringToDate, z.date()),
	created_by: z.string(),
	update_time: z.preprocess(stringToDate, z.date()),
	updated_by: z.string().optional(),
	delete_time: z.preprocess(stringToDate, z.date().optional())
});

/**
 * for update time validation
 */
export const accountUpdateSchema = accountBaseSchema
	.extend({
		updated_by: z.string(),
		update_time: z.preprocess(stringToDate, z.date())
	})
	.superRefine((data, ctx) => {
		if (data.valid_from && data.valid_to && data.valid_to < data.valid_from) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				path: ['valid_to'],
				message: 'valid_to should be after valid_from'
			});
		}
	});

/**
 * for create time validation
 */
export const accountCreateSchema = accountCreateBaseSchema
	.extend({
		valid_from: z.preprocess(stringToDate, z.date().min(new Date()).optional()),
		created_by: z.string(),
		create_time: z.preprocess(stringToDate, z.date()),
		updated_by: z.string().optional(),
		update_time: z.preprocess(stringToDate, z.date())
	})
	.superRefine((data, ctx) => {
		if (data.valid_from && data.valid_to && data.valid_to < data.valid_from) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				path: ['valid_to'],
				message: 'valid_to should be after valid_from'
			});
		}
	});

/**
 * for API return value validation and to extract the inferred type
 */
export const accountSchema = accountCreateBaseSchema.merge(accountExtraSchema);

export type Account = z.infer<typeof accountSchema>;

export const accountSaveResultSchema = z.object({
	id: z.string().trim().uuid(),
	display_name: z.string().trim(),
	update_time: z.preprocess(stringToDate, z.date())
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
