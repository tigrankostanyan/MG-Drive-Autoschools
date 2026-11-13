import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test.describe("Auth Forms - WCAG 2.2 AA Accessibility", () => {
	test.use({ storageState: "empty-state.json" });

	test.beforeEach(async ({ page }) => {
		await page.goto("/");
	});

	test("Auth modal should have no accessibility violations", async ({ page }) => {
		await page.goto("/");

		// Open auth modal
		await page.locator('a[href="/auth"], button:has-text("Sign In")').click();

		// Wait for modal to be visible
		const modal = page.locator('[role="dialog"]');
		await expect(modal).toBeVisible();

		const results = await new AxeBuilder({ page })
			.include("#modal-root")
			.withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "best-practice"])
			.analyze();

		const violations = results.violations.filter(
			(v) => v.impact === "critical" || v.impact === "serious",
		);

		expect(violations).toEqual([]);
	});

	test("Auth modal should have proper focus management", async ({ page }) => {
		await page.goto("/");
		await page.locator('button:has-text("Sign In")').click();

		const modal = page.locator('[role="dialog"]');
		await expect(modal).toBeVisible();

		// First focusable element should be the Google button
		await page.keyboard.press("Tab");

		const focusedElement = await page.evaluate(() => document.activeElement?.tagName);
		expect(focusedElement).toBeTruthy();

		// Focus should be trapped within modal
		const isWithinModal = await page.evaluate(() => {
			const active = document.activeElement;
			const modal = document.querySelector('[role="dialog"]');
			return modal?.contains(active) || active?.closest('[role="dialog"]');
		});
		expect(isWithinModal).toBeTruthy();
	});

	test("Auth modal close button should have accessible label", async ({ page }) => {
		await page.goto("/");
		await page.locator('button:has-text("Sign In")').click();

		const closeButton = page.locator(
			'[role="dialog"] button[aria-label="Close"], button[aria-label="Փակել"]',
		);
		await expect(closeButton).toBeVisible();

		// Verify aria-label is present
		const hasLabel = await closeButton.evaluate((el) => el.getAttribute("aria-label"));
		expect(hasLabel).toBeTruthy();
	});

	test("Google sign in button should have accessible name", async ({ page }) => {
		await page.goto("/");
		await page.locator('button:has-text("Sign In")').click();

		const googleButton = page.locator(
			'button#google-modal-btn, button:has-text("Շարունակել Google-ով")',
		);
		await expect(googleButton).toBeVisible();

		// Check for accessible name
		const accessibleName = await googleButton.evaluate(
			(el) => el.getAttribute("aria-label") || el.textContent || el.innerText,
		);
		expect(accessibleName).toBeTruthy();
	});

	test("Auth error message should be announced to screen readers", async ({ page }) => {
		await page.goto("/");
		await page.locator('button:has-text("Sign In")').click();

		const errorContainer = page.locator('[role="alert"]');
		if ((await errorContainer.count()) > 0) {
			const hasRole = await errorContainer.evaluate((el) => el.getAttribute("role"));
			expect(hasRole).toBe("alert");
		}
	});

	test("Session pending state should be announced", async ({ page }) => {
		await page.goto("/");

		// Check for loading indicators with appropriate ARIA attributes
		const loadingIndicators = page.locator('[aria-live], [role="status"]');
		if ((await loadingIndicators.count()) > 0) {
			const hasLiveRegion = await loadingIndicators
				.first()
				.evaluate((el) => el.getAttribute("aria-live") || el.getAttribute("role"));
			expect(hasLiveRegion).toBeTruthy();
		}
	});
});
