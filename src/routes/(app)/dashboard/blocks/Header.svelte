<script lang="ts">
	// ref: https://github.com/DandrewsDev/lnkd/blob/main/lnkd-front/src/routes/__layout.svelte

	import { modalIdStore, Navbar, NavBrand, NavHamburger, NavLi, NavUl } from 'flowbite-svelte';
	// import {userJwt} from "../stores.js";
	export let loggedIn = false;
	export let isAdmin = false;
	export let userName = '';

	function handleLoginEvent() {
		modalIdStore.update((n) => (n = 'signin1'));
	}
	function handleLogoutEvent() {
		loggedIn = false;
		// userJwt.set('');
		window.location.href = '/';
	}
</script>

<Navbar let:hidden let:toggle>
	<NavBrand href="/">
		<span class="self-center whitespace-nowrap text-xl font-semibold dark:text-white"> LNKD </span>
	</NavBrand>
	<NavHamburger on:click="{toggle}" />
	<NavUl hidden="{hidden}">
		{#if !loggedIn}
			<div class="block border-b border-gray-100 py-2 pr-4 pl-3 text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white md:border-0 md:p-0 md:hover:bg-transparent md:hover:text-blue-700 md:dark:hover:bg-transparent md:dark:hover:text-white" on:click="{handleLoginEvent}"> Login </div>
		{/if}
		{#if loggedIn}
			<span class="self-center whitespace-nowrap dark:text-white">
				Welcome user: {userName}
			</span>
			{#if isAdmin}
				<NavLi href="/UserManagement">User Management</NavLi>
				<NavLi href="/RouteManagement">Route Management</NavLi>
			{/if}
			<div class="block border-b border-gray-100 py-2 pr-4 pl-3 text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white md:border-0 md:p-0 md:hover:bg-transparent md:hover:text-blue-700 md:dark:hover:bg-transparent md:dark:hover:text-white" on:click="{handleLogoutEvent}"> Logout </div>
		{/if}
	</NavUl>
</Navbar>
