<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { ErrorMessage, Errors, FloatingLabelField, Tags } from '$lib/components';
	// import {default as TagInput } from '$lib/components/TagInput.svelte';
	import { addToast, ToastLevel } from '$lib/components/toast';
	import { Breadcrumb, BreadcrumbItem, Button, ButtonGroup } from 'flowbite-svelte';
	import { AdjustmentsHorizontal, ArrowLeft, CloudArrowDown } from 'svelte-heros-v2';
	import type { ActionData, PageData } from './$types';

	export let form: ActionData;
	let { actionResult, actionErrors, formErrors, fieldErrors } = form || {};
	$: if (form) ({ actionResult, actionErrors, formErrors, fieldErrors } = form);
	$: if (actionResult) {
		addToast({ message: `${actionResult?.display_name} saved`, dismissible: true, timeout: 10000, type: ToastLevel.Info });
		goto('/dashboard/policies');
	}
	$: if (actionErrors) addToast({ message: actionErrors[0].message, dismissible: true, timeout: 10000, type: ToastLevel.Error });

	$: console.log('actionResultresult', actionResult);
	$: console.log('actionErrors', actionErrors);
	$: console.log('formErrors', formErrors);
	$: console.log('fieldErrors', fieldErrors);

	export let data: PageData;
	let { policy, loadErrors } = data;
	$: ({ policy, loadErrors } = data);
	$: if (loadErrors) console.log('details: loadErrors', loadErrors);
	$: if (policy) console.log('details: policy', policy);
	let editMode = policy?.id != '00000000-0000-0000-0000-000000000000';

	async function goBack() {
		history.back();
	}

	async function doReset() {
		// just touch to renender
		if (policy) policy.display_name = policy.display_name;
	}

	//Form
	let tags = policy?.tags ?? [];
	let subjectTypeOptions = [
		{
			value: 'subject_type_user',
			label: 'User'
		},
		{
			value: 'subject_type_group',
			label: 'Group'
		},
		// {
		// 	value: 'subject_type_service_account',
		// 	label: 'Service Account',
		// },
		{
			value: 'subject_type_device',
			label: 'Device'
		}
	];
	let protocols = [
		{ value: 'Any', name: 'Any' },
		{ value: 'IP', name: 'IP' },
		{ value: 'ICMP', name: 'ICMP' },
		{ value: 'IGMP', name: 'IGMP' },
		{ value: 'TCP', name: 'TCP' },
		{ value: 'UDP', name: 'UDP' },
		{ value: 'IPV6', name: 'IPV6' },
		{ value: 'ICMPV6', name: 'ICMPV6' },
		{ value: 'RM', name: 'RM' }
	];
	let actionOptions = [
		{
			value: 'action_permit',
			label: 'Allow'
		},
		{
			value: 'action_block',
			label: 'Deny'
		}
	];
	let directionOptions = [
		{
			value: 'direction_egress',
			label: 'Egress' // Outbound
		},
		{
			value: 'direction_ingress',
			label: 'Ingress' // Inbound
		}
	];
</script>

<svelte:head>
	<title>Account</title>
	<meta name="description" content="Account" />
</svelte:head>

<Breadcrumb aria-label="Default breadcrumb example" class="mb-6">
	<BreadcrumbItem href="/dashboard" home>Home</BreadcrumbItem>
	<BreadcrumbItem href="/dashboard/policies">Accounts</BreadcrumbItem>
	<BreadcrumbItem>Edit Account</BreadcrumbItem>
</Breadcrumb>

<Errors errors="{loadErrors}" />

