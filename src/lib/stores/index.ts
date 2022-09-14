import { writable } from 'svelte/store';

// Ref: https://github.com/zicho/sveltekit-supabase/tree/master/src/lib/stores

export const isDev = writable(process.env.NODE_ENV === 'development');
