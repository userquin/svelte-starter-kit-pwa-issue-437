# Svelte Starter Kit

Everything you need to build a Svelte project, powered
by [`create-svelte`](https://github.com/sveltejs/kit/tree/master/packages/create-svelte).

## Tech Stack

-   JS Framework [SvelteKit](https://kit.svelte.dev/)
-   CSS: [Tailwind CSS](https://tailwindcss.com/)
-   Design System: [Flowbite](https://flowbite.com/)
-   UI Components: [flowbite-svelte](https://flowbite-svelte.com/)
-   Unit/Component testing: [vitest](https://vitest.dev/)
-   [Testing Library](https://testing-library.com/)
-   [Svelte Testing Library](https://github.com/testing-library/svelte-testing-library)
-   [Playwright Testing Library](https://github.com/testing-library/playwright-testing-library)
-   API mocking: [Mock Service Worker](https://mswjs.io/)
-   Code Coverage [c8](https://c8.io/)
-   End-to-End Testing: [playwright](https://playwright.dev/)

## Features

-   [ ] Code Splitting
-   [ ] Pages prefetching
-   [ ] Lazy-loading images
-   [x] Responsive design
-   [ ] SEO optimization
-   [x] forms: schema definitions with `yup`. form validation with `svelte-forms-lib`
-   [x] design-system: tailwindcss, `flowbite`
-   [x] K8s deployment with _letsencrypt_ ssl certificates
-   [ ] [svelte-headless-table](https://svelte-headless-table.bryanmylee.com/docs/getting-started/overview#what-is-a-headless-ui-library)
-   [ ] [felte forms](https://felte.dev/)

## Setup

```shell
cd ~/Developer/Work/SPA
git clone https://github.com/xmlking/svelte-starter-kit.git
cd /svelte-starter-kit && npm install
# playwright is required for end-to-end testing
npx playwright install
```

### Environment Variables

By default, the `dev` server (dev command) runs in `development` mode and the `build` command run in `production`
mode.<br/>
This means when running `npm build`, it will load the env variables from `.env.production` if there is one:<br/>
Use `.env.local` to override environment variables in `.env` (like API keys) for local development.

````shell
## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```shell
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open

# run in debug mode
NODE_ENV=DEBUG npm run dev

# run with a custom inline config
# inline environment variables has higher precedence than ones loaded from .env and .env.local files
CONFY_API_ENDPOINT=api.mycompany.com:443 npm run dev
````

## Maintenance

### Update

To update the packages to their latest versions in `package.json`

```shell
ncu -u
npm i
```

## Testing

### Unit/Component Tests

```shell
npm run test

npm run test:ui
#Then, you can visit the Vitest UI at http://localhost:51204/__vitest__/.

# test coverage
npm run test:coverage

# updating Snapshots
vitest -u
```

### E2E Tests

```shell
npm run test:e2e
```

## Building

To create a production version of your app:

```shell
npm run build
# build for hybrid rendering on nodejs runtime
npm run build:node
# build for static rendering on nginx runtime
npm run build:static
# run build
node build
```

Run from the local build directory:

```shell
NODE_ENV=production \
CONFY_API_ENDPOINT=api.mycompany.com:443 \
node build

# (optional) pass ORIGIN when using `adapter-node` build
HOST=127.0.0.1 \
PORT=4000 \
ORIGIN=https://my.site \
node build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://kit.svelte.dev/docs/adapters) for your target
> environment.

## Release

after checking-in all your changes, bump the VERSION and build the docker image.

```shell
# dry-run
cog bump --auto --dry-run
# this will bump version in package.json and create git tag and commit.
cog bump --auto
```
