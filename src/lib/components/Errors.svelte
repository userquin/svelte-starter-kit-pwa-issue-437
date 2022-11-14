<script lang="ts">
	export let errors: { message: string; [key: string]: any }[];
</script>

{#if errors}
	<!-- <pre>{JSON.stringify(errors)}</pre> -->
	{#each errors as error}
		<p><span class="font-bold">Message:</span> <span class="text-ellipsis">{error?.message}</span></p>
		<p><span class="font-bold">Extensions:</span> <span class="text-ellipsis">{JSON.stringify(error?.extensions)}</span></p>
	{/each}
{/if}

<style lang="postcss">
</style>
