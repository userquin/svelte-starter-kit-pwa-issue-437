import adapter from '@sveltejs/adapter-auto';
import nodeAdapter from '@sveltejs/adapter-node';
import staticAdapter from '@sveltejs/adapter-static';
import preprocess from 'svelte-preprocess';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://github.com/sveltejs/svelte-preprocess
	// for more information about preprocessors
	preprocess: [
		preprocess({
			postcss: true
		})
	],

	kit: {
		adapter: getAdapter(),

		// When hosting SPA on GitHub Pages
		// paths: {
		// 	base: dev ? '' : '/svelte-starter-kit',
		// },

		// prerender: { entries: [] },
		alias: {
			$mocks: 'src/mocks',
			$houdini: './$houdini'
		}
	}
};

export default config;

function getAdapter() {
	switch (process.env.ADAPTER) {
		case 'node':
			return nodeAdapter({
				// envPrefix: 'CONFY_'
				// Can overwrite at runtime: `HOST=127.0.0.1 PORT=4000 ORIGIN=https://my.site node build`
				// default: HOST=0.0.0.0 PORT=3000
			});
		case 'static':
			return staticAdapter({
				fallback: 'index.html' // 404.html,
				// trailingSlash: 'always'
			});
		default:
			return adapter();
	}
}
