<script lang="ts">
	import type { PageData } from './$houdini';
	// import { GQL_ListPolicies } from '$houdini';

	export let data: PageData;
	let { ListPolicies } = data;
	$: ({ ListPolicies } = data);
</script>

<details>
	<summary>raw data</summary>
	<pre>
    {JSON.stringify($ListPolicies.data, null, 2)}
  </pre>
</details>
