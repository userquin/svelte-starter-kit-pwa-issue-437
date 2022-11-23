<script lang="ts">
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { Delete, Errors, Link } from '$lib/components';
	import { addToast, ToastLevel } from '$lib/components/toast';
	import type { Account } from '$lib/models/schema';
	import { Button, ButtonGroup, Input, InputAddon, Navbar, NavBrand, Select } from 'flowbite-svelte';
	import { createRender, createTable, Render, Subscribe } from 'svelte-headless-table';
	import { addPagination, addSortBy, addTableFilter } from 'svelte-headless-table/plugins';
	import { ChevronDown, ChevronUp, DevicePhoneMobile, MagnifyingGlass, ShieldCheck, User, UserCircle, UserGroup } from 'svelte-heros-v2';
	import { TimeDistance } from 'svelte-time-distance';
	import { writable } from 'svelte/store';
	import type { ActionData, PageData } from './$types';

	export let form: ActionData;
	let { actionResult, actionErrors } = form || {};
	$: if (form) ({ actionResult, actionErrors } = form);
	$: if (actionResult) addToast({ message: `${actionResult?.display_name} deleted`, dismissible: true, timeout: 10000, type: ToastLevel.Info });
	$: if (actionErrors) addToast({ message: actionErrors[0].message, dismissible: true, timeout: 10000, type: ToastLevel.Error });

	export let data: PageData;
	let { policies, loadErrors } = data;
	// update store when `data` changed
	$: ({ policies, loadErrors } = data);
	$: policyStore.set(policies ?? [{} as Account]);

	const policyStore = writable(policies ?? [{} as Account]);
	const table = createTable(policyStore, {
		page: addPagination({ initialPageSize: 5 }),
		tableFilter: addTableFilter(),
		sort: addSortBy()
	});

	const columns = table.createColumns([
		table.column({
			header: 'Name',
			accessor: (item) => item,
			id: 'name',
			cell: ({ value }) =>
				createRender(Link, {
					url: `/dashboard/policies/${value.id}`,
					content: value.display_name
				}),
			plugins: {
				tableFilter: {
					getFilterValue: ({ display_name }) => display_name
				},
				sort: {
					getSortValue: ({ display_name }) => display_name
				}
			}
		}),
		table.column({
			header: 'Subject',
			accessor: 'subject_display_name'
		}),
		table.column({
			header: 'Created',
			accessor: 'create_time',
			cell: ({ value }) =>
				createRender(TimeDistance, {
					timestamp: Date.parse(value),
					class: 'decoration-solid'
				}),
			plugins: {
				tableFilter: {
					exclude: true
				},
				sort: {
					getSortValue: (value) => value
				}
			}
		}),
		table.column({
			header: 'Source',
			id: 'source',
			accessor: (item) => `${item.source_address ?? ''}:${item.source_port ?? ''}`
		}),
		table.column({
			header: 'Destination',
			id: 'destination',
			accessor: (item) => `${item.destination_address ?? ''}:${item.destination_port ?? ''}`
		}),
		table.column({
			header: 'Disabled',
			accessor: 'disabled'
		}),
		table.column({
			header: 'Template',
			accessor: 'template'
		}),
		table.column({
			header: 'Delete',
			id: 'delete',
			accessor: 'id',
			// cell: ({ value }) => createRender(Delete).on('click', async () => deletePolicy(value))
			cell: ({ value }) => createRender(Delete, { id: value })
		})
	]);

	const { headerRows, pageRows, tableAttrs, tableBodyAttrs, pluginStates } = table.createViewModel(columns);
	const { pageIndex, pageCount, pageSize, hasNextPage, hasPreviousPage } = pluginStates.page;

	// Search Table
	let name = $page.url.searchParams.get('name') ?? '';
	let subType = $page.url.searchParams.get('subType') ?? '';
	let limit = $page.url.searchParams.get('limit') ?? '50';
	let limits = [
		{ value: '5', name: '5' },
		{ value: '10', name: '10' },
		{ value: '20', name: '20' },
		{ value: '50', name: '50' },
		{ value: '100', name: '100' }
	];
	const subTypeOptions = [
		{ value: '', name: 'All' },
		{ value: 'subject_type_user', name: 'User' },
		{ value: 'subject_type_group', name: 'Group' },
		{ value: 'subject_type_device', name: 'Device' },
		{ value: 'subject_type_service_account', name: 'Service' }
	];

	const { filterValue } = pluginStates.tableFilter;

	async function gotoCreatePolicy() {
		goto('/dashboard/policies/00000000-0000-0000-0000-000000000000');
	}

	async function onSearch() {
		if (browser) {
			await goto(`/dashboard/policies?name=${name}&subType=${subType}&limit=${limit}`);
		}
	}
</script>

<svelte:head>
	<title>Accounts</title>
	<meta name="description" content="accounts" />
</svelte:head>

<Errors errors="{loadErrors}" />

{#if policies}
	<Navbar let:hidden let:toggle border="{true}" rounded="{true}">
		<NavBrand>
			<ShieldCheck />
			<span class="self-center whitespace-nowrap text-xl font-semibold dark:text-white"> Policies </span>
		</NavBrand>
		<ButtonGroup class="w-1/2">
			<Select class="w-auto !rounded-r-none" items="{subTypeOptions}" bind:value="{subType}" placeholder="Select Type" />
			<InputAddon class="!bg-gray-50 !px-2 dark:!bg-gray-500">
				{#if subType == 'subject_type_group'}
					<UserGroup />
				{:else if subType == 'subject_type_service_account'}
					<UserCircle />
				{:else if subType == 'subject_type_device'}
					<DevicePhoneMobile />
				{:else}
					<User />
				{/if}
			</InputAddon>
			<Input bind:value="{name}" placeholder="Display Name" />
			<Select class="w-16 !rounded-none border-l-0" items="{limits}" bind:value="{limit}" />
			<Button color="dark" class="!p-2.5" on:click="{onSearch}"><MagnifyingGlass size="20" /></Button>
		</ButtonGroup>
		<Button color="dark" on:click="{gotoCreatePolicy}">Add Policy</Button>
	</Navbar>

	<div class="relative overflow-x-auto shadow-md sm:rounded-lg">
		<div class="flex items-center justify-between p-4">
			<!-- search text -->
			<div class="p-4">
				<label for="table-search" class="sr-only">Search</label>
				<div class="relative mt-1">
					<div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
						<svg class="h-5 w-5 text-gray-500 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd"></path></svg>
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
								<Subscribe attrs="{cell.attrs()}" let:attrs props="{cell.props()}" let:props>
									<th {...attrs} on:click="{props.sort.toggle}" class="py-3 px-6">
										<div class="flex items-center">
											<Render of="{cell.render()}" />
											{#if props.sort.order === 'asc'}
												<ChevronDown size="16" variation="solid" class="ml-1" />
											{:else if props.sort.order === 'desc'}
												<ChevronUp size="16" variation="solid" class="ml-1" />
											{/if}
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
{/if}

<style lang="postcss">
	:global(td.matches) {
		background: rgba(46, 196, 182, 0.2);
	}
	:global(.sv-control) {
		--sv-min-height: 48px;
		border-radius: 0.5rem !important;
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
