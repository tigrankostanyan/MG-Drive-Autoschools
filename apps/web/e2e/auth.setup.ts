import { expect, type Page } from "@playwright/test";

// NOTE: The app authenticates exclusively through Google OAuth (a third-party
// popup), so a real end-to-end login cannot be automated from Playwright. Tests
// that need an authenticated session must seed it out-of-band (e.g. an injected
// session cookie) and are therefore out of scope for these specs.

/** Opens the Google auth modal via the app's dedicated deep link. */
export async function openAuthModal(page: Page) {
	// The auth modal is lazily mounted after the browser goes idle, so allow
	// extra time for the dialog to appear in slower environments.
	await page.goto("/?auth=login");
	await expect(page.getByRole("dialog", { name: "Մուտք հաշիվ" })).toBeVisible({ timeout: 20000 });
}

/** Closes the auth modal via the close button and asserts it is gone. */
export async function closeAuthModal(page: Page) {
	await page.getByRole("button", { name: "Փակել", exact: true }).click();
	await expect(page.getByRole("dialog", { name: "Մուտք հաշիվ" })).toBeHidden();
}
