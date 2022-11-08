<script lang="ts">
		import { enhance } from '$app/forms';
		import { ArchiveBox } from 'svelte-heros-v2';

	export let id: string;
</script>

<form method="POST" action="?/delete" use:enhance>
	<input type="hidden" name="id" hidden value={id} />
	<button type="submit">
		<ArchiveBox class="text-pink-700 dark:text-blue-300" />
	</button>
</form>
