<script lang="ts">
	import { Listgroup } from 'flowbite-svelte';
	let links = [
		{ name: 'Draggable', href: '/play/draggable', current: true },
		{ name: 'Resizeable', href: '/play/draggable' },
		{ name: 'Grid1', href: '/play/grid1' },
		{ name: 'Grid2', href: '/play/grid2' },
		{ name: 'Grid3', href: '/play/grid3' },
		{ name: 'Movies', href: '/play/movies' }
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
