import { writable } from 'svelte/store';

export const toasts = writable<ToastModel[]>([]);

export const dismissToast = (id: number) => {
	toasts.update((all) => all.filter((t) => t.id !== id));
};

export const addToast = (toast: Toast) => {
	// Create a unique ID so we can easily find/remove it
	// if it is dismissible/has a timeout.
	const id = Math.floor(Math.random() * 10000);

	// Setup some sensible defaults for a toast.
	const defaults = {
		id,
		type: ToastLevel.Info,
		dismissible: true,
		timeout: 9000
	};

	// Push the toast to the top of the list of toasts
	const t = { ...defaults, ...toast };
	toasts.update((all) => [t, ...all]);

	// If toast is dismissible, dismiss it after "timeout" amount of time.
	if (t.timeout) setTimeout(() => dismissToast(id), t.timeout);
};

interface ToastModel {
	id: number;
	message: string;
	type: ToastLevel;
	dismissible: boolean;
	timeout: number;
}

export interface Toast {
	message: string;
	type?: ToastLevel;
	dismissible?: boolean;
	timeout?: number;
}

export enum ToastLevel {
	Info = 'blue',
	Success = 'green',
	Warning = 'indigo',
	Error = 'red'
}
