# Playbook

Show how this repo is setup via step-by-step guild

## Base

### Create

```shell
pnpm create svelte@latest svelte-starter-kit
# select `yes` for TypeScript, ESLint, Prettier, Playwright and Vitest
```

Next steps:

1. cd svelte-starter-kit
2. npm install (or pnpm install, etc)
3. git init && git add -A && git commit -m "chore(root): first commit" (optional)
4. npm run dev -- --open

In this Playbook, we will be using [svelte-add](https://github.com/svelte-add/svelte-add) to easily add and integrate 3rd party tools to this Svelte App.

### Testing

We will use [vitest](https://vitest.dev/) for Component (mocked) testing and
[Playwright](https://playwright.dev/) for E2E tests (nothing is mocked).  
Code coverage via [c8](https://github.com/bcoe/c8) or [istanbul](https://istanbul.js.org/).

[svelte-add-vitest](https://github.com/davipon/svelte-add-vitest) preset will add vitest to your SvelteKit project.

For examples checkout [Svelte Component Test Recipes](https://github.com/davipon/svelte-component-test-recipes)

```shell
# optional
pnpm i -O @vitest/ui -w
```

```shell
# install supported browsers
pnpx playwright install
```

### Styling

We will be using [TailwindCSS](https://tailwindcss.com/) for system-wide styling.  
Follow [SvelteKit integration](https://tailwindcss.com/docs/guides/sveltekit) guide

Add and configure tailwindcss via [svelte-add](https://github.com/svelte-add/tailwindcss)

```shell
pnpx svelte-add@latest tailwindcss  --typography --daisyui
# NOTE: tailwindcss's forms plugin and daisyui wont work together
# also add other tailwind plugins and include them in `tailwind.config.cjs`
pnpm add -D @tailwindcss/aspect-ratio @tailwindcss/line-clamp @tailwindcss/container-queries -w
```

Install JetBrain's [postcss](https://plugins.jetbrains.com/plugin/8578-postcss) plugin  
Rename any files in your repo, with file extension `postcss` to `pcss`

#### cssnano

Also add `cssnano` plugin for `postcss` and include it in [postcss.config.cjs](../postcss.config.cjs) for production env.

```shell
pnpm add -D cssnano -w
```

#### PostCSS Preset Env

[PostCSS Preset Env](https://github.com/csstools/postcss-plugins/tree/main/plugin-packs/postcss-preset-env) lets you convert modern CSS into something most browsers can understand,
determining the polyfills you need based on your targeted browsers or runtime environments.

Read: [Use Future CSS Today](https://joyofcode.xyz/using-future-css-in-svelte) and Watch: [video](https://www.youtube.com/watch?v=eqwtoaP-0pk)

```shell
pnpm add -D postcss-preset-env -w
```

Add `postcssPresetEnv` plugin for `postcss` and include it in [postcss.config.cjs](../postcss.config.cjs).

### UI Components

We will be using [Flowbite](https://flowbite.com/) its [Svelte UI Components](https://flowbite-svelte.com/)  
Follow **flowbite-svelte** [getting-started](https://flowbite-svelte.com/pages/getting-started) guild, install and configure `tailwind.config.cjs`

We will be using [heroicons](https://heroicons.com/) via [svelte-heros-v2](https://github.com/shinokada/svelte-heros-v2) Icon Components.

Use [clsx](https://github.com/lukeed/clsx) in place of [classnames](https://github.com/JedWatson/classnames) utility lib for constructing _className_ strings conditionally.

```shell
pnpm add -D flowbite flowbite-svelte
pnpm add -D svelte-heros-v2
pnpm add -D clsx
```

Other optional UI Components

- [DaisyUI](https://daisyui.com/)
- [headlessUI](https://captaincodeman.github.io/svelte-headlessui)
- [skeleton](https://www.skeleton.dev/)

I will be using both **flowbite** and **daisyui** for UI Components

```shell
pnpm add -D daisyui -w
```

Then add daisyUI to your **tailwind.config.js** files:

```js
const config = {
  //...
  plugins: [typography,  ..., daisyui]
}
```

#### skeleton

```shell
pnpm add -D @skeletonlabs/skeleton -w
```

And follow **skeleton** specific sveltekit [changes](https://www.skeleton.dev/guides/frameworks/sveltekit)

### UI Blocks

- [Kometa UI Kit](https://kitwind.io/products/kometa) (Free) [Blocks](https://kitwind.io/products/kometa/components)
- [Tailblocks](https://tailblocks.cc/) via [tailblocks github](https://github.com/mertJF/tailblocks)
- [Tailwind Components](https://tailwindcomponents.com/) (Free)
- Flowbite [Blocks](https://flowbite.com/blocks/) via [flowbite-svelte-blocks](https://github.com/shinokada/flowbite-svelte-blocks)
- [Konsta UI](https://konstaui.com/svelte) - is a free and open source mobile UI svelte components framework built with [Tailwind CSS](https://tailwindcss.com/).

### Tools

#### Prettier

Lets add [prettier-plugin-tailwindcss](https://github.com/tailwindlabs/prettier-plugin-tailwindcss)

`prettier-plugin-svelte` has conflict with `prettier-plugin-tailwindcss` which is included during _SvelteKit_ project creation.  
To work around this, `prettier-plugin-tailwindcss` **must** be loaded last, meaning Prettier auto-loading needs to be disabled. You can do this by setting the `pluginSearchDirs` option to `false` and then listing each of your Prettier plugins in the plugins array:

```shell
pnpm add -D prettier-plugin-tailwindcss -w
```

```shell
// .prettierrc
{
  // ..
  "plugins": [
    "prettier-plugin-svelte",
    "prettier-plugin-organize-imports",
    "prettier-plugin-tailwindcss" // MUST come last
  ],
  "pluginSearchDirs": false
}
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
pnpm add -D svelte-headless-table -w
#pnpm add -D @tanstack/svelte-table -w
# form library for Svelte
pnpm add -D felte @felte/reporter-svelte @felte/validator-zod zod -w
# make any element draggable
pnpm add -D @neodrag/svelte -w
# to fetch, cache and update data
pnpm add -D @tanstack/svelte-query -w
```

### Optional

#### Markdown CMS

```shell
pnpx svelte-add@latest mdsvex -w
```

#### Time Distance

[svelte-time-distance](https://github.com/joshnuss/svelte-time-distance) Display time distances in a human readable format.

```shell
pnpm add -D svelte-time-distance date-fns -w
```

#### Error Tracking

Sentry helps track errors in code.

```shell
pnpm add -D @sentry/svelte @sentry/tracing -w
```

#### GraphQL

**VS Code:** install `GraphQL.vscode-graphql` VS Code plugin

use [houdini](https://www.houdinigraphql.com/) as GraphQL Client. [example](https://github.com/hygraph/hygraph-examples/tree/master/with-houdini)

```shell
pnpm add -D houdini -w

# pnpx houdini init
pnpx houdini init --headers "x-hasura-admin-secret"="<HASURA_GRAPHQL_ADMIN_SECRET>"

# If you have updated your schema on the server, you can pull down the most recent schema
pnpx houdini generate --pull-schema
```

(Or) Apollo Client. [example](https://github.com/rodneylab/sveltekit-graphql-github)

```shell
npm i -D @apollo/client graphql graphql-tag
```

(Or) [URQL](https://formidable.com/open-source/urql/docs/basics/svelte/). [example](https://github.com/hygraph/hygraph-examples/tree/master/with-sveltekit-and-urql)

```shell
pnpm add -D @urql/svelte graphql -w
# TypeScript integration (optional)
# https://formidable.com/open-source/urql/docs/basics/typescript-integration/
pnpm add -D @graphql-codegen/cli @graphql-codegen/client-preset -w
```

#### OpenID Connect

Use [Auth.js](https://authjs.dev/) for Authentication

```shell
pnpm add @auth/core @auth/sveltekit
```

#### Cookies

Set/Get/Remove cookies in browser (for server-side svelte already provide utils)

```shell
pnpm add -D js-cookie -w
```

#### Forms

Custom form elements

```shell
pnpm add -D svelecte -w
```

#### Progressive Web Apps (PWA)

```shell
pnpm add -D  @vite-pwa/sveltekit vite-plugin-pwa workbox-window
```
