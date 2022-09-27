<style>
</style>

<script lang="ts">
	import { goto, invalidate } from '$app/navigation';
	import { Card, Listgroup, Avatar, ButtonGroup, Button, Radio, Toggle, Input, Label, Datepicker } from 'flowbite-svelte';
	import { AdjustmentsHorizontal, ArchiveBox, ArrowLeft, CloudArrowDown, User, UserCircle, UserGroup, DevicePhoneMobile } from 'svelte-heros-v2';
	import { browser } from '$app/environment';
	import type { PageData, Errors, ActionData } from './$types';
	import type { Member } from '$lib/models/types/member';

	/** @type {import('./$types').PageData */
	export let data: PageData; // item: Policy;
	export let errors: Errors; // `errors` props gets its value if server side error occurred.
	const { member }: { member: Member } = data;

	async function gotoMembers() {
		await goto('/dashboard/accounts');
	}

	async function gotoUsers() {
		await goto('/dashboard/users');
	}

	let list = [
		{
			img: { src: '/images/profile-picture-1.webp', alt: 'Neil Sims' },
			name: 'Neil Sims',
			email: 'email@windster.com',
			value: '$320'
		},
		{
			img: { src: '/images/profile-picture-2.webp', alt: 'Bonnie Green' },
			name: 'Bonnie Green',
			email: 'email@windster.com',
			value: '$3467'
		},
		{
			img: { src: '/images/profile-picture-3.webp', alt: 'Michael Gough' },
			name: 'Michael Gough',
			email: 'email@windster.com',
			value: '$67'
		}
	];
</script>

<svelte:head>
	<title>Account</title>
	<meta name="description" content="Account" />
</svelte:head>

{#if errors}
	<pre>{JSON.stringify(errors)}</pre>
	<!--	<p class="errors">{errors.code}</p>-->
	<!--	<p class="errors">{errors.details}</p>-->
{/if}

<div>
	<pre>{JSON.stringify(member, null, 4)}</pre>
</div>

<ButtonGroup>
	<Button outline on:click="{gotoMembers}">
		<ArrowLeft size="18" class="mr-2 text-blue-500 dark:text-green-500" />
		Back
	</Button>
	<Button outline on:click="{gotoUsers}">
		<AdjustmentsHorizontal size="18" class="mr-2 text-blue-500 dark:text-green-500" />
		Users
	</Button>
</ButtonGroup>
