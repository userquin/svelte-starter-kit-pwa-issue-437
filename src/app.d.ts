// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
// and what to do when importing types
import { DefaultSession } from '@auth/core/types';
declare namespace App {
	interface Error {
		message: string; // this property is always required, to provide a sensible fallback
		context?: Record<string, any>;
	}
	interface Locals {
		session: UserSession;
		getSession(): Promise<UserSession | null>;
		// getSession(): Promise<import('@auth/core/types').DefaultSession | null>;
	}
	// interface PageData {}
	// interface Platform {}
}

interface Window {
	dataLayer: IArguments[];
	gtag(type: string, ...args: any[]): void;
}

interface UserSession extends DefaultSession {
	token: string;
	rules: string[];
}

// App version from package.json
declare const __APP_VERSION__: string;
// Git commit tag or hash
declare const __GIT_TAG__: string;
// Date of last commit
declare const __GIT_DATE__: string;
