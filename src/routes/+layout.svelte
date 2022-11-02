<script lang="ts">
	import { Toasts } from '$lib/components/toast';
	import { page } from '$app/stores';
	import { authenticate } from '$lib/stores/auth.store';

	import { onMount } from 'svelte';
	import '../app.pcss';

	onMount(() => {
		authenticate($page.url.searchParams);
	});
</script>

<Toasts position="bottom-right" />

<slot />
