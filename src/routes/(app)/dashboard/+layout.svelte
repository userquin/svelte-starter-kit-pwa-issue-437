<script lang="ts">
	import { page } from '$app/stores';
	import { DarkMode } from '$lib/components';
	import { auth, rehydrate } from '$lib/stores/auth.store';
	import { onMount } from 'svelte';
	// import type { LayoutServerData } from './$types';
	import { Footer, Header } from '$lib/blocks/dashboard';
	import { SideMenu } from '$lib/blocks/side';

	onMount(() => {
		rehydrate($page.url.searchParams);
	});
	// export let data: LayoutServerData;
	// let {user} = data;
	// $: console.log($auth.profile)
	// HINT: added `right-4 top-24` to original `btnClass`
	let btnClass = 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 rounded-lg text-lg p-2.5 fixed right-4 top-24 z-50';
</script>

<DarkMode {btnClass} />

<div class="flex h-screen flex-col">
	<!--  start::navbar   -->
	<Header user={{name: $auth.profile?.name, email: $auth.profile?.sub, image: $auth.profile?.picture}} />
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
