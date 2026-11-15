import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
	testDir: "./e2e",
	fullyParallel: true,
	forbidOnly: !!process.env.CI,
	retries: process.env.CI ? 2 : 0,
	workers: process.env.CI ? 1 : undefined,
	reporter: [["list"], ["html", { open: "never" }]],
	// The auth modal is lazily mounted after the browser goes idle, which is slow
	// in single-worker environments, so give assertions room to wait.
	expect: { timeout: 20000 },
	use: {
		baseURL: "http://localhost:8090",
		trace: "on-first-retry",
		screenshot: "only-on-failure",
		actionTimeout: 15000,
	},

	webServer: {
		command: "npx vite --port 8090 --strictPort",
		url: "http://localhost:8090",
		reuseExistingServer: !process.env.CI,
		timeout: 120000,
	},

	projects: [
		{
			name: "chromium",
			use: { ...devices["Desktop Chrome"] },
		},
		{
			name: "Mobile Chrome",
			use: { ...devices["Pixel 5"] },
		},
	],
});
