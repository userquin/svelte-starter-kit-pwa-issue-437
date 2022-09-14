<script lang="ts">
	import { goto } from '$app/navigation';

	const handleClick = () => {
		goto('/dashboard');
	};
</script>

<svelte:head>
	<title>Dashboard/Settings</title>
	<meta name="description" content="Dashboard Settings" />
</svelte:head>

<h2>Settings</h2>
