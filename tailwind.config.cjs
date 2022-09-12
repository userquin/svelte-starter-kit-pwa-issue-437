const typography = require('@tailwindcss/typography');
const forms = require('@tailwindcss/forms');
const lineClamp = require('@tailwindcss/line-clamp');
const aspectRatio = require('@tailwindcss/aspect-ratio');
const flowbite = require('flowbite/plugin');
// const tailwindUI = require('@tailwindcss/ui');

/** @type {import('tailwindcss').Config} */
const config = {
	darkMode: 'class', // or 'media' or false

	content: ['./src/**/*.{html,js,svelte,ts}', './node_modules/flowbite-svelte/**/*.{html,js,svelte,ts}'],

	theme: {
		extend: {
			// https://tailwindui.com/documentation
			// fontFamily: {
			//  sans: ['Inter var', ...defaultTheme.fontFamily.sans],
			// },
			// custom shades generator https://javisperez.github.io/tailwindcolorshades/?
			colors: {
				optred: {
					50: '#fbf3f4',
					100: '#f7e8e8',
					200: '#ecc5c6',
					300: '#e0a2a4',
					400: '#c85d60',
					500: '#b1171c',
					600: '#9f1519',
					700: '#851115',
					800: '#6a0e11',
					900: '#570b0e'
				}
			}
		}
	},

	plugins: [forms, typography, aspectRatio, lineClamp, flowbite]
};

module.exports = config;
