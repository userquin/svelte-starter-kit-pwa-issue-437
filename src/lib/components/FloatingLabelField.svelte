<script lang="ts">
	import { FloatingLabelInput } from 'flowbite-svelte';

	export let style: 'filled' | 'outlined' | 'standard' = 'outlined';
	export let name: string;
	export let value: string | number | Date | undefined = '';
	export let label: string;
	export let error = '';
</script>

<FloatingLabelInput name="{name}" id="{name}" style="{style}" class="input-bordered input" {...$$restProps} value="{value}" color="{error ? 'red' : null}" aria-describedby="{`${name}_help`}" label="{label}" />

{#if error}
	<p class="mt-2 text-xs font-normal text-red-700 dark:text-red-500"> <span class="font-medium">Oh, snapp!</span> {error}</p>
{/if}
