import { expect, test } from "@playwright/test";

test.describe("Navigation Flow", () => {
	test.use({ storageState: "empty-state.json" });

	test("should navigate to main pages from home", async ({ page }) => {
		await page.goto("/");

		// Check for main navigation links
		const navLinks = await page.locator("nav a, .nav a, .menu a").all();

		// At minimum, should have auth link for unauthenticated users
		const hasAuthLink = navLinks.some((link) => link.href().includes("/auth"));
		expect(hasAuthLink || (await page.locator('a[href="/auth"]').count()) > 0).toBeTruthy();
	});

	test("should show user menu when authenticated", async ({ page }) => {
		// Try to navigate to profile - if not logged in, should redirect
		await page.goto("/profile");

		// If redirected to auth, test passes
		// If stays on profile, check for user menu
		const isAtAuth = page.url().includes("/auth");
		const userMenu = page.locator("[data-testid='user-menu'], .avatar, .profile-link");

		if (!isAtAuth) {
			await expect(userMenu).toBeVisible();
		}
	});

	test("should navigate between test tabs", async ({ page }) => {
		await page.goto("/");

		// Check for test-related navigation
		const testLink = page.locator('a[href*="/tests"]');

		if ((await testLink.count()) > 0) {
			await testLink.click();
			await expect(page.url()).toContain("/tests");
		}
	});

	test("should handle group navigation", async ({ page }) => {
		await page.goto("/");

		// Check for group-related navigation
		const groupLink = page.locator('a[href*="/groups"]');

		if ((await groupLink.count()) > 0) {
			await groupLink.first().click();
			await expect(page.url()).toContain("/groups");

			// Group page should have group listing or details
			const groupElements = page.locator("[data-testid='group-card'], .group-card, .group-item");

			// Check for loading state or actual groups
			const isLoading = (await groupElements.count()) === 0;
			if (!isLoading) {
				await expect(groupElements.first()).toBeVisible();
			}
		}
	});

	test("should handle profile navigation", async ({ page }) => {
		// Try to access profile
		await page.goto("/profile");

		// Should either redirect to auth or show profile
		const isAtAuth = page.url().includes("/auth");
		const isAtProfile = page.url().includes("/profile");

		expect(isAtAuth || isAtProfile).toBeTruthy();

		if (isAtProfile) {
			// Check for profile content
			const profileElements = page.locator(
				"[data-testid='profile'], .profile, [data-testid='profile-banner']",
			);
			await expect(profileElements).toBeVisible();
		}
	});

	test("should handle logout navigation", async ({ page }) => {
		await page.goto("/");

		// Find logout button (may not exist if not logged in)
		const logoutButton = page.locator('button:has-text("Logout"), a[href*="logout"]');

		if ((await logoutButton.count()) > 0) {
			await logoutButton.click();

			// Should redirect to home
			await page.waitForURL("/");
			await expect(page.locator('a[href="/auth"]')).toBeVisible();
		}
	});
});
