# GraphQL

GraphQL APIs with Hasura

![Hasura GraphQL Engine architecture](https://raw.githubusercontent.com/hasura/graphql-engine/master/assets/hasura-arch.svg)

## Start

```shell
docker compose up hasura
# shutdown
docker compose down
# shutdown , reset volume
docker compose down -v
```

### Connect a database

Head to <http://localhost:8080/console> to open the Hasura console.

Navigate to `Data -> Manage -> Connect Database`:

Connect to database with `postgresql://postgres:postgres@postgres:5432/postgres?sslmode=allow` url

### Try out Hasura

On the Hasura console, navigate to `Data -> Create table` and create a sample table called `accounts` with the following columns:

```sql
accounts (
  id SERIAL PRIMARY KEY, -- serial -> auto-incrementing integer
  name TEXT
)
```

### Try out a query

```gql
query {
	profiles {
		id
		name
	}
}
```

## Refernce

- <https://hasura.io/docs/latest/getting-started/docker-simple/>
