<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
	let {
		user: { github: ghUser }
	} = data;
</script>

<svelte:head>
	<title>Dashboard/Profile</title>
	<meta name="description" content="Dashboard Profile" />
</svelte:head>

<h2 class="pb-4 text-2xl">Profile</h2>
<div>
	<pre>{JSON.stringify(ghUser, null, 4)}</pre>
</div>
