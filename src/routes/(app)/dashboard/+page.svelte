<script lang="ts">
	import { goto } from '$app/navigation';
	import { Stats1, Stats2, Stats3, Stats4 } from '$lib/blocks/stats';

	const handleClick = () => {
		goto('/dashboard');
	};

	async function gotoCreatePolicy() {
		goto('/dashboard/policies/00000000-0000-0000-0000-000000000000');
	}
</script>

<svelte:head>
	<title>Dashboard</title>
	<meta name="description" content="Dashboard Stats" />
</svelte:head>

<Stats1 />
<!--<Stats2 />-->
<!--<Stats3 />-->
<!--<Stats4 />-->
