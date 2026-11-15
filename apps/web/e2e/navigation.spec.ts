import { expect, test } from "@playwright/test";
import { openAuthModal } from "./auth.setup";

test.describe("Navigation Flow", () => {
	test.use({ storageState: "empty-state.json" });

	test("should navigate to public pages from the home nav", async ({ page }) => {
		await page.goto("/");

		// The public nav exposes these links for every visitor.
		const publicLinks = [
			{ name: "Դասընթացներ", url: /\/courses$/ },
			{ name: "Ուսուցման ընթացք", url: /\/how-it-works$/ },
		];
		for (const { name, url } of publicLinks) {
			await page.getByRole("link", { name }).first().click();
			await expect(page).toHaveURL(url);
			await page.goto("/");
		}
	});

	test("should open auth modal for guests", async ({ page }) => {
		await openAuthModal(page);
	});

	test("protected /profile redirects guests to home", async ({ page }) => {
		await page.goto("/profile");

		await expect(page).toHaveURL(/\/$/);
	});

	test("protected /tests redirects guests to home", async ({ page }) => {
		await page.goto("/tests");

		await expect(page).toHaveURL(/\/$/);
	});

	test("protected /groups redirects guests to home", async ({ page }) => {
		await page.goto("/groups");

		await expect(page).toHaveURL(/\/$/);
	});

	test("protected /admin redirects guests to home", async ({ page }) => {
		await page.goto("/admin");

		await expect(page).toHaveURL(/\/$/);
	});

	test("unknown routes render the 404 page", async ({ page }) => {
		const response = await page.goto("/this-route-does-not-exist-xyz");

		expect(response?.status()).toBe(404);
	});
});
