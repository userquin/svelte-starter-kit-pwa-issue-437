# Hasura

## hasura-cli

### Install

```shell
npm install --global hasura-cli
# (OR)
go install github.com/hasura/graphql-engine/cli/cmd/hasura@latest
```

### Usage

```shell
# Create a directory to store migrations (with endpoint and admin secret configured):
# hasura init <my-project> --endpoint https://my-graphql-engine.com --admin-secret adminsecretkey
hasura init hasura --project infra --endpoint https://decent-donkey-83.hasura.app --admin-secret <my-admin-secret>

hasura version  --project=infra/hasura

## open console
hasura console --project=infra/hasura

# Export metadata and save it in migrations/metadata.yaml file:
hasura metadata export --project=infra/hasura

# Show changes between server metadata and the exported metadata file:
hasura metadata diff  --project=infra/hasura
# Reload all the metadata information from database:
hasura metadata reload  --project=infra/hasura
# Apply Hasura Metadata
hasura metadata apply --project=infra/hasura

# Create a new seed by exporting data from tables already present in the database:
hasura seed create tz_policies_seed --database-name threat-zero --from-table tz_policies --project=infra/hasura
# Export data from multiple tables:
hasura seed create customer_order_seed --database-name threat-zero --from-table customer --from-table order  --project=infra/hasura
# Apply only a particular file:
hasura seed apply --project=infra/hasura --file 1670797452175_customer_order_seed.sql --database-name threat-zero

# To apply all the Migrations present in the `migrations/` directory and the Metadata present in the `metadata/` directory on a new, "fresh",
# instance of the Hasura Server at http://another-server-instance.hasura.app:
hasura deploy --endpoint http://another-server-instance.hasura.app  --project=infra/hasura
#  Check the status of Migrations
hasura migrate status --project=infra/hasura  --database-name threat-zero
```

Sample Query:

```graphql
query MyQuery {
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
```

## Reference

- Sample metadata <https://github.com/hasura/template-gallery/tree/main/postgres>-
