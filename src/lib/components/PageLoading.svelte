<svelte:options immutable />

<style lang="postcss">
	.page-loading {
		position: fixed;
		top: calc(50% - 2.5rem);
		left: calc(50% - 2.5rem);
		z-index: 100;
	}
	.loading {
		width: 5rem;
		height: 5rem;
	}
</style>

<script lang="ts">
	import { navigating } from '$app/stores';

	$: isNavigating = !!$navigating;
</script>

{#if isNavigating}
	<div class="page-loading">
		<div class="spinner-grow text-primary" role="status">
			<span class="loading visually-hidden">Loading...</span>
		</div>
	</div>
{/if}
