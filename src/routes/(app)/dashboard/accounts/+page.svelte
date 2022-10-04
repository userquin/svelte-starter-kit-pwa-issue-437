<style lang="postcss">
	:global(td.matches) {
		background: rgba(46, 196, 182, 0.2);
	}

	/*table {*/
	/*	border-spacing: 0;*/
	/*	border-top: 1px solid black;*/
	/*	border-left: 1px solid black;*/
	/*}*/

	/*th, td {*/
	/*	border-bottom: 1px solid black;*/
	/*	border-right: 1px solid black;*/
	/*	padding: 0.5rem;*/
	/*}*/
</style>

<script lang="ts">
	import { Button, ButtonGroup, Input, Navbar, NavBrand, Select } from 'flowbite-svelte';
	import { MagnifyingGlassCircle, Users } from 'svelte-heros-v2';
	import { writable } from 'svelte/store';
	import { createRender, createTable, Render, Subscribe } from 'svelte-headless-table';
	import { addPagination, addTableFilter } from 'svelte-headless-table/plugins';
	import { Address, Link } from '$lib/components';
	import type { Account } from '$lib/models/types/accounts';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';

	/** @type {import("./$types").PageData */
	export let data: { accounts: Account[] } = { accounts: [] }; // `data` props get initialized from page endpoint.
	let { accounts } = data; // we need this statement to access `results/total` values before component mounted.
	$: ({ accounts } = data); // so `members` stays in sync when `data` changes
	$: memberStore.set(accounts); // update store when data changed

	const memberStore = writable(accounts);
	const table = createTable(memberStore, {
		page: addPagination({ initialPageSize: 5 }),
		tableFilter: addTableFilter()
	});

	const columns = table.createColumns([
		table.column({
			header: 'Id',
			accessor: 'id',
			cell: ({ value }) =>
				createRender(
					Link,
					writable({
						url: `/dashboard/accounts/${value}`,
						content: value
					})
				)
		}),
		table.column({
			header: 'First Name',
			accessor: 'firstName'
		}),
		table.column({
			header: () => 'Last Name',
			accessor: 'lastName'
		}),
		table.column({
			header: () => 'DoB',
			accessor: 'dob'
		}),
		table.column({
			header: () => 'Gender',
			accessor: 'gender'
		}),
		table.column({
			header: 'Address',
			accessor: 'address',
			cell: ({ value }) =>
				createRender(
					Address,
					writable({
						street: value[0].street,
						city: value[0].city,
						state: value[0].state,
						zip: value[0].zip
					})
				)
		}),
		table.column({
			header: 'Number',
			id: 'number',
			accessor: (item) => item.phone[0].number
		})
		// table.column({
		// 	header: 'Extension',
		// 	id: 'extension',
		// 	accessor: (item) => item.phone[0].extension,
		// }),
		// table.column({
		// 	header: 'Priority',
		// 	id: 'priority',
		// 	accessor: (item) => item.phone[0].priority,
		// })
	]);

	const { headerRows, pageRows, tableAttrs, tableBodyAttrs, pluginStates } = table.createViewModel(columns);
	const { pageIndex, pageCount, pageSize, hasNextPage, hasPreviousPage } = pluginStates.page;

	// Search Table
	let firstName = $page.url.searchParams.get('firstName') ?? '*';
	let lastName = $page.url.searchParams.get('lastName') ?? '*';
	let limit = $page.url.searchParams.get('limit') ?? '50';
	let limits = [
		{ value: '5', name: '5' },
		{ value: '10', name: '10' },
		{ value: '20', name: '20' },
		{ value: '50', name: '50' },
		{ value: '100', name: '100' }
	];
	const { filterValue } = pluginStates.tableFilter;

	async function search() {
		await goto(`/dashboard/accounts?firstName=${firstName}&lastName=${lastName}&limit=${limit}`);
	}
</script>

<svelte:head>
	<title>Accounts</title>
	<meta name="description" content="Accounts" />
</svelte:head>

