import type { Browser, Page } from '@playwright/test';
import { chromium } from '@playwright/test';
let browser: Browser;
let page: Page;

describe('playwright using vitest runner', () => {
	beforeAll(async () => {
		browser = await chromium.launch();
	});
	afterAll(async () => {
		await browser.close();
	});

	beforeEach(async () => {
		page = await browser.newPage();
	});
	afterEach(async () => {
		await page.close();
	});

	it('example should work', async () => {
		await page.goto('https://www.example.com/');
		expect(await page.title()).toBe('Example Domain');
	});
});
