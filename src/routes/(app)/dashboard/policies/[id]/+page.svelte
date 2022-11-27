<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { ErrorMessage, Errors, FloatingLabelField, Tags } from '$lib/components';
	// import {default as TagInput } from '$lib/components/TagInput.svelte';
	import { addToast, ToastLevel } from '$lib/components/toast';
	import type { Account } from '$lib/models/schema';
	import { accountClientSchema } from '$lib/models/schema';
	import { removeEmpty } from '$lib/utils/zod.utils';
	import { validator } from '@felte/validator-zod';
	import { createForm } from 'felte';
	import { Breadcrumb, BreadcrumbItem, Button, ButtonGroup, FloatingLabelInput, Spinner } from 'flowbite-svelte';
	import { tick } from 'svelte';
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

	// Felte
	// const schema = editMode ? accountBaseSchema : accountCreateBaseSchema
	const schema = accountClientSchema;
	const {
		form: fForm,
		data: fData,
		errors: fErrors,
		isSubmitting,
		isDirty,
		isValid,
		reset,
		setFields,
		unsetField,
		setErrors,
		setIsDirty
	} = createForm<Account>({
		initialValues: removeEmpty(policy),
		extend: validator({ schema }),
		// this is dummy submit method for felte, sveltekit's `Form Action` really submit the form.
		onSubmit: async (values, context) => {
			await tick();
			console.debug(values);
			console.debug(new FormData(context.form));
		}
	});

	let annos = $fData.annotations ? JSON.stringify($fData.annotations) : '';
	$: annos = $fData.annotations ? JSON.stringify($fData.annotations) : '';
	unsetField('annotations'); // FIXME: to trigger tick !

	console.log('annos---', typeof annos, annos);
	$: console.log('$annos---', typeof annos, annos);
	async function handleAnnotationsChange(event) {
		const newVal = event.target.value;
		console.log('handleAnnotationsChange, newVal.....', newVal);
		if (newVal) {
			try {
				setFields('annotations', JSON.parse(newVal), true);
				annos = newVal;
			} catch (e) {
				console.log(e);
				setErrors('annotations', 'Not a valid JSON');
			}
		} else {
			unsetField('annotations');
		}
		setIsDirty(true);
		await tick();
	}

	//Form
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

