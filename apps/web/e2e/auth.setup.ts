import { type Page, test } from "@playwright/test";

// Test credentials - use a dedicated test account
export const TEST_USER = {
	email: "test@example.com",
	password: "TestPassword123!",
};

// Store session cookies for authenticated tests
export async function login(page: Page) {
	await page.goto("/auth");

	await page.getByRole("tab", { name: "Sign In" }).click();

	await page.getByLabel(/Email/i, { exact: false }).fill(TEST_USER.email);
	await page.getByLabel(/Password/i, { exact: false }).fill(TEST_USER.password);

	await page.getByRole("button", { name: /Sign In/i }).click();

	// Wait for navigation to home page
	await page.waitForURL("/");

	// Verify user is logged in by checking for profile link or user avatar
	await expect(page.locator("[data-testid='user-menu']")).toBeVisible({ timeout: 10000 });
}

// Store signed-out session state
export async function logout(page: Page) {
	await page.goto("/profile");

	await page.getByRole("button", { name: /Logout/i }).click();

	await page.waitForURL("/");
}

// Create a new authenticated page context
export const authTest = test.extend<{
	loggedInPage: Page;
}>({
	loggedInPage: async ({ page }, use) => {
		await login(page);
		await use(page);
		await logout(page);
	},
});

// Expected test data - based on typical app configuration
export const EXPECTED_TEST_DATA = {
	testNames: ["Սկզբունք գանձ", "Առաջին ատյան", "Միջին ատյան", "Ավարտ թեստ"],
	groupNames: ["Basic Group", "Advanced Group"],
};
