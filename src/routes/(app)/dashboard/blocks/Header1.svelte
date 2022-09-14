<script lang="ts">
	import { Avatar, Dropdown, DropdownDivider, DropdownHeader, DropdownItem, ToolbarButton, Navbar, NavBrand, NavHamburger, NavLi, NavUl } from 'flowbite-svelte';
	import { Hamburger } from '$lib/components';
	import { page } from '$app/stores';

	let path;
	$: path = $page.url.pathname;

	// let navClass = ' border-gray-200 px-2 sm:px-4 py-2.5 bg-white dark:bg-gray-800'
	// Added `bg-gray-50 dark:bg-gray-700` like sidebar and footer
	let navClass = ' border-gray-200 px-2 sm:px-4 py-2.5 bg-gray-50 dark:bg-gray-700';
	// added `hidden sm:block` to hide on small screens along with sidebar
	let hamburgerClass = 'text-gray-500 hover:text-gray-700 cursor-pointer border-none focus:outline-none dark:text-white hidden sm:block';
</script>

<Navbar let:hidden let:toggle fluid="{false}" border="{false}" navClass="{navClass}">
	<div class="flex items-center">
		<Hamburger hamburgerClass="{hamburgerClass}" />
		<NavBrand href="/">
			<svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="ml-3 mr-3 h-10 w-10 rounded-full bg-indigo-500 p-2 text-white" viewBox="0 0 24 24">
				<path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
			</svg>
			<!--			<img src="/logos/6-1.svg" class="ml-3 mr-3 h-6 sm:h-9" alt="Datablocks Logo" />-->
			<span class="self-center whitespace-nowrap text-xl font-semibold">
				<span class="text-[#b1171c] dark:text-pink-500">Data</span><span class="text-[#515151] dark:text-white">Blocks</span>
			</span>
		</NavBrand>
	</div>
	<!--
	<div>
		<Button color="none" data-collapse-toggle="mobile-menu-3" aria-controls="mobile-menu-3" aria-expanded="false" class="md:hidden text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 rounded-lg text-sm p-2.5 mr-1">
			<Search variation="solid" />
		</Button>
		<div class="hidden relative md:block">
			<div class="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
				<Search />
			</div>
			<Input id="search-navbar" class="pl-10" placeholder="Search..." />
		</div>
	</div>
	-->
	<!-- keep NavHamburger here, to keep Hamburger to left on small screen-->
	<NavHamburger on:click="{toggle}" />

	<!-- TODO: dummy space to push -NavUl close to Dropdown -->
	<div></div>
	<div></div>
	<div></div>
	<div></div>
	<div></div>
	<div></div>
	<div></div>
	<div></div>
	<div></div>
	<div></div>
	<div></div>
	<NavUl hidden="{hidden}">
		<NavLi href="/dashboard" active="{path == '/dashboard'}">Dashboard</NavLi>
		<NavLi href="/dashboard/tenants" active="{path == '/dashboard/tenants'}">Tenants</NavLi>
		<NavLi href="/dashboard/users" active="{path == '/dashboard/users'}">Users</NavLi>
	</NavUl>

	<!-- TODO: see if we can use  `hidden` prop to hide Dropdown on small screen-->
	<div class="hidden md:block">
		<Avatar class="acs" src="https://flowbite-svelte.com/images/profile-picture-2.webp" size="md" border>SC</Avatar>
		<Dropdown arrowIcon="{false}" inline="{true}">
			<DropdownHeader>
				<span class="block text-sm"> Sumanth </span>
				<span class="block truncate text-sm font-medium"> sumo@demo.com </span>
			</DropdownHeader>
			<DropdownItem>Profile</DropdownItem>
			<DropdownItem>Settings</DropdownItem>
			<DropdownDivider />
			<DropdownItem>
				<a rel="external" href="/.auth/logout?post_logout_redirect_uri=/">Sign Out</a>
			</DropdownItem>
		</Dropdown>
	</div>
</Navbar>
