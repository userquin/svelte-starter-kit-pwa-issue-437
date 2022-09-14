<script>
	import { DarkMode } from 'flowbite-svelte';
	import { Header1, Header2, Header3, Header4 } from '$lib/blocks/header';
	import { Footer1, Footer4 } from '$lib/blocks/footer';

	// HINT: added `right-4 top-4` to original `btnClass`
	let btnClass = 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 rounded-lg text-lg p-2.5 fixed right-4 top-4 z-50';
</script>

<div class="flex min-h-screen flex-col">
	<DarkMode btnClass="{btnClass}" />

	<Header1 />

	<slot />
	<Footer1 />
</div>
