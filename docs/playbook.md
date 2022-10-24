# Playbook

Show how this repo is setup via step-by-step guild

## Base

### Create

```shell
npm create svelte@latest svelte-starter-kit
cd svelte-starter-kit
npm install
cd it init && git add -A
git commit -m "chore(root): first commit"
npm run dev -- --open
```

In this Playbook, we will be using [svelte-add](https://github.com/svelte-add/svelte-add) to easily add and integrate 3rd party tools to this Svelte App.

### Testing

We will use [vitest](https://vitest.dev/) for Component (mocked) testing and
[Playwright](https://playwright.dev/) for E2E tests (nothing is mocked).  
Code coverage via [c8](https://github.com/bcoe/c8) or [istanbul](https://istanbul.js.org/).

[svelte-add-vitest](https://github.com/davipon/svelte-add-vitest) preset will add vitest to your SvelteKit project.

```shell
# lets run preset to automate vitest setup for sveltekit
npx @preset/cli davipon/svelte-add-vitest --ts --msw --example
# optional
npm i -O @vitest/ui
```

```shell
# install supported browsers
npx playwright install
```

### Styling

We will be using [TailwindCSS](https://tailwindcss.com/) for system-wide styling.  
Follow [SvelteJit integration](https://tailwindcss.com/docs/guides/sveltekit) guide

Add and configure tailwindcss via [svelte-add](https://github.com/svelte-add/tailwindcss)

```shell
npx svelte-add@latest tailwindcss --forms --typography
# also add other tailwind plugins and include them in `tailwind.config.cjs`
npm i -D @tailwindcss/aspect-ratio @tailwindcss/line-clamp
```

Install JetBrain's [postcss](https://plugins.jetbrains.com/plugin/8578-postcss) plugin  
Rename any files in your repo, with file extension `postcss` to `pcss`

#### cssnano

Also add `cssnano` plugin for `postcss` and include it in [postcss.config.cjs](../postcss.config.cjs) for production env.

```shell
npm i -D cssnano
```

#### PostCSS Preset Env

[PostCSS Preset Env](https://github.com/csstools/postcss-plugins/tree/main/plugin-packs/postcss-preset-env) lets you convert modern CSS into something most browsers can understand,
determining the polyfills you need based on your targeted browsers or runtime environments.

Read: [Use Future CSS Today](https://joyofcode.xyz/using-future-css-in-svelte) and Watch: [video](https://www.youtube.com/watch?v=eqwtoaP-0pk)

```shell
npm i -D postcss-preset-env postcss-load-config @types/postcss-preset-env
```

Add `postcssPresetEnv` plugin for `postcss` and include it in [postcss.config.cjs](../postcss.config.cjs).

### UI Components

we will be using [Flowbite](https://flowbite.com/) as _Design System_ and its [Svelte UI Components](https://flowbite-svelte.com/)

Follow **flowbite-svelte** [getting-started](https://flowbite-svelte.com/pages/getting-started) guild, install and configure `tailwind.config.cjs`

We will be using [heroicons](https://heroicons.com/) via [svelte-heros-v2](https://github.com/shinokada/svelte-heros-v2) Icon Components.

```shell
npm i -D flowbite flowbite-svelte @floating-ui/dom classnames @popperjs/core
npm i -D svelte-heros-v2
```

Other optional UI Components

- [daisyui](https://daisyui.com/)
- [headlessUI](https://github.com/rgossiaux/svelte-headlessui)

### UI Blocks

- [Kometa UI Kit](https://kitwind.io/products/kometa) (Free) [Blocks](https://kitwind.io/products/kometa/components)
- [Tailblocks](https://tailblocks.cc/) via [tailblocks github](https://github.com/mertJF/tailblocks)
- [Tailwind Components](https://tailwindcomponents.com/) (Free)
- Flowbite [Blocks](https://flowbite.com/blocks/) via [flowbite-svelte-blocks](https://github.com/shinokada/flowbite-svelte-blocks)

### Tools

#### Prettier

Lets add [prettier-plugin-tailwindcss](https://github.com/tailwindlabs/prettier-plugin-tailwindcss)

`prettier-plugin-svelte` has conflict with `prettier-plugin-tailwindcss` which is included during _SvelteKit_ project creation.  
To work around this, we've bundled `prettier-plugin-svelte` directly into `prettier-plugin-tailwindcss`, so if you'd like to use this plugin with Svelte, just uninstall `prettier-plugin-svelte` and everything should work as expected.

```shell
npm uninstall -D prettier-plugin-svelte
npm i -D prettier-plugin-tailwindcss
```

#### Docker

Added [Dockerfile](../Dockerfile) and GitHub [actions](../.github/workflows).

## Addons

### Recommended

1. Headless Table
   1. [Svelte Headless Table](https://svelte-headless-table.bryanmylee.com/#headless)
   2. [TanStack Table](https://tanstack.com/table/v8)
2. [Felte](https://felte.dev/) - An extensible form library for Svelte
3. [A lightweight Svelte Action to make your elements draggable](https://github.com/PuruVJ/neodrag/tree/main/packages/svelte#readme)
4. Fetch, cache and update asynchronous data in your Svelte applications [TanStack Query](https://tanstack.com/query/v4)

```shell
# table library for Svelte
npm i -D svelte-headless-table
#npm i -D @tanstack/svelte-table
# form library for Svelte
npm i -D felte @felte/reporter-svelte @felte/validator-zod zod
# make any element draggable
npm i -D @neodrag/svelte
# to fetch, cache and update data
npm i -D @tanstack/svelte-query
```

### Optional

#### Markdown CMS

```shell
npx svelte-add@latest mdsvex
```

#### Time Distance

[svelte-time-distance](https://github.com/joshnuss/svelte-time-distance) Display time distances in a human readable format.

```shell
npm i -D svelte-time-distance
```

#### Error Tracking

Sentry helps track errors in code.

```shell
npm i -D @sentry/svelte @sentry/tracing
```

#### GraphQL

**VS Code:** install `GraphQL.vscode-graphql` VS Code plugin

use [houdini](https://www.houdinigraphql.com/) as GraphQL Client. [example](https://github.com/hygraph/hygraph-examples/tree/master/with-houdini)

```shell
npm i -D houdini

# npx houdini init
npx houdini init -ph "x-hasura-admin-secret"="<hasura-secret>"
```

(Or) [KitQL](https://www.kitql.dev/)as GraphQL stackm which includes `houdini` as GraphQL Client. See [How To](https://scottspence.com/posts/getting-started-with-kitql-and-graphcms)

```shell
npm i -D @kitql/all-in
# npm i -D houdini
# npm i -D graphql

# npx houdini init
npx houdini init -ph "x-hasura-admin-secret"="<hasura-secret>"
```

(Or) Apollo Client. [example](https://github.com/rodneylab/sveltekit-graphql-github)

```shell
npm i -D @apollo/client graphql graphql-tag
```

(Or) [URQL](https://formidable.com/open-source/urql/docs/basics/svelte/). [example](https://github.com/hygraph/hygraph-examples/tree/master/with-sveltekit-and-urql)

```shell
npm i -D @urql/svelte graphql
# TypeScript integration (optional)
# https://formidable.com/open-source/urql/docs/basics/typescript-integration/
npm install -D @graphql-codegen/cli @graphql-codegen/client-preset
```
