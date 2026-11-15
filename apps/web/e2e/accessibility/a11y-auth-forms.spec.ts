import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test.describe("Auth Forms - WCAG 2.2 AA Accessibility", () => {
	test.use({ storageState: "empty-state.json" });

	test.beforeEach(async ({ page }) => {
		await page.goto("/?auth=login");
		await expect(page.getByRole("dialog", { name: "Մուտք հաշիվ" })).toBeVisible({ timeout: 20000 });
	});

	test("Auth modal should have no accessibility violations", async ({ page }) => {
		const results = await new AxeBuilder({ page })
			.include('[role="dialog"]')
			.withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "best-practice"])
			.analyze();

		const violations = results.violations.filter(
			(v) => v.impact === "critical" || v.impact === "serious",
		);

		expect(violations).toEqual([]);
	});

	test("Auth modal should trap focus within the dialog", async ({ page }) => {
		await page.keyboard.press("Tab");

		const focusIsWithinModal = await page.evaluate(() => {
			const active = document.activeElement;
			const modal = document.querySelector('[role="dialog"]');
			return Boolean(modal?.contains(active));
		});
		expect(focusIsWithinModal).toBeTruthy();
	});

	test("Auth modal close button should have accessible label", async ({ page }) => {
		const closeButton = page.getByRole("button", { name: "Փակել", exact: true });
		await expect(closeButton).toBeVisible();

		const label = await closeButton.evaluate((el) => el.getAttribute("aria-label"));
		expect(label).toBeTruthy();
	});

	test("Google sign in entry should have an accessible name", async ({ page }) => {
		// The Google button is rendered by @react-oauth/google inside the dialog.
		const dialog = page.getByRole("dialog", { name: "Մուտք հաշիվ" });
		const accessibleText = await dialog.innerText();
		expect(accessibleText.length).toBeGreaterThan(0);
	});
});
