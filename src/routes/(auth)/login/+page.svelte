<script lang="ts">
	import { login } from '$lib/stores/auth.store';
	import { Spinner } from 'flowbite-svelte';
	import { onMount } from 'svelte';

	onMount(() => {
		login();
	});
</script>

<div class="flex h-[calc(100vh-200px)] items-center justify-center">
	<Spinner color="blue" size="20" />
</div>
<!-- <div class="flex h-[calc(100vh-200px)] items-center justify-center">
	<div class="btn-group">
		<button class="btn-secondary btn" on:click="{() => login('google')}">Google</button>
		<button class="btn-accent btn" on:click="{() => login('azure')}">Azure</button>
		<button class="btn-primary btn" on:click="{() => login('github')}">GitHub</button>
		<button class="btn-warning btn" on:click="{() => login('apple')}">Apple</button>
	</div>
</div> -->
