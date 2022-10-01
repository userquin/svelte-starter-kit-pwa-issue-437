import { error, json, redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

// Ref: https://github.com/WayneMorganUK/discord_auth/tree/0b7364d24263b479ce2292a218f98a2a5c4786d2/src/routes/api

export const GET: RequestHandler = async ({ url }) => {
	// export async function GET({ url }) {
	const min = Number(url.searchParams.get('min') ?? '0');
	const max = Number(url.searchParams.get('max') ?? '1');

	const d = max - min;

	if (isNaN(d) || d < 0) {
		throw error(400, 'min and max must be numbers, and min must be less than max');
	}

	const random = min + Math.random() * d;

	return new Response(String(random));
};

export const POST: RequestHandler = async ({ request }) => {
	const { a, b } = await request.json();
	return json(a + b);
};
