# SvelteKit

Awesome **SvelteKit** Links

## Components

- Force Graph examples with D3

  - <https://svelte.dev/repl/c23b43904005457981e78ca5042f7dd4?version=3.29.7>
  - <https://github.com/happybeing/d3-fdg-svelte>
  - <https://github.com/jlefebure/redisgraph-navi/tree/master/src/client>

- three.js

  - [Threlte](https://threlte.xyz/) is a component library for Svelte to build and render `three.js` scenes declaratively and state-driven in Svelte apps.

- Grid
  - [svelte-image-gallery](https://github.com/berkinakkaya/svelte-image-gallery)

## Animation

- [Svelte Star Wars Demo](https://github.com/geoffrich/star-wars-demo-svelte)

## State Management

- [svelte-store-array](https://github.com/accuser/svelte-store-array) A collection of higher-order store functions for
  array-based stores.

## Utilities

- [Time Distance](https://github.com/joshnuss/svelte-time-distance) - Display time distances in a human-readable format.

## Testing

- [Svelte Component Test Recipes](https://github.com/davipon/svelte-component-test-recipes)
  - Svelte component test recipes using Vitest & Testing Library with TypeScript
- [Test Svelte Component Using Vitest & Playwright](https://davipon.hashnode.dev/test-svelte-component-using-vitest-playwright)

## Templates

- [Svelte Sirens](https://github.com/Svelte-Sirens/svelte-sirens)

## Performance

## APIs

- Database access with [PrismaClient](https://github.com/joshnuss/sky-cart/blob/main/src/lib/services/db.js) example

## Tools

- [prettier-plugin-tailwindcss](https://github.com/tailwindlabs/prettier-plugin-tailwindcss)
  - A [Prettier](https://prettier.io/) plugin for Tailwind CSS v3.0+ that automatically sorts classes based
    on [our recommended class order](https://tailwindcss.com/blog/automatic-class-sorting-with-prettier#how-classes-are-sorted)

## FQA

- External Links

tell SvelteKit not to handle a link, but allow the browser to handle it

```html
<a rel="external" href="path">Path</a>
```

By default, the **SvelteKit** runtime intercepts clicks on `<a>` elements and bypasses the normal browser navigation
for relative (same-origin) URLs that match one of your page routes.  
 SvelteKit doc Adding a `rel=external` attribute to a link will trigger a browser navigation when the link is clicked.

- Felte - ignore a specific form firled

add `data-felte-ignore` attrubute

- How to fix `Cross-site POST form submissions are forbidden` aks CSRF

Add ORIGIN Env Varaible i.e., `ORIGIN=http://localhost:3000 node build/index.js`

- How to make SvelteKit WebApp as PWA
  - **Option 1:** add `src/service-worker.js` as documented in SvelteKit [Docs](https://kit.svelte.dev/docs/service-workers)
  - **Option 2:** If you need a more full-flegded but also more opinionated solution, we recommend looking at solutions like [Vite PWA plugin](https://vite-pwa-org.netlify.app/frameworks/sveltekit.html), which uses [Workbox](https://web.dev/learn/pwa/workbox).

## Community

- [svelteradio](https://www.svelteradio.com/)
- [sveltesociety](https://sveltesociety.dev/)

## Reference

- <https://github.com/rocketlaunchr/awesome-svelte>
- Huntabyte [YouTube](https://www.youtube.com/c/Huntabyte>) tutorials
- <https://github.com/janosh/awesome-sveltekit>
