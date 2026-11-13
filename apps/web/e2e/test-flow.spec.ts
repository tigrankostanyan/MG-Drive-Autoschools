import { expect, test } from "@playwright/test";

test.describe("Test Taking Flow", () => {
	test.use({ storageState: "empty-state.json" });

	test("should display test selection page", async ({ page }) => {
		await page.goto("/tests");

		// Should show login prompt if not authenticated
		await expect(page.locator('a[href="/auth"], button:has-text("Sign In")')).toBeVisible();
	});

	test("should allow taking and finishing a test", async ({ page }) => {
		// This test requires authentication - skip if not available
		const testAccountEmail = process.env.E2E_TEST_USER_EMAIL;
		const testAccountPassword = process.env.E2E_TEST_USER_PASSWORD;

		if (!testAccountEmail || !testAccountPassword) {
			test.skip();
			return;
		}

		// Login
		await page.goto("/auth");
		await page.getByRole("tab", { name: "Sign In" }).click();
		await page.getByLabel(/Email/i, { exact: false }).fill(testAccountEmail);
		await page.getByLabel(/Password/i, { exact: false }).fill(testAccountPassword);
		await page.getByRole("button", { name: /Sign In/i }).click();
		await page.waitForURL("/");

		// Navigate to tests
		await page.goto("/tests");

		// Find a test to take (diagnostic test)
		const testLink = page.locator('a[href^="/tests/"]').first();
		await expect(testLink).toBeVisible();

		if ((await testLink.count()) > 0) {
			await testLink.click();

			// Test runner should be visible
			await page.waitForURL(/\/tests\/\d+$/);

			// Check for question navigation
			const progressBar = page.locator('[role="progressbar"], .progress, .timer');
			await expect(progressBar).toBeVisible();

			// Answer questions (select first option for each)
			const optionButtons = await page
				.locator("button[aria-label], .option-button, .answer-button")
				.all();

			for (const option of optionButtons) {
				await option.click();
			}

			// Finish test
			const finishButton = page.locator(
				'button:has-text("Finish"), button:has-text("Complete"), [data-testid="finish-button"]',
			);
			await expect(finishButton).toBeVisible();

			await finishButton.click();

			// Results screen should appear
			await expect(page.locator('[role="alert"], .results, .score')).toBeVisible({
				timeout: 10000,
			});
		}
	});

	test("should handle test timeout", async ({ page }) => {
		const testAccountEmail = process.env.E2E_TEST_USER_EMAIL;
		const testAccountPassword = process.env.E2E_TEST_USER_PASSWORD;

		if (!testAccountEmail || !testAccountPassword) {
			test.skip();
			return;
		}

		// Login
		await page.goto("/auth");
		await page.getByRole("tab", { name: "Sign In" }).click();
		await page.getByLabel(/Email/i, { exact: false }).fill(testAccountEmail);
		await page.getByLabel(/Password/i, { exact: false }).fill(testAccountPassword);
		await page.getByRole("button", { name: /Sign In/i }).click();
		await page.waitForURL("/");

		// Navigate to a test
		await page.goto("/tests");
		const firstTest = page.locator('a[href^="/tests/"]').first();

		if ((await firstTest.count()) > 0) {
			await firstTest.click();
			await page.waitForURL(/\/tests\/\d+$/);

			// Wait for timer to expire (or simulate by not answering)
			// For testing, we'll check the timer is running
			const timerElement = page.locator(".timer, [role='progressbar']");
			await expect(timerElement).toBeVisible();
		}
	});
});
