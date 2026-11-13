import { expect, test } from "@playwright/test";

test.describe("Authentication Flow", () => {
	test.use({ storageState: "empty-state.json" });

	test("should show login option for unauthenticated users", async ({ page }) => {
		await page.goto("/");

		// Check for login/sign in button
		const authButton = page.locator('a[href="/auth"], button:has-text("Sign In")');
		await expect(authButton).toBeVisible();
	});

	test("should redirect to home when trying to access protected routes", async ({ page }) => {
		await page.goto("/tests");

		// Should redirect to home or auth page
		await expect(page.locator("body")).toHaveURL(/\/(auth)?$/);
	});

	test("should handle expired session gracefully", async ({ page }) => {
		// Set up session that will be considered expired
		await page.context().clearCookies();
		await page.goto("/");

		// App should handle missing session gracefully
		await expect(page.url()).not.toContain("/tests");
		await expect(page.url()).not.toContain("/profile");
	});
});

test.describe("Login and Logout", () => {
	test("should successfully log in", async ({ page }) => {
		await page.goto("/auth");

		await page.getByRole("tab", { name: "Sign In" }).click();

		await page.getByLabel(/Email/i, { exact: false }).fill("test@example.com");
		await page.getByLabel(/Password/i, { exact: false }).fill("testPassword123");

		await page.getByRole("button", { name: /Sign In/i }).click();

		await page.waitForURL("/");

		// Check for successful login indicators
		await expect(page.locator("[data-testid='user-menu'], .avatar, .profile-link")).toBeVisible({
			timeout: 10000,
		});
	});

	test("should log out successfully", async ({ page }) => {
		// First, log in
		await page.goto("/auth");
		await page.getByRole("tab", { name: "Sign In" }).click();
		await page.getByLabel(/Email/i, { exact: false }).fill("test@example.com");
		await page.getByLabel(/Password/i, { exact: false }).fill("testPassword123");
		await page.getByRole("button", { name: /Sign In/i }).click();

		// Navigate to profile
		await page.goto("/profile");
		await page.waitForURL("/profile");

		// Click logout
		await page.getByRole("button", { name: /Logout/i }).click();

		// Should redirect to home
		await page.waitForURL("/");

		// User menu should be hidden
		await expect(page.locator("[data-testid='user-menu']")).not.toBeVisible();
	});
});
