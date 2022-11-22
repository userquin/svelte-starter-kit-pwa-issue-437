<script lang="ts">
	import { page } from '$app/stores';
	import { callback } from '$lib/stores/auth.store';
	import { Spinner } from 'flowbite-svelte';
	import { onMount } from 'svelte';

	onMount(() => {
		callback($page.url.searchParams);
	});
</script>

<div class="flex h-[calc(100vh-200px)] items-center justify-center">
	<Spinner color="blue" size="20" />
</div>
