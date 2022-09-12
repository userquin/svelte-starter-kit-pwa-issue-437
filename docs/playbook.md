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

#### Design System

we will be using [Flowbite](https://flowbite.com/) as _Design System_ and its [Svelte UI Components](https://flowbite-svelte.com/)

Follow **flowbite-svelte** [getting-started](https://flowbite-svelte.com/pages/getting-started) guild, install and configure `tailwind.config.cjs`

```shell
npm i -D flowbite flowbite-svelte @floating-ui/dom classnames @popperjs/core
```

### Docker

Added [Dockerfile](../Dockerfile) and GitHub [actions](../.github/workflows).

## Addons

### Recommended

```shell

```

### Optional

```shell
npx svelte-add@latest mdsvex
```
