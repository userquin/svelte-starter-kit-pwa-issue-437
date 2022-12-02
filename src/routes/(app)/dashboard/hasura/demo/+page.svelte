<script>
	import { graphql } from '$houdini';

	const allOrders = graphql`
		query allOrders {
			customer {
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
	`;
</script>

<span>isFetching: {$allOrders.isFetching}</span>
{#each $allOrders.data.customer as customer}
	<div>{JSON.stringify(customer, null, 2)}</div>
{/each}
