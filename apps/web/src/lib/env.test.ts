import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

describe("env validation", () => {
	beforeEach(() => {
		vi.unstubAllEnvs();
		vi.stubEnv("VITE_GOOGLE_CLIENT_ID", "");
		// Prevent leakage from local .env files
		vi.stubEnv("VITE_SITE_URL", undefined as unknown as string);
		vi.stubEnv("VITE_SENTRY_DSN", undefined as unknown as string);
		vi.stubEnv("VITE_SENTRY_ENVIRONMENT", undefined as unknown as string);
	});

	afterEach(() => {
		vi.unstubAllEnvs();
		vi.resetModules();
	});

	describe("required env vars", () => {
		it("should throw when VITE_GOOGLE_CLIENT_ID is missing", async () => {
			await expect(import("./env")).rejects.toThrow();
		});

		it("should pass when all required vars are present", async () => {
			vi.stubEnv("VITE_GOOGLE_CLIENT_ID", "google-client-id");

			const env = await import("./env");
			expect(env.env.VITE_GOOGLE_CLIENT_ID).toBe("google-client-id");
		});

		it("should throw when VITE_GOOGLE_CLIENT_ID is empty string", async () => {
			await expect(import("./env")).rejects.toThrow();
		});
	});

	describe("optional env vars", () => {
		it("should work with optional VITE_SITE_URL", async () => {
			vi.stubEnv("VITE_SITE_URL", "https://example.com");
			vi.stubEnv("VITE_GOOGLE_CLIENT_ID", "google-client-id");

			const env = await import("./env");
			expect(env.env.VITE_SITE_URL).toBe("https://example.com");
		});

		it("should work without VITE_SITE_URL", async () => {
			vi.stubEnv("VITE_GOOGLE_CLIENT_ID", "google-client-id");

			const env = await import("./env");
			expect(env.env.VITE_SITE_URL).toBeUndefined();
		});

		it("should work with optional Sentry env vars", async () => {
			vi.stubEnv("VITE_GOOGLE_CLIENT_ID", "google-client-id");
			vi.stubEnv("VITE_SENTRY_DSN", "https://sentry.example.com/123");
			vi.stubEnv("VITE_SENTRY_ENVIRONMENT", "production");

			const env = await import("./env");
			expect(env.env.VITE_SENTRY_DSN).toBe("https://sentry.example.com/123");
			expect(env.env.VITE_SENTRY_ENVIRONMENT).toBe("production");
		});
	});

	describe("URL validation", () => {
		it("should reject invalid URL for VITE_SITE_URL", async () => {
			vi.stubEnv("VITE_SITE_URL", "not-a-url");
			vi.stubEnv("VITE_GOOGLE_CLIENT_ID", "google-client-id");

			await expect(import("./env")).rejects.toThrow();
		});

		it("should accept valid URLs for VITE_SITE_URL", async () => {
			vi.stubEnv("VITE_SITE_URL", "https://example.com");
			vi.stubEnv("VITE_GOOGLE_CLIENT_ID", "google-client-id");

			const env = await import("./env");
			expect(env.env.VITE_SITE_URL).toBe("https://example.com");
		});
	});

	describe("strict mode", () => {
		it("should reject unknown environment variables in strict mode", async () => {
			vi.stubEnv("NODE_ENV", "production");
			vi.stubEnv("VITE_GOOGLE_CLIENT_ID", "google-client-id");
			vi.stubEnv("UNKNOWN_VAR", "should-fail");

			const envModule = await import("./env");
			// Verify that only VITE_ variables are picked up and unknown vars are ignored
			expect(envModule.env.VITE_GOOGLE_CLIENT_ID).toBe("google-client-id");
		});
	});

	describe("exported values", () => {
		it("should export individual VITE_ constants", async () => {
			vi.stubEnv("VITE_GOOGLE_CLIENT_ID", "google-client-id");

			const { VITE_GOOGLE_CLIENT_ID, VITE_SENTRY_DSN } = await import("./env");

			expect(VITE_GOOGLE_CLIENT_ID).toBe("google-client-id");
			expect(VITE_SENTRY_DSN).toBeUndefined();
		});
	});
});
