<script lang="ts">
	import { dev } from '$app/environment';
	import { page } from '$app/stores';
</script>

<svelte:head>
	<title>Error: {$page.status} : {$page.error.message}</title>
</svelte:head>

<div class="min-h-full pt-16 pb-12 flex flex-col bg-white">
	<main class="flex-grow flex flex-col justify-center max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
		<div class="flex-shrink-0 flex justify-center">
			<a href="/" class="inline-flex">
				<span class="sr-only">TrustZero</span>
				<img class="h-12 w-auto" src="https://tailwindui.com/img/logos/workflow-mark.svg?color=teal&shade=600" alt="" />
			</a>
		</div>
		<div class="py-16">
			<div class="text-center">
				<p class="text-sm font-semibold text-teal-600 uppercase tracking-wide"> {$page.status} error </p>
				<h1 class="mt-2 text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl"> Something's wrong here. </h1>
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
