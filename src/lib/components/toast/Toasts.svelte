<script lang="ts">
	import classNames from 'classnames';
	import { default as CloseButton } from 'flowbite-svelte/utils/CloseButton.svelte';
	import { default as Frame } from 'flowbite-svelte/utils/Frame.svelte';
	import { Check, ExclamationTriangle, HandRaised, InformationCircle } from 'svelte-heros-v2';
	import { slide } from 'svelte/transition';
	import { dismissToast, ToastLevel, toasts } from './store';

	export let divClass = 'w-full max-w-xs p-4 ';

	export let position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'none' = 'none'; // default not set
	const positions = {
		'top-left': 'absolute top-5 left-5',
		'top-right': 'absolute top-5 right-5',
		'bottom-left': 'absolute bottom-5 left-5',
		'bottom-right': 'absolute bottom-5 right-5',
		none: 'absolute bottom-5 right-5'
	};

	let toastsClass: string;
	$: toastsClass = classNames(divClass, positions[position], $$props.class);

	let iconClass: string;
	$: iconClass = classNames('inline-flex items-center justify-center flex-shrink-0 w-8 h-8 mr-3');
</script>

{#if $toasts}
	<section class="{toastsClass}">
		{#each $toasts as toast (toast.id)}
			<Frame rounded border transition="{slide}" class="mb-2 w-full max-w-xs p-4" {...$$restProps} role="alert">
				<div class="flex items-center">
					<Frame color="{toast.type}" rounded class="{iconClass}">
						{#if toast.type === ToastLevel.Success}
							<Check size="10" variation="solid" ariaLabel="Success icon" />
						{:else if toast.type === ToastLevel.Error}
							<ExclamationTriangle size="10" ariaLabel="Error icon" />
						{:else if toast.type === ToastLevel.Warning}
							<HandRaised size="10" ariaLabel="Warning icon" />
						{:else}
							<InformationCircle size="10" ariaLabel="Info icon" />
						{/if}
					</Frame>
					<div class="w-full text-sm font-normal">
						{toast.message}
					</div>
					{#if toast.dismissible}
						<CloseButton on:click="{() => dismissToast(toast.id)}" />
					{/if}
				</div>
			</Frame>
		{/each}
	</section>
{/if}