{#if $page.error}
	<pre>{JSON.stringify($page.error)}</pre>
	<!--	<p class="error">{$page.error.code}</p>-->
	<!--	<p class="error">{$page.error.details}</p>-->
{/if}

<Navbar let:hidden let:toggle border="{true}" rounded="{true}">
	<NavBrand>
		<Users />
		<span class="self-center whitespace-nowrap text-xl font-semibold dark:text-white"> Accounts </span>
	</NavBrand>

	<!--	<div class="w-1/6"><div class="w-1/4">-->
	<div class="relative hidden md:block">
		<div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
			<MagnifyingGlassCircle />
		</div>
		<Input bind:value="{firstName}" class="pl-10" placeholder="First Name..." />
	</div>
	<div class="relative hidden md:block">
		<div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
			<MagnifyingGlassCircle />
		</div>
		<Input bind:value="{lastName}" class="pl-10" placeholder="Last Name..." />
	</div>
	<div class="relative hidden md:block">
		<Select class="pl-10" items="{limits}" bind:value="{limit}" />
	</div>

	<Button on:click="{search}">Search</Button>
</Navbar>

<div class="relative overflow-x-auto shadow-md sm:rounded-lg">
	<div class="flex items-center justify-between p-4">
		<!-- search text -->
		<div class="p-4">
			<label for="table-search" class="sr-only">Search</label>
			<div class="relative mt-1">
				<div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
					<svg class="h-5 w-5 text-gray-500 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
						<path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd"></path>
					</svg>
				</div>
				<input bind:value="{$filterValue}" type="text" id="table-search" class="block w-80 rounded-lg border border-gray-300 bg-gray-50 p-2.5 pl-10 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500  dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500" placeholder="Search rows..." />
			</div>
		</div>
	</div>

	<table {...$tableAttrs} class="w-full text-left text-sm text-gray-500 dark:text-gray-400">
		<thead class="bg-gray-50 text-xs uppercase text-gray-700  dark:bg-gray-700 dark:text-gray-400">
			{#each $headerRows as headerRow (headerRow.id)}
				<Subscribe attrs="{headerRow.attrs()}" let:attrs>
					<tr {...attrs}>
						{#each headerRow.cells as cell (cell.id)}
							<Subscribe attrs="{cell.attrs()}" let:attrs>
								<th {...attrs} class="py-3 px-6">
									<div>
										<Render of="{cell.render()}" />
									</div>
								</th>
							</Subscribe>
						{/each}
					</tr>
				</Subscribe>
			{/each}
		</thead>
		<tbody {...$tableBodyAttrs}>
			{#each $pageRows as row (row.id)}
				<Subscribe attrs="{row.attrs()}" let:attrs>
					<tr {...attrs} class="border-b bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-600">
						{#each row.cells as cell (cell.id)}
							<Subscribe attrs="{cell.attrs()}" let:attrs props="{cell.props()}" let:props>
								<td {...attrs} class="whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white" class:matches="{props.tableFilter.matches}">
									<Render of="{cell.render()}" />
								</td>
							</Subscribe>
						{/each}
					</tr>
				</Subscribe>
			{/each}
		</tbody>
	</table>

	<nav class="flex items-center justify-between p-4" aria-label="Table navigation">
		<span class="flex items-center text-sm text-gray-700 dark:text-gray-400">
			<span class="pr-2">Rows ({$pageSize}): </span>
			<Select items="{limits}" bind:value="{$pageSize}" size="sm" class="w-1/6 p-1 text-xs" />
			<span class="pl-4">
				Showing <span class="font-semibold text-gray-900 dark:text-white">{$pageIndex + 1}</span>
				out of <span class="font-semibold text-gray-900 dark:text-white">{$pageCount}</span> Pages
			</span>
		</span>
		<ButtonGroup>
			<Button on:click="{() => $pageIndex--}" disabled="{!$hasPreviousPage}">Prev</Button>
			<Button on:click="{() => $pageIndex++}" disabled="{!$hasNextPage}">Next</Button>
		</ButtonGroup>
	</nav>
</div>
