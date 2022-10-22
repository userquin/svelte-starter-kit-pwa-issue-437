<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { Button, ButtonGroup } from 'flowbite-svelte';
	import { AdjustmentsHorizontal, ArrowLeft } from 'svelte-heros-v2';
	import type { PageData } from './$types';

	export let data: PageData; // item: Account;
	const { account } = data;

	async function goBack() {
		history.back();
		// await goto('/dashboard/accounts');
	}

	async function gotoUsers() {
		await goto('/dashboard/users');
	}
</script>

<svelte:head>
	<title>Account</title>
	<meta name="description" content="Account" />
</svelte:head>

{#if $page.error}
	<pre>{JSON.stringify($page.error)}</pre>
	<!--	<p class="error">{$page.error.code}</p>-->
	<!--	<p class="error">{$page.error.details}</p>-->
{/if}

<h2 class="pb-4 text-2xl">Account</h2>
<div>
	<pre>{JSON.stringify(account, null, 4)}</pre>
</div>

<ButtonGroup>
	<Button outline on:click="{goBack}">
		<ArrowLeft size="18" class="mr-2 text-blue-500 dark:text-green-500" />
		Back
	</Button>
	<Button outline on:click="{gotoUsers}">
		<AdjustmentsHorizontal size="18" class="mr-2 text-blue-500 dark:text-green-500" />
		Users
	</Button>
</ButtonGroup>

<style lang="postcss">
</style>
