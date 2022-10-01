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
[Playwright](https://playwright.dev/) for E2E tests (nothing is mocked).<br/>
Code coverage via [c8](https://github.com/bcoe/c8) or [istanbul](https://istanbul.js.org/).

[svelte-add-vitest](https://github.com/davipon/svelte-add-vitest) preset will add vitest to your SvelteKit project.

```shell
# lets run preset to automate vitest setup for sveltekit
npx @preset/cli davipon/svelte-add-vitest --ts --msw --example
npx playwright install
```

#### [playwright-testing-library](https://github.com/testing-library/playwright-testing-library)

Find elements in **playwright** like your users with queries from **@testing-library/dom**

```shell
# For use with Playwright
npm i -D playwright-testing-library

# For use with Playwright Test
npm i -D @playwright-testing-library/test
```

### Styling

We will be using [TailwindCSS](https://tailwindcss.com/) for system-wide styling.<br/>
Follow [SvelteJit integration](https://tailwindcss.com/docs/guides/sveltekit) guide

Add and configure tailwindcss via [svelte-add](https://github.com/svelte-add/tailwindcss)

```shell
npx svelte-add@latest tailwindcss --forms --typography
# also add other tailwind plugins and include them in `tailwind.config.cjs`
npm i -D @tailwindcss/aspect-ratio @tailwindcss/line-clamp
```

Install JetBrain's [postcss](https://plugins.jetbrains.com/plugin/8578-postcss) plugin<br/>
Rename any files in your repo, with file extension `postcss` to `pcss`

Also add `cssnano` plugin for `postcss` and include it in [postcss.config.cjs](../postcss.config.cjs) for production env.

```shell
npm i -D cssnano
```

### UI Components

we will be using [Flowbite](https://flowbite.com/) as _Design System_ and its [Svelte UI Components](https://flowbite-svelte.com/)

Follow **flowbite-svelte** [getting-started](https://flowbite-svelte.com/pages/getting-started) guild, install and configure `tailwind.config.cjs`

We will be using [heroicons](https://heroicons.com/) via [svelte-heros-v2](https://github.com/shinokada/svelte-heros-v2) Icon Components.

```shell
npm i -D flowbite flowbite-svelte @floating-ui/dom classnames @popperjs/core
npm i -D svelte-heros-v2
```

Other optional UI Components

-   [daisyui](https://daisyui.com/)
-   [headlessUI](https://github.com/rgossiaux/svelte-headlessui)

### UI Blocks

-   [Kometa UI Kit](https://kitwind.io/products/kometa) (Free) [Blocks](https://kitwind.io/products/kometa/components)
-   [Tailblocks](https://tailblocks.cc/) via [tailblocks github](https://github.com/mertJF/tailblocks)
-   [Tailwind Components](https://tailwindcomponents.com/) (Free)
-   Flowbite [Blocks](https://flowbite.com/blocks/) via [flowbite-svelte-blocks](https://github.com/shinokada/flowbite-svelte-blocks)

### Tools

#### Prettier

Lets add [prettier-plugin-tailwindcss](https://github.com/tailwindlabs/prettier-plugin-tailwindcss)

`prettier-plugin-svelte` has conflict with `prettier-plugin-tailwindcss` which is included during _SvelteKit_ project creation.<br/>
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

```shell
npx svelte-add@latest mdsvex
```
