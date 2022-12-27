<script lang="ts">
	import { Toasts } from '$lib/components/toast';
	import '../app.pcss';

	 import { onMount } from 'svelte';
	 import { pwaInfo } from 'virtual:pwa-info';

	let ReloadPrompt
	onMount(async () => {
		if (pwaInfo) {
			const { registerSW } = await import('virtual:pwa-register')
			registerSW({
				immediate: true,
				onRegistered(r) {
					// uncomment following code if you want check for updates
					// r && setInterval(() => {
					//    console.log('Checking for sw update')
					//    r.update()
					// }, 20000 /* 20s for testing purposes */)
					console.log(`SW Registered: ${r}`)
				},
				onRegisterError(error) {
					console.log('SW registration error', error)
				}
			})

			ReloadPrompt = (await import('$lib/components/ReloadPrompt.svelte')).default
		}
	})

	$: webManifest = pwaInfo ? pwaInfo.webManifest.linkTag : ''

</script>

<svelte:head>
    {@html webManifest}
</svelte:head>

<Toasts placement="bottom-right" />

<slot />

{#if ReloadPrompt}
  <svelte:component this={ReloadPrompt} />
{/if}
