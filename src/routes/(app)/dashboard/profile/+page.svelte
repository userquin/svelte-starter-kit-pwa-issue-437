<script lang="ts">
	import { auth } from '$lib/stores/auth.store';
</script>

<svelte:head>
	<title>Dashboard/Profile</title>
	<meta name="description" content="Dashboard Profile" />
</svelte:head>

<h2 class="pb-4 text-2xl font-bold text-gray-800 dark:text-white ">Profile</h2>
<div class="relative overflow-x-auto">
	<!-- <Avatar src="{user?.picture}" /> -->
	<table class="w-full text-left text-sm text-gray-500 dark:text-gray-400">
		<tbody>
			{#each Object.entries($auth.profile ?? {}) as [key, value]}
				<tr class="border-b bg-white dark:border-gray-800 dark:bg-gray-900">
					<th scope="row" class="whitespace-nowrap py-2 px-4 font-medium text-gray-900 dark:text-white">
						{key}
					</th>
					<td class="py-2 px-6">
						{value}
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>

<!-- <div>
	<pre>{JSON.stringify($auth.profile, null, 4)}</pre>
</div> -->
