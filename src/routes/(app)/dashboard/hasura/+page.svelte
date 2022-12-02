<script lang="ts">
	import type { PageData } from './$houdini';
	// import { GQL_ListPolicies } from '$houdini';

	export let data: PageData;
	let { ListPolicies2 } = data;
	$: ({ ListPolicies2 } = data);
</script>

<details>
	<summary>raw data with @cache(policy: CacheAndNetwork)</summary>
	<pre>
    {JSON.stringify($ListPolicies2.data, null, 2)}
  </pre>
</details>
