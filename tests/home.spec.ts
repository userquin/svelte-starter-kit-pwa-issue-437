import type { Page } from '@playwright/test';
import { expect, test } from '@playwright/test';

test.describe.serial('Home page', () => {
	let page: Page;

	test.beforeAll(async ({ browser }) => {
		page = await browser.newPage();
	});

	test.afterAll(async () => {
		await page.close();
	});

	test('has Home in title and get started link linking to the dashboard page @fast', async ({ page }) => {
		await page.goto('/');

		// Expect a title "to contain" a substring.
		await expect(page).toHaveTitle(/Home/);

		// create a locator
		const aboutUs = page.getByText('About us');

		// Expect an attribute "to be strictly equal" to the value.
		await expect(aboutUs).toHaveAttribute('href', '/about');

		// Click the get started link.
		await aboutUs.click();

		// Expects the URL to contain intro.
		await expect(page).toHaveURL(/about/);
	});

	test('has H1 content @slow', async ({ page }) => {
		await page.goto('/');

		expect(await page.textContent('h1')).toBe('Combine GraphQL APIs into a unified supergraph');
	});

	test.skip('skiped: login with google', async ({ page }) => {
		// This test is not run
		await page.bringToFront();
		// Recording...
		await page.getByRole('banner').getByRole('link', { name: 'Datablocks' }).click();
		await page.getByRole('link', { name: 'dashboard-link' }).click();
		await page.getByRole('textbox', { name: 'Email or phone' }).fill('sumo@gmail.com');
		await page.getByRole('button', { name: 'Next' }).click();
	});
});
