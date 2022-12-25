<script lang="ts">
	import { Footer, Header } from '$lib/blocks/dashboard';
	import { SideMenu } from '$lib/blocks/side';
	import { DarkMode } from '$lib/components';
	import { onMount } from 'svelte';
	import type { LayoutServerData } from './$types';

	export let data: LayoutServerData;

	async function getAzureProfilePicture(access_token: string) {
		const res = await fetch('https://graph.microsoft.com/v1.0/me/photos/48x48/$value', {
			headers: {
				Authorization: `Bearer ${access_token}`,
				'Content-Type': 'image/jpg'
			},
			cache: 'force-cache'
		});
		if (!res.ok) throw { code: res.status, message: res.statusText };

		const pictureBuffer = await res.arrayBuffer();
		const pictureBase64 = btoa(String.fromCharCode(...new Uint8Array(pictureBuffer)));
		// const pictureBase64 = Buffer.from(data).toString('base64');
		return `data:image/jpeg;base64, ${pictureBase64}`;
	}

	let { session } = data;
	const user = session?.user;

	onMount(async () => {
		if (user) user.image ??= await getAzureProfilePicture(session.token);
	});

	// console.log('session>>>', session);

	// HINT: added `right-4 top-24` to original `btnClass`
	let btnClass = 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 rounded-lg text-lg p-2.5 fixed right-4 top-24 z-50';
</script>

<DarkMode {btnClass} />

<div class="flex h-screen flex-col">
	<!--  start::navbar   -->
	<Header {user} />
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
