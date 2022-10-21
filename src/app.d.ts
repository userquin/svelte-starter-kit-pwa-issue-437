// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
// and what to do when importing types
declare namespace App {
	type User = import('./lib/models/types/user').User;
	interface Locals {
		user: User;
	}
	// interface PageData {}
	interface Error {
		message: string; // this property is always required, to provide a sensible fallback
		code: number;
		context?: Record<string, any>;
	}
	// interface Platform {}
	// interface Session {}
}

// check https://vitejs.dev/guide/env-and-mode.html#env-files
interface ImportMetaEnv {
	readonly CONFY_API_ENDPOINT: string;
	readonly CONFY_PAYMENT_ENDPOINT: string;
	readonly CONFY_API_TOKEN: string;
	readonly VITE_API_BASE_URL: string;
	readonly VITE_GTAG_ID: string;
	readonly PUBLIC_GITHUB_API_URL: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}

interface Window {
	dataLayer: IArguments[];
	gtag(type: string, ...args: any[]): void;
}

// App version from package.json
declare const __APP_VERSION__: string;
// Git commit tag or hash
declare const __GIT_TAG__: string;
// Date of last commit
declare const __GIT_DATE__: string;
