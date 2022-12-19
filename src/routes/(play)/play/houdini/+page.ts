import { order_by } from '$houdini';
import type { AfterLoadEvent, ListPolicies2Variables as Variables } from './$houdini';

export const ListPolicies2Variables: Variables = ({ url }) => {
	const limit = parseInt(url.searchParams.get('limit') ?? '');
	const offset = parseInt(url.searchParams.get('offset') ?? '');

	// jsut to show error handling
	if (offset > 100) throw this.error(400, 'offset must be between 1 and 100');

	const orderBy = [{ updated_at: order_by.desc_nulls_first }];
	return {
		limit,
		offset,
		orderBy
	};
};

export const _houdini_onError = (err) => {
	console.log(err);
	return {};
};

export const _houdini_afterLoad = ({ data }: AfterLoadEvent) => {
	const count = data.ListPolicies2.counts.aggregate?.count ?? 0;
	return {
		// ListPolicies2: data.ListPolicies2
		computedValue: count + 100
	};
};
