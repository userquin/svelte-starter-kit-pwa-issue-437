# Hasura

GraphQL APIs with Hasura

![Hasura GraphQL Engine architecture](https://raw.githubusercontent.com/hasura/graphql-engine/master/assets/hasura-arch.svg)

## hasura-cli

### Install

```shell
pnpm add -g hasura-cli
# (OR)
go install github.com/hasura/graphql-engine/cli/cmd/hasura@latest
```

### Usage

```shell
# Create a directory to store migrations (with endpoint and admin secret configured):
# hasura init <my-project> --endpoint https://my-graphql-engine.com --admin-secret adminsecretkey
hasura init hasura --project infra --endpoint https://decent-donkey-83.hasura.app --admin-secret <my-admin-secret>
# move infra/hasura/config.yaml to project root and edit metadata_directory, migrations_directory, seeds_directory paths

hasura version

## open console
hasura console

# Export metadata and save it in migrations/metadata.yaml file:
hasura metadata export

# Show changes between server metadata and the exported metadata file:
hasura metadata diff
# Reload all the metadata information from database:
hasura metadata reload
# Apply Hasura Metadata
hasura metadata apply

# Create a new seed by exporting data from tables already present in the database:
hasura seed create tz_policies_seed --database-name postgresdb --from-table tz_policies
# Export data from multiple tables:
hasura seed create customer_order_seed --database-name postgresdb --from-table customer --from-table order
# Apply only a particular file:
hasura seed apply --file 1670797452175_customer_order_seed.sql --database-name postgresdb

# To apply all the Migrations present in the `migrations/` directory and the Metadata present in the `metadata/` directory on a new, "fresh",
# instance of the Hasura Server at http://another-server-instance.hasura.app:
hasura deploy --endpoint http://another-server-instance.hasura.app  --admin-secret <admin-secret>
# NOTE:
# if you get error: "permission denied to create extension \"hstore\"", Run `create extension hstore;` in hasura console
# if you get error: "must be owner of extension hstore",  Run `alter role nhost_hasura with superuser;` in hasura console

#  Check the status of Migrations
hasura migrate status   --database-name postgresdb
```

## Local Hasura

### Start local Hasura

```shell
docker compose up hasura
# shutdown
docker compose down
# shutdown , reset volume
docker compose down -v
```

### Apply Migrations

To apply all the Migrations present in the `migrations/` directory and the Metadata present in the `metadata/` directory on a new, "fresh" database (i.e., docker compose down -v):

```shell
hasura deploy --endpoint <http://localhost:8080>  --admin-secret myadminsecretkey
```

open <http://localhost:8080/console> and try out a query

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
- Hasura and AuthJS [intigration](https://hasura.io/learn/graphql/hasura-authentication/integrations/nextjs-auth/)
