<script lang="ts">
	import { DarkMode } from 'flowbite-svelte';
	import { Footer, Header, SideMenu } from './blocks';

	let isLoggedIn = true;
	let isAdmin = true;
	let username = 'sumo';

	// HINT: added `right-4 top-24` to original `btnClass`
	let btnClass = 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 rounded-lg text-lg p-2.5 fixed right-4 top-24 z-50';
</script>

<DarkMode btnClass="{btnClass}" />

<div class="flex h-screen flex-col">
	<!--  start::navbar   -->
	<Header loggedIn="{isLoggedIn}" userName="{username}" isAdmin="{isAdmin}" />
	<!--  end::navbar     -->
	<div class="flex flex-1 overflow-hidden">
		<!--   start::Sidebar    -->
		<SideMenu />
		<!--   end::Sidebar      -->
		<!--   start::Main Content     -->
		<main class="container mx-auto overflow-y-auto py-32 px-8 dark:text-white">
			<slot />
		</main>
		<!--   end::Main Content      -->
	</div>
	<!--   start::Footer    -->
	<Footer />
	<!--   end::Footer      -->
</div>
