<script lang="ts" context="module">
	import { dev } from '$app/environment';

	if (typeof window !== 'undefined' && dev) {
		/* eslint-disable no-inner-declarations */
		window.dataLayer = window.dataLayer || [];
		function gtag(...args: any[]) {
			window.dataLayer.push(arguments);
		}
		gtag('js', new Date());
		gtag('config', 'G-99KHT730F3');
	}
</script>

/** * add this to `__error.svelte` and `__layout.svelte` and not `app.html` * https://github.com/quantu-app/quantu-app/blob/main/src/routes/__error.svelte * https://github.com/quantu-app/quantu-app/blob/main/src/routes/__layout.svelte */
<svelte:head>
	{#if !dev}
		<script async src="https://www.googletagmanager.com/gtag/js?id=G-99KHT730F3"></script>
	{/if}
</svelte:head>
