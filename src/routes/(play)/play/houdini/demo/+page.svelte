<script lang="ts">
	import { CachePolicy, graphql } from '$houdini';

	const allOrders = graphql(`
		query allOrders($limit: Int = 10) {
			customer(limit: $limit) @paginate {
				email
				first_name
				id
				ip_address
				last_name
				phone
				username
				orders {
					customer_id
					discount_price
					id
					order_date
					product
					purchase_price
					transaction_id
				}
			}
		}
	`);

	$: console.log('$allOrders.data on load:', $allOrders.data);
</script>

<button class="btn" on:click={() => allOrders.loadNextPage()}>load more</button>
<button class="btn-accent btn" on:click={() => allOrders.fetch({ policy: CachePolicy.NetworkOnly })}>refetch</button>
<br />
<span>isFetching: {$allOrders.isFetching}</span>
{#each $allOrders.data.customer as customer}
	<p> Customer: {customer.first_name} {customer.last_name} <span>Order Count: {customer.orders.length}</span></p>
	<!-- <pre>{JSON.stringify(customer, null, 2)}</pre> -->
{/each}
