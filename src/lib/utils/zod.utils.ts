import { z } from 'zod';

/**
 * Utility functions
 */
export function ifNonEmptyString(fn: (value: string) => unknown): (value: unknown) => unknown {
	return (value: unknown) => {
		if (typeof value !== 'string') {
			return value;
		}

		if (value === '') {
			return undefined;
		}

		return fn(value);
	};
}

export function removeEmpty(obj) {
	Object.entries(obj).forEach(([key, val]) => (val && typeof val === 'object' && removeEmpty(val)) || ((val === null || val === '') && delete obj[key]));
	return obj;
}

/**
 * schemas
 */

export const uuidSchema = z.string().uuid();

/**
 * Converters / type coercion
 */
export const stringToBoolean = ifNonEmptyString((arg) => arg.toLowerCase() === 'true');

export const stringToNumber = (arg: unknown) => (typeof arg == 'string' && /^\d+$/.test(arg) ? parseInt(arg, 10) : undefined);
export const stringToNumber2 = (arg: unknown) => {
	const processed = z.string().trim().regex(/^\d+$/).transform(Number).safeParse(arg);
	return processed.success ? processed.data : arg;
};

// export const stringToDate = (arg: unknown) => ((typeof arg == 'string' && arg.length > 0) || arg instanceof Date ? new Date(arg) : undefined);
export const stringToDate = ifNonEmptyString((arg) => new Date(arg));

// export const stringToSet = (arg: unknown) => (typeof arg == 'string' ? new Set(arg.split(',')) : undefined);
export const stringToSet = ifNonEmptyString((arg) => new Set(arg.split(',')));
// export const StringToMap = (arg: unknown) => (typeof arg == 'string' ? new Map(Object.entries(JSON.parse(arg))) : undefined);
export const stringToMap = ifNonEmptyString((arg) => new Map(Object.entries(JSON.parse(arg))));
