<!--
USAGEL: in your +layout.svelte:
Ref: https://joyofcode.xyz/sveltekit-google-analytics

<script lang="ts">
	import { Analytics } from '$lib/components';
</script>

<Analytics  MEASUREMENT_ID= "G-XXXXX" />

<slot />
-->
<script lang="ts">
	import { page } from '$app/stores';

	export let MEASUREMENT_ID: string;

	const src = `https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}`;

	$: {
		if (typeof gtag !== 'undefined') {
			gtag('config', MEASUREMENT_ID, {
				page_title: document.title,
				page_path: $page.url.pathname
			});
		}
	}
</script>

<svelte:head>
	<script async src="{src}"></script>
	<script>
		window.dataLayer = window.dataLayer || [];

		function gtag() {
			dataLayer.push(arguments);
		}

		gtag('js', new Date());
		// TODO FIXME
		gtag('config', { MEASUREMENT_ID });
	</script>
</svelte:head>
