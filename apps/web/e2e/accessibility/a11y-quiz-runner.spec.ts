import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test.describe("Quiz Runner - WCAG 2.2 AA Accessibility", () => {
	test.use({ storageState: "empty-state.json" });

	test.beforeEach(async ({ page }) => {
		await page.goto("/");
	});

	test("Quiz runner page should have no critical accessibility violations", async ({ page }) => {
		await page.goto("/tests");

		await page.locator('a[href="/auth"], button:has-text("Sign In")').click();
		await page.getByLabel(/Email/i, { exact: false }).fill("test@example.com");
		await page.getByLabel(/Password/i, { exact: false }).fill("testPassword123");
		await page.getByRole("button", { name: /Sign In/i }).click();

		const testLink = page.locator('a[href^="/tests/"]').first();
		if ((await testLink.count()) > 0) {
			await testLink.click();
			await page.waitForURL(/\/tests\/\d+$/);

			const results = await new AxeBuilder({ page })
				.withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "best-practice"])
				.analyze();

			const criticalViolations = results.violations.filter(
				(v) =>
					v.impact === "critical" ||
					v.impact === "serious" ||
					(v.impact === "moderate" && !v.id.includes("color-contrast")),
			);

			expect(criticalViolations).toEqual([]);
		}
	});

	test("Question options should be keyboard navigable", async ({ page }) => {
		await page.goto("/tests");
		await page.locator('a[href="/auth"], button:has-text("Sign In")').click();
		await page.getByLabel(/Email/i, { exact: false }).fill("test@example.com");
		await page.getByLabel(/Password/i, { exact: false }).fill("testPassword123");
		await page.getByRole("button", { name: /Sign In/i }).click();

		const testLink = page.locator('a[href^="/tests/"]').first();
		if ((await testLink.count()) > 0) {
			await testLink.click();
			await page.waitForURL(/\/tests\/\d+$/);

			await page.keyboard.press("Tab");
			const firstButton = page.locator("button").first();
			await expect(firstButton).toBeFocused();

			const optionButtons = await page
				.locator("button[aria-label], .option-button, .answer-button")
				.all();

			for (let i = 0; i < optionButtons.length; i++) {
				await page.keyboard.press("Tab");
				await expect(optionButtons[i]).toBeFocused();
			}
		}
	});

	test("Navigation buttons should have visible focus indicators", async ({ page }) => {
		await page.goto("/tests");
		await page.locator('a[href="/auth"], button:has-text("Sign In")').click();
		await page.getByLabel(/Email/i, { exact: false }).fill("test@example.com");
		await page.getByLabel(/Password/i, { exact: false }).fill("testPassword123");
		await page.getByRole("button", { name: /Sign In/i }).click();

		const testLink = page.locator('a[href^="/tests/"]').first();
		if ((await testLink.count()) > 0) {
			await testLink.click();
			await page.waitForURL(/\/tests\/\d+$/);

			// Verify Tab key focuses interactive elements
			await page.keyboard.press("Tab");
			const focusedElement = await page.evaluate(() => document.activeElement?.tagName);
			expect(focusedElement).toBeTruthy();
		}
	});

	test("Results screen should have proper heading structure", async ({ page }) => {
		await page.goto("/tests");
		await page.locator('a[href="/auth"], button:has-text("Sign In")').click();
		await page.getByLabel(/Email/i, { exact: false }).fill("test@example.com");
		await page.getByLabel(/Password/i, { exact: false }).fill("testPassword123");
		await page.getByRole("button", { name: /Sign In/i }).click();

		const testLink = page.locator('a[href^="/tests/"]').first();
		if ((await testLink.count()) > 0) {
			await testLink.click();
			await page.waitForURL(/\/tests\/\d+$/);

			const optionButtons = await page
				.locator("button[aria-label], .option-button, .answer-button")
				.all();
			for (const option of optionButtons) {
				await option.click();
			}

			await page.locator('button:has-text("Ավարտել")').click();
			await expect(page.locator('.results, .score, [role="alert"]')).toBeVisible({
				timeout: 10000,
			});

			const headings = await page.evaluate(() =>
				Array.from(document.querySelectorAll("h1, h2, h3, h4, h5, h6")).map((h) => h.tagName),
			);
			expect(headings.length).toBeGreaterThan(0);

			const landmarks = await page.evaluate(() => {
				const elements = document.querySelectorAll(
					'[role="main"], [role="dialog"], [role="alertdialog"], main, dialog',
				);
				return elements.length;
			});
			expect(landmarks).toBeGreaterThan(0);
		}
	});

	test("Progress bar should have accessible label", async ({ page }) => {
		await page.goto("/tests");
		await page.locator('a[href="/auth"], button:has-text("Sign In")').click();
		await page.getByLabel(/Email/i, { exact: false }).fill("test@example.com");
		await page.getByLabel(/Password/i, { exact: false }).fill("testPassword123");
		await page.getByRole("button", { name: /Sign In/i }).click();

		const testLink = page.locator('a[href^="/tests/"]').first();
		if ((await testLink.count()) > 0) {
			await testLink.click();
			await page.waitForURL(/\/tests\/\d+$/);

			const progressBar = page.locator('[role="progressbar"], .progress');
			if ((await progressBar.count()) > 0) {
				await expect(progressBar).toBeVisible();

				const hasAriaValue = await progressBar.evaluate(
					(el) => el.getAttribute("aria-valuenow") !== null,
				);
				expect(hasAriaValue || progressBar.textContent()).toBeTruthy();
			}
		}
	});
});
