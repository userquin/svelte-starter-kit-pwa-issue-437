<script lang="ts">
	import { dev } from '$app/environment';
	import { page } from '$app/stores';
</script>

<svelte:head>
	<title>Error: {$page.status} : {$page.error.message}</title>
</svelte:head>

<div class="flex min-h-full flex-col bg-white pt-16 pb-12">
	<main class="mx-auto flex w-full max-w-7xl flex-grow flex-col justify-center px-4 sm:px-6 lg:px-8">
		<div class="flex flex-shrink-0 justify-center">
			<a href="/" class="inline-flex">
				<span class="sr-only">TrustZero</span>
				<img class="h-12 w-auto" src="https://tailwindui.com/img/logos/workflow-mark.svg?color=teal&shade=600" alt="" />
			</a>
		</div>
		<div class="py-16">
			<div class="text-center">
				<p class="text-sm font-semibold uppercase tracking-wide text-teal-600"> {$page.status} error </p>
				<h1 class="mt-2 text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl"> Something's wrong here. </h1>
				<p class="mt-2 text-base text-gray-500"> Sorry, we couldn’t serve the page you’re looking for. </p>
				<div class="mt-6">
					<a href="/" class="text-base font-medium text-teal-600 hover:text-teal-500">Go back home<span aria-hidden="true"> &rarr;</span></a>
				</div>
			</div>
		</div>
	</main>
</div>

<!--<p>{$page.error.message}</p>-->

{#if dev && $page.error.stack}
	<pre>{$page.error.stack}</pre>
{/if}
