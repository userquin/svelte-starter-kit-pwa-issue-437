<script lang="ts">
	import { addToast, ToastLevel } from '$lib/components/toast';
	import { Button } from 'flowbite-svelte';
</script>

<svelte:head>
	<title>Dashboard/Settings</title>
	<meta name="description" content="Dashboard Settings" />
</svelte:head>

<h2>Settings</h2>
<Button on:click="{() => addToast({ message: 'Hello, World!', dismissible: false, timeout: 6000, type: ToastLevel.Error })}">Error</Button>
<Button on:click="{() => addToast({ message: 'Hello, World!', dismissible: true, timeout: 6000, type: ToastLevel.Warning })}">Warning</Button>
<Button on:click="{() => addToast({ message: 'Hello, World!', dismissible: false, timeout: 6000, type: ToastLevel.Success })}">Success</Button>
<Button on:click="{() => addToast({ message: 'Hello, World!', dismissible: true, timeout: 6000, type: ToastLevel.Info })}">Info</Button>