<form class="space-y-6" method="POST" action="?/save" use:fForm use:enhance>
	{#if policy}
		<div class="mb-6 grid gap-6 md:grid-cols-3 lg:grid-cols-6">
			<div class="col-span-2">
				<FloatingLabelField name="display_name" style="outlined" label="Display Name" error="{fieldErrors?.display_name?.[0] || $fErrors?.display_name?.[0]}" />
			</div>
			<div class="col-span-4">
				<FloatingLabelField name="description" style="outlined" label="Description" error="{fieldErrors?.description?.[0] || $fErrors?.description?.[0]}" />
			</div>
			<div class="my-tag col-span-3">
				<Tags bind:tags="{$fData.tags}" onlyUnique="{true}" minChars="{3}" placeholder="{'Enter tags...'}" labelText="{'Tags'}" labelShow />
				<input data-felte-ignore type="hidden" name="tags" bind:value="{$fData.tags}" />
				<!-- <TagInput bind:tags={$fData.tags}  name="tags" /> <span>{tags}</span> -->
				<ErrorMessage id="description_help" error="{fieldErrors?.tags?.[0] || $fErrors?.tags?.[0]}" />
			</div>
			<div class="col-span-3">
				<FloatingLabelInput value="{annos}" on:change="{handleAnnotationsChange}" style="outlined" class="input-bordered input" aria-describedby="annotations_help" label="Annotations" />
				<input data-felte-ignore type="hidden" name="annotations" value="{annos}" />
				<ErrorMessage id="annotations_help" error="{fieldErrors?.annotations?.[0] || JSON.stringify($fErrors?.annotations?.[0])}" />
			</div>

			<div class="col-span-2">
				<div class="btn-group">
					{#each subjectTypeOptions as opt}
						<input type="radio" name="subject_type" value="{opt.value}" data-title="{opt.label}" class="btn" disabled="{editMode}" />
					{/each}
				</div>
				<ErrorMessage id="subject_type_help" error="{fieldErrors?.subject_type?.[0] || $fErrors?.subject_type?.[0]}" />
			</div>
			<div>
				<FloatingLabelField name="subject_display_name" style="outlined" label="Subject display name" error="{fieldErrors?.subject_display_name?.[0] || $fErrors?.subject_display_name?.[0]}" disabled="{editMode}" />
			</div>
			<div>
				<FloatingLabelField name="subject_id" style="outlined" label="Subject ID" error="{fieldErrors?.subject_id?.[0] || $fErrors?.subject_id?.[0]}" disabled="{editMode}" />
			</div>
			<div>
				<FloatingLabelField name="subject_secondary_id" style="outlined" label="Subject Secondary ID" error="{fieldErrors?.subject_secondary_id?.[0] || $fErrors?.subject_secondary_id?.[0]}" disabled="{editMode}" />
			</div>
			<div>
				<FloatingLabelField name="subject_domain" style="outlined" label="Subject domain" error="{fieldErrors?.subject_domain?.[0] || $fErrors?.subject_domain?.[0]}" disabled="{editMode}" />
			</div>
			<div class="col-span-3">
				<FloatingLabelField name="source_address" style="outlined" label="Source address" error="{fieldErrors?.source_address?.[0] || $fErrors?.source_address?.[0]}" />
			</div>
			<div class="col-span-3">
				<FloatingLabelField name="source_port" style="outlined" label="Source port" error="{fieldErrors?.source_port?.[0] || $fErrors?.source_port?.[0]}" />
			</div>
			<div class="col-span-3">
				<FloatingLabelField name="destination_address" style="outlined" label="Destination address" error="{fieldErrors?.destination_address?.[0] || $fErrors?.destination_address?.[0]}" />
			</div>
			<div class="col-span-3">
				<FloatingLabelField name="destination_port" style="outlined" label="Destination port" error="{fieldErrors?.destination_port?.[0] || $fErrors?.destination_port?.[0]}" />
			</div>
			<div>
				<select name="protocol" class="select-bordered select w-full focus:outline-none">
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
						<input type="radio" name="action" value="{opt.value}" data-title="{opt.label}" class="btn" />
					{/each}
				</div>
			</div>
			<div class="col-span-2">
				<div class="btn-group">
					{#each directionOptions as opt}
						<input type="radio" name="direction" value="{opt.value}" data-title="{opt.label}" class="btn" />
					{/each}
				</div>
			</div>
			<div>
				<FloatingLabelField name="weight" style="outlined" type="number" label="Weight" error="{fieldErrors?.weight?.[0] || $fErrors?.weight?.[0]}" />
			</div>

			<div class="col-span-6">
				<FloatingLabelField name="app_id" style="outlined" label="App id" error="{fieldErrors?.app_id?.[0] || $fErrors?.app_id?.[0]}" />
			</div>

			<div>
				<label class="label cursor-pointer">
					<span class="label-text">Disabled</span>
					<input name="disabled" type="checkbox" value="{$fData.disabled}" checked="{$fData.disabled}" class="toggle-secondary toggle" />
				</label>
			</div>
			<div>
				<label class="label cursor-pointer">
					<span class="label-text">Template</span>
					<input name="template" type="checkbox" value="{$fData.template}" checked="{$fData.template}" class="toggle-accent toggle" disabled="{editMode}" />
				</label>
			</div>
			<div class="col-start-5">
				<FloatingLabelField type="datetime-local" name="valid_from" error="{fieldErrors?.valid_from?.[0] || $fErrors?.valid_from?.[0]}" label="Valid From" />
			</div>
			<div class="col-end-auto">
				<FloatingLabelField type="datetime-local" name="valid_to" error="{fieldErrors?.valid_to?.[0] || $fErrors?.valid_to?.[0]}" label="Valid To" />
			</div>
		</div>
	{/if}

	<ButtonGroup>
		<Button outline on:click="{goBack}">
			<ArrowLeft size="18" class="mr-2 text-blue-500 dark:text-green-500" />Back
		</Button>
		{#if editMode}
			<Button outline on:click="{reset}" disabled="{!$isDirty}">
				<AdjustmentsHorizontal size="18" class="mr-2 text-blue-500 dark:text-green-500" />Reset
			</Button>
			<Button outline type="submit" disabled="{!$isValid || $isSubmitting}">
				{#if $isSubmitting}
					<Spinner class="mr-3" size="4" color="white" />Saveing ...
				{:else}
					<CloudArrowDown size="18" class="mr-2 text-blue-500 dark:text-green-500" />Save
				{/if}
			</Button>
		{:else}
			<Button outline type="submit" disabled="{!$isValid || $isSubmitting}">
				{#if $isSubmitting}
					<Spinner class="mr-3" size="4" color="white" />Createing ...
				{:else}
					<AdjustmentsHorizontal size="18" class="mr-2 text-blue-500 dark:text-green-500" />Create
				{/if}
			</Button>
		{/if}
	</ButtonGroup>
</form>

<!-- debug -->
<!-- <pre class="p-4">$isValid: {$isValid}</pre>
<pre class="p-4">$fData: {JSON.stringify($fData, null, 4)}</pre>
<pre class="p-4">$fErrors: {JSON.stringify($fErrors, null, 4)}</pre> -->

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
