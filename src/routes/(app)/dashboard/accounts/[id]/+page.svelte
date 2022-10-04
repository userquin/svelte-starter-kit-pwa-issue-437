<style lang="postcss">
</style>

<script lang="ts">
	import { goto, invalidate } from '$app/navigation';
	import { Card, Listgroup, Avatar, ButtonGroup, Button, Radio, Toggle, Input, Label, Datepicker } from 'flowbite-svelte';
	import { AdjustmentsHorizontal, ArchiveBox, ArrowLeft, CloudArrowDown, User, UserCircle, UserGroup, DevicePhoneMobile } from 'svelte-heros-v2';
	import { browser } from '$app/environment';
	import type { PageData, ActionData } from './$types';
	import type { Account } from '$lib/models/types/member';
	import { page } from '$app/stores';

	/** @type {import('./$types').PageData */
	export let data: PageData; // item: Account;
	const { account }: { account: Account } = data;

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
