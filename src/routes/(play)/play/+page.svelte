<script lang="ts">
	import { Listgroup } from 'flowbite-svelte';
	let links = [
		{ name: 'Draggable', href: '/play/draggable', current: true },
		{ name: 'Resizeable', href: '/play/draggable' },
		{ name: 'Next1', href: '/play/draggable' },
		{ name: 'Next2', href: '/play/draggable' }
	];
</script>

<svelte:head>
	<title>Play</title>
	<meta name="description" content="Play Area" />
</svelte:head>

<h2 class="pb-2 text-2xl">Demos</h2>

<Listgroup active items="{links}" let:item class="w-48">
	{item.name}
</Listgroup>