<form class="space-y-6" method="POST" action="?/save" use:enhance>
	{#if policy}
		<div class="mb-6 grid gap-6 md:grid-cols-3 lg:grid-cols-6">
			<div class="col-span-2">
				<FloatingLabelField name="display_name" style="outlined" value="{policy.display_name}" label="Display Name" error="{fieldErrors?.display_name?.[0]}" />
			</div>
			<div class="col-span-4">
				<FloatingLabelField name="description" style="outlined" value="{policy.description}" label="Description" error="{fieldErrors?.description?.[0]}" />
			</div>
			<div class="my-tag col-span-3">
				<Tags bind:tags="{tags}" onlyUnique="{true}" minChars="{3}" placeholder="{'Enter tags...'}" labelText="{'Tags'}" labelShow />
				<input type="hidden" name="tags" hidden value="{tags}" />
				<!-- <TagInput {tags}  name="tags" /> <span>{tags}</span> -->
				<ErrorMessage id="description_help" error="{fieldErrors?.tags?.[0]}" />
			</div>
			<div class="col-span-3">
				<FloatingLabelField name="annotations" value="{policy.annotations ? JSON.stringify(policy.annotations) : ''}" label="Annotations" error="{fieldErrors?.annotations?.[0]}" />
			</div>

			<div class="col-span-2">
				<div class="btn-group">
					{#each subjectTypeOptions as opt}
						<input type="radio" name="subject_type" bind:group="{policy.subject_type}" value="{opt.value}" data-title="{opt.label}" class="btn" disabled="{editMode}" />
					{/each}
				</div>
				<ErrorMessage id="subject_type_help" error="{fieldErrors?.subject_type?.[0]}" />
			</div>
			<div>
				<FloatingLabelField name="subject_display_name" style="outlined" value="{policy.subject_display_name}" label="Subject display name" error="{fieldErrors?.subject_display_name?.[0]}" disabled="{editMode}" />
			</div>
			<div>
				<FloatingLabelField name="subject_id" style="outlined" value="{policy.subject_id}" label="Subject ID" error="{fieldErrors?.subject_id?.[0]}" disabled="{editMode}" />
			</div>
			<div>
				<FloatingLabelField name="subject_secondary_id" style="outlined" value="{policy.subject_secondary_id}" label="Subject Secondary ID" error="{fieldErrors?.subject_secondary_id?.[0]}" disabled="{editMode}" />
			</div>
			<div>
				<FloatingLabelField name="subject_domain" style="outlined" value="{policy.subject_domain}" label="Subject domain" error="{fieldErrors?.subject_domain?.[0]}" disabled="{editMode}" />
			</div>
			<div class="col-span-3">
				<FloatingLabelField name="source_address" style="outlined" value="{policy.source_address}" label="Source address" error="{fieldErrors?.source_address?.[0]}" />
			</div>
			<div class="col-span-3">
				<FloatingLabelField name="source_port" style="outlined" value="{policy.source_port}" label="Source port" error="{fieldErrors?.source_adsource_portdress?.[0]}" />
			</div>
			<div class="col-span-3">
				<FloatingLabelField name="destination_address" style="outlined" value="{policy.destination_address}" label="Destination address" error="{fieldErrors?.destination_address?.[0]}" />
			</div>
			<div class="col-span-3">
				<FloatingLabelField name="destination_port" style="outlined" value="{policy.destination_port}" label="Destination port" error="{fieldErrors?.destination_port?.[0]}" />
			</div>
			<div>
				<select name="protocol" class="select-bordered select w-full focus:outline-none" value="{policy.protocol}">
					{#each protocols as protocol}
						<option value="{protocol.value}">
							{protocol.name}
						</option>
					{/each}
				</select>
			</div>
			<div class="col-span-2">
				<div class="btn-group">
					{#each actionOptions as opt}
						<input type="radio" name="action" bind:group="{policy.action}" value="{opt.value}" data-title="{opt.label}" class="btn" />
					{/each}
				</div>
			</div>
			<div class="col-span-2">
				<div class="btn-group">
					{#each directionOptions as opt}
						<input type="radio" name="direction" bind:group="{policy.direction}" value="{opt.value}" data-title="{opt.label}" class="btn" />
					{/each}
				</div>
			</div>
			<div>
				<FloatingLabelField name="weight" style="outlined" type="number" bind:value="{policy.weight}" label="Weight" error="{fieldErrors?.weight?.[0]}" />
			</div>

			<div class="col-span-6">
				<FloatingLabelField name="app_id" style="outlined" value="{policy.app_id}" label="App id" error="{fieldErrors?.app_id?.[0]}" />
			</div>

			<div>
				<label class="label cursor-pointer">
					<span class="label-text">Disabled</span>
					<input name="disabled" type="checkbox" class="toggle-secondary toggle" bind:value="{policy.disabled}" bind:checked="{policy.disabled}" />
				</label>
			</div>
			<div>
				<label class="label cursor-pointer">
					<span class="label-text">Template</span>
					<input name="template" type="checkbox" class="toggle-accent toggle" disabled="{editMode}" bind:value="{policy.template}" bind:checked="{policy.template}" />
				</label>
			</div>
			<div class="col-start-5">
				<FloatingLabelField type="datetime-local" name="valid_from" value="{policy.valid_from}" error="{fieldErrors?.valid_from?.[0]}" label="Valid From" />
			</div>
			<div class="col-end-auto">
				<FloatingLabelField type="datetime-local" name="valid_to" value="{policy.valid_to}" error="{fieldErrors?.valid_to?.[0]}" label="Valid To" />
			</div>
		</div>
	{/if}

	<ButtonGroup>
		<Button outline on:click="{goBack}">
			<ArrowLeft size="18" class="mr-2 text-blue-500 dark:text-green-500" />Back
		</Button>
		{#if editMode}
			<Button outline on:click="{doReset}">
				<AdjustmentsHorizontal size="18" class="mr-2 text-blue-500 dark:text-green-500" />Reset
			</Button>
			<Button outline type="submit">
				<CloudArrowDown size="18" class="mr-2 text-blue-500 dark:text-green-500" />Save
			</Button>
		{:else}
			<Button outline type="submit">
				<AdjustmentsHorizontal size="18" class="mr-2 text-blue-500 dark:text-green-500" />Create
			</Button>
		{/if}
	</ButtonGroup>
</form>

<style lang="postcss">
	:global(.sv-control) {
		border-radius: 0.5rem !important;
		--sv-min-height: 48px;
		--sv-disabled-bg: rgb(249 250 251 / var(--tw-bg-opacity));
		--sv-disabled-border-color: border-gray-900;
		/*--sv-border-color: border-gray-900;*/
	}

	.my-tag :global(.svelte-tags-input-layout.sti-layout-disable),
	.my-tag :global(.svelte-tags-input:disabled) {
		background: rgb(249 250 251 / var(--tw-bg-opacity));
		cursor: not-allowed;
	}

	/*override svelte-tags-input default styles*/
	.my-tag :global(.svelte-tags-input-tag-remove) {
		cursor: pointer;
		padding-left: 1rem;
		font-size: 1rem;
		color: red;
	}

	.my-tag :global(.svelte-tags-input-layout) {
		@apply relative  rounded-lg  text-gray-900;
	}

	.my-tag :global(.svelte-tags-input-layout label) {
		/* eslint-disable */
		@apply absolute top-0.5 left-1 z-10 origin-[0] -translate-y-4 scale-75 transform bg-white px-2 text-sm text-gray-500 duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:px-2 peer-focus:text-blue-600 dark:bg-gray-900 dark:text-gray-400 peer-focus:dark:text-blue-500;
	}

	.my-tag :global(.svelte-tags-input) {
		@apply block w-full appearance-none rounded-lg border-gray-300 bg-transparent p-2 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-gray-600 dark:text-white dark:focus:border-blue-500;
	}

	.my-tag :global(.svelte-tags-input-layout:focus-within) {
		outline: -webkit-focus-ring-color;
	}
</style>
