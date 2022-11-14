<script lang="ts">
	import { DarkMode } from 'flowbite-svelte';

	// HINT: added `right-4 top-24` to original `btnClass`
	let btnClass = 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 rounded-lg text-lg p-2.5 fixed right-4 top-24 z-50';
</script>

<DarkMode btnClass="{btnClass}" />

<!-- <div class="h-full w-full"> -->
<div class="flex h-screen flex-col">
	<slot />
</div>
