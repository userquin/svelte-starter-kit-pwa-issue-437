// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
// and what to do when importing types
declare namespace App {
	interface Locals {
		userid: string;
	}

	// interface PageData {}
	// interface PageError {}
	// interface Platform {}
	// interface PrivateEnv {}
	// interface PublicEnv {}
	// interface Session {}
}

// check https://vitejs.dev/guide/env-and-mode.html#env-files
interface ImportMetaEnv {
	readonly CONFY_ENGINE_ENDPOINT: string;
	readonly CONFY_PAYMENT_ENDPOINT: string;
	readonly VITE_API_BASE_URL: string;
	readonly VITE_GTAG_ID: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}

interface Window {
	dataLayer: IArguments[];
	gtag(type: string, ...args: any[]): void;
}
