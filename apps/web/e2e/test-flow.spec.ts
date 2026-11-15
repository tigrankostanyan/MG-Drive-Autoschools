import { expect, test } from "@playwright/test";

test.describe("Test Taking Flow", () => {
	test.use({ storageState: "empty-state.json" });

	test("guest visiting /tests is redirected home", async ({ page }) => {
		await page.goto("/tests");

		await expect(page).toHaveURL(/\/$/);
	});

	// The full test-taking flow (open a test, answer questions, submit, see the
	// result) requires an authenticated session. The app only supports Google
	// OAuth, whose popup Playwright cannot drive, so this cannot be automated
	// until an out-of-band session seeding mechanism is provided.
	test.fixme("authenticated user can take and finish a test", async ({ page }) => {
		await page.goto("/tests");
	});
});
