import { expect, test } from '@playwright/test';

test('index page has expected h2', async ({ page }) => {
	await page.goto('/');
	expect(await page.textContent('h1')).toBe('Welcome to SvelteKit');
});
