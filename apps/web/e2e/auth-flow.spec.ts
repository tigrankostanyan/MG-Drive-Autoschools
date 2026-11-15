import { expect, test } from "@playwright/test";
import { closeAuthModal, openAuthModal } from "./auth.setup";

test.describe("Authentication Flow", () => {
	test.use({ storageState: "empty-state.json" });

	test("should show login button for unauthenticated users", async ({ page }) => {
		await page.goto("/");

		// The only entry point is the header button that opens the Google modal.
		await expect(page.getByRole("button", { name: "Մուտք" }).first()).toBeVisible();
	});

	test("should open the Google auth modal via deep link", async ({ page }) => {
		await openAuthModal(page);
		await closeAuthModal(page);
	});

	test("auth modal closes on Escape", async ({ page }) => {
		await openAuthModal(page);

		await page.keyboard.press("Escape");
		await expect(page.getByRole("dialog", { name: "Մուտք հաշիվ" })).toBeHidden();
	});

	test("legacy /auth route redirects to home", async ({ page }) => {
		await page.goto("/auth");

		await expect(page).toHaveURL(/\/$/);
	});

	test("should redirect to home when trying to access protected routes", async ({ page }) => {
		await page.goto("/tests");

		// Unauthenticated visitors are sent back to the home page.
		await expect(page).toHaveURL(/\/$/);
	});

	test("should handle missing session gracefully", async ({ page }) => {
		await page.context().clearCookies();
		await page.goto("/");

		// App should handle missing session gracefully
		await expect(page.url()).not.toContain("/tests");
		await expect(page.url()).not.toContain("/profile");
	});

	// Authenticated login/logout cannot be exercised here: the app only supports
	// Google OAuth (third-party popup), which Playwright cannot drive.
});
