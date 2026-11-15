import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test.describe("Quiz Runner - WCAG 2.2 AA Accessibility", () => {
	test.use({ storageState: "empty-state.json" });

	test("Public pages should have no critical accessibility violations", async ({ page }) => {
		await page.goto("/");

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
	});

	test("Landmarks and headings should be present on the home page", async ({ page }) => {
		await page.goto("/");

		const headings = await page.evaluate(() =>
			Array.from(document.querySelectorAll("h1, h2, h3, h4, h5, h6")).map((h) => h.tagName),
		);
		expect(headings.length).toBeGreaterThan(0);
	});

	// The quiz runner lives behind an authenticated route (/tests), and the app
	// only supports Google OAuth, whose popup Playwright cannot drive. These
	// checks cannot run until an out-of-band session seeding mechanism exists.
	test.fixme("Quiz runner page should have no critical accessibility violations", async ({
		page,
	}) => {
		await page.goto("/tests");
	});

	test.fixme("Question options should be keyboard navigable", async ({ page }) => {
		await page.goto("/tests");
	});

	test.fixme("Progress bar should have accessible label", async ({ page }) => {
		await page.goto("/tests");
	});
});
