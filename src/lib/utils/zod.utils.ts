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
			// return undefined;
			return null;
		}

		return fn(value);
	};
}

export function removeEmpty(obj) {
	Object.entries(obj).forEach(([key, val]) => (val && typeof val === 'object' && removeEmpty(val)) || ((val === null || val === '') && delete obj[key]));
	return obj;
}

export function replaceEmptyWithNull(obj) {
	Object.entries(obj).forEach(([key, val]) => (val && typeof val === 'object' && replaceEmptyWithNull(val)) || (val === '' && (obj[key] = null)));
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
export const stringToArray = ifNonEmptyString((arg) => arg.split(','));
export const arrayToString = (arg: string[]) => `{${arg.join(',')}}`;
export const stringToMap = ifNonEmptyString((arg) => new Map(Object.entries(JSON.parse(arg))));
export const mapToString = (arg: Map<string, string>) => Array.from(arg, ([k, v]) => `"${k}"=>"${v}"`).join(',');
export const stringToJSON = ifNonEmptyString((arg) => JSON.parse(arg));

// in-source testing
if (import.meta.vitest) {
	const { it, expect } = import.meta.vitest;

	it('Test arrayToString', async () => {
		const dataArray = ['sumo', 'demo'];
		const result = arrayToString(dataArray);
		expect(result).toBe('{sumo,demo}');
	});

	it('Test mapToString', async () => {
		const dataMap = new Map<string, string>([
			['key1', 'value1'],
			['key2', 'value2']
		]);
		const result = mapToString(dataMap);
		expect(result).toBe('"key1"=>"value1","key2"=>"value2"');
	});
}
