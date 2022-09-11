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

### Testing

We will use [vitest](https://vitest.dev/) for Component (mocked) testing.<br/>
E2E tests (nothing is mocked) with [Playwright](https://playwright.dev/) <br/>
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
npm i -D @playwright-testing-library/test --ts --msw
#npx @preset/cli davipon/svelte-add-vitest --ts --msw --example
```

### Docker

Added Dockerfile and GitHub actions.

## Addons

```shell

```
