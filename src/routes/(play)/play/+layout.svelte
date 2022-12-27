<script lang="ts">
	import { DarkMode } from '$lib/components';

	// HINT: added `right-4 top-24` to original `btnClass`
	let btnClass = 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 rounded-lg text-lg p-2.5 fixed right-4 top-24 z-50';
</script>

<DarkMode {btnClass} />

<div class="flex flex-col h-screen">
  <header class="text-center p-5 border-b-4">
    <a class="btn " href="/play">Menu</a>
  </header>
  <main class="flex-grow pt-1 px-3">
	<slot />
  </main>
  <footer class="flex justify-center p-5 border-t-2">
    Social links
  </footer>
</div>
