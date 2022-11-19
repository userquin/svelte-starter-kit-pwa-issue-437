// since there's no dynamic data for marketing site, we can prerender
// it so that it gets served as a static asset in prod
// FIXME: `$env/dynamic/public` not working with `prerender = true`
// https://github.com/sveltejs/kit/discussions/7700
export const prerender = true;
