<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { ErrorMessage, Errors, FloatingLabelField, Tags } from '$lib/components';
	// import {default as TagInput } from '$lib/components/TagInput.svelte';
	import { addToast, ToastLevel } from '$lib/components/toast';
	import { Breadcrumb, BreadcrumbItem, Button, ButtonGroup, FloatingLabelInput, Radio, Select, Toggle } from 'flowbite-svelte';
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
	let tags = policy?.tags ?? '';
	let disabled = policy?.disabled;
	function handleDisabledClick(event) {
		const target = event.target;
		let value = (<HTMLInputElement>target).getAttribute('value');
		disabled = value != 'true';
	}
	let template = policy?.template;
	function handleTemplateClick(event) {
		const target = event.target;
		let value = (<HTMLInputElement>target).getAttribute('value');
		// if (policy) policy.template = value != 'true';
		template = value != 'true';
	}
	let subjectTypeOptions = [
		{
			id: 'subject-type-option-1',
			name: 'subject_type',
			value: 'subject_type_user',
			label: 'User',
			color: 'orange'
		},
		{
			id: 'subject-type-option-2',
			name: 'subject_type',
			value: 'subject_type_group',
			label: 'Group',
			color: 'green'
		},
		// {
		// 	id: 'subject-type-option-3',
		// 	name: 'subject_type',
		// 	value: 'subject_type_service_account',
		// 	label: 'Service Account',
		// 	color: 'purple'
		// },
		{
			id: 'subject-type-option-4',
			name: 'subject_type',
			value: 'subject_type_device',
			label: 'Device',
			color: 'teal'
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
	let selectedAction = policy?.action;
	let actionOptions = [
		{
			id: 'action-option-1',
			name: 'action',
			value: 'action_permit',
			color: 'green',
			label: 'Allow'
		},
		{
			id: 'action-option-2',
			name: 'action',
			value: 'action_block',
			color: 'orange',
			label: 'Deny'
		}
	];
	let selectedDirection = policy?.direction;
	let directionOptions = [
		{
			id: 'direction-option-1',
			name: 'direction',
			value: 'direction_egress',
			color: 'green',
			label: 'Egress' // Outbound
		},
		{
			id: 'direction-option-2',
			name: 'direction',
			value: 'direction_ingress',
			color: 'orange',
			label: 'Ingress' // Inbound
		}
	];
	const min = new Date().toISOString().substring(0, 16);
	const max = new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().substring(0, 16);
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
				<FloatingLabelInput name="display_name" id="display_name" value="{policy.display_name}" color="{fieldErrors?.display_name ? 'red' : null}" style="outlined" aria-describedby="display_name_help" type="text" label="Display Name" />
				<ErrorMessage id="display_name_help" error="{fieldErrors?.display_name?.[0]}" />
			</div>
			<div class="col-span-4">
				<FloatingLabelInput name="description" id="description" value="{policy.description}" color="{fieldErrors?.description ? 'red' : null}" style="outlined" aria-describedby="description_help" type="text" label="Description" />
				<ErrorMessage id="description_help" error="{fieldErrors?.description?.[0]}" />
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
				<ul class="w-2/3 divide-x divide-gray-500 rounded-lg border border-gray-500 dark:divide-gray-600 dark:border-gray-600 dark:bg-gray-800 sm:flex">
					{#each subjectTypeOptions as opt}
						<li>
							<Radio class="p-3" {...opt} bind:group="{policy.subject_type}" disabled="{editMode}">{opt.label}</Radio>
						</li>
					{/each}
				</ul>
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
				<Select id="protocol" name="protocol" value="{policy.protocol}" size="lg" class="border-gray-900" items="{protocols}" />
			</div>
			<div class="col-span-2">
				<ul class="w-3/5 divide-x divide-gray-500 rounded-lg border border-gray-500 dark:divide-gray-600 dark:border-gray-600 dark:bg-gray-800 sm:flex">
					{#each actionOptions as opt}
						<li>
							<Radio class="p-3" {...opt} bind:group="{selectedAction}">{opt.label}</Radio>
						</li>
					{/each}
				</ul>
			</div>
			<div class="col-span-2">
				<ul class="w-3/5 divide-x divide-gray-500 rounded-lg border border-gray-500 dark:divide-gray-600 dark:border-gray-600 dark:bg-gray-800 sm:flex">
					{#each directionOptions as opt}
						<li>
							<Radio class="p-3" {...opt} bind:group="{selectedDirection}">{opt.label}</Radio>
						</li>
					{/each}
				</ul>
			</div>
			<div>
				<FloatingLabelField name="weight" style="outlined" type="number" value="{policy.weight}" label="Weight" error="{fieldErrors?.weight?.[0]}" />
			</div>

			<div class="col-span-6">
				<FloatingLabelField name="app_id" style="outlined" value="{policy.app_id}" label="App id" error="{fieldErrors?.app_id?.[0]}" />
			</div>

			<div>
				<Toggle name="disabled" color="orange" bind:value="{disabled}" checked="{disabled}" on:click="{handleDisabledClick}">Disabled</Toggle>
			</div>
			<div>
				<Toggle name="template" color="green" bind:value="{template}" checked="{template}" disabled="{editMode}" on:click="{handleTemplateClick}">Template</Toggle>
			</div>
			<div class="col-start-5">
				<FloatingLabelField type="datetime-local" name="valid_from" value="{policy.valid_from}" error="{fieldErrors?.valid_from?.[0]}" label="Valid From" max="{max}" />
			</div>
			<div class="col-end-auto">
				<FloatingLabelField type="datetime-local" name="valid_to" value="{policy.valid_to}" error="{fieldErrors?.valid_to?.[0]}" label="Valid To" min="{min}" max="{max}" />
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
		@apply relative  rounded-lg border-gray-600 text-gray-900;
	}

	.my-tag :global(.svelte-tags-input-layout label) {
		/* eslint-disable */
		@apply absolute top-0.5 left-1 z-10 origin-[0] -translate-y-4 scale-75 transform bg-white px-2 text-sm text-gray-500 duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:px-2 peer-focus:text-blue-600 dark:bg-gray-900 dark:text-gray-400 peer-focus:dark:text-blue-500;
	}

	.my-tag :global(.svelte-tags-input) {
		@apply block w-full appearance-none rounded-lg border-gray-300 bg-transparent p-2 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-gray-600 dark:text-white dark:focus:border-blue-500;
	}
</style>
