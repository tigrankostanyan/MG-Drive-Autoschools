import { redirect } from "@tanstack/react-router";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { redirectIfAuthenticated, requireAuth } from "./auth-guard";
import * as authSession from "./auth-session";
import * as authSessionResolver from "./auth-session-resolver";

// Mock tanstack router
vi.mock("@tanstack/react-router", () => ({
	redirect: vi.fn().mockImplementation((loc: { to: string }) => {
		const error = new Error(`Redirect to ${loc.to}`);
		(error as unknown as { name: string }).name = "RedirectError";
		throw error;
	}),
}));

// Mock auth-session-resolver
vi.mock("./auth-session-resolver", () => ({
	getKnownUser: vi.fn(),
	getSessionUser: vi.fn(),
	verifySession: vi.fn(),
}));

// Mock auth-session
vi.mock("./auth-session", () => ({
	clearSessionUser: vi.fn(),
}));

const mockRedirect = vi.mocked(redirect);
const mockGetKnownUser = vi.mocked(authSessionResolver.getKnownUser);
const mockGetSessionUser = vi.mocked(authSessionResolver.getSessionUser);
const mockVerifySession = vi.mocked(authSessionResolver.verifySession);
const mockClearSessionUser = vi.mocked(authSession.clearSessionUser);

describe("auth-guard", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	describe("redirectIfAuthenticated", () => {
		it("should redirect to '/' if known user exists", async () => {
			mockGetKnownUser.mockReturnValue({
				id: 1,
				name: "Test User",
				email: "test@example.com",
				role: "user",
			});

			await expect(redirectIfAuthenticated()).rejects.toThrow("Redirect to /");
			expect(mockRedirect).toHaveBeenCalledWith({ to: "/" });
		});

		it("should redirect to '/' if session user exists", async () => {
			mockGetKnownUser.mockReturnValue(null);
			mockGetSessionUser.mockResolvedValue({
				id: 1,
				name: "Test User",
				email: "test@example.com",
				role: "user",
			});

			await expect(redirectIfAuthenticated()).rejects.toThrow("Redirect to /");
			expect(mockRedirect).toHaveBeenCalledWith({ to: "/" });
		});

		it("should not redirect when no user is authenticated", async () => {
			mockGetKnownUser.mockReturnValue(null);
			mockGetSessionUser.mockResolvedValue(null);

			await expect(redirectIfAuthenticated()).resolves.toBeUndefined();
			expect(mockRedirect).not.toHaveBeenCalled();
		});
	});

	describe("requireAuth", () => {
		it("should redirect to '/' when session status is expired", async () => {
			mockVerifySession.mockResolvedValue({ status: "expired" });

			await expect(requireAuth()).rejects.toThrow("Redirect to /");
			expect(mockRedirect).toHaveBeenCalledWith({ to: "/" });
		});

		it("should throw redirect and clear session when session status is none", async () => {
			mockVerifySession.mockResolvedValue({ status: "none" });

			await expect(requireAuth()).rejects.toThrow("Redirect to /");
			expect(mockRedirect).toHaveBeenCalledWith({ to: "/" });
			expect(mockClearSessionUser).toHaveBeenCalled();
		});

		it("should resolve when session is valid", async () => {
			mockVerifySession.mockResolvedValue({
				status: "ok",
				user: {
					id: 1,
					name: "Test User",
					email: "test@example.com",
					role: "user",
				},
			});

			await expect(requireAuth()).resolves.toBeUndefined();
			expect(mockClearSessionUser).not.toHaveBeenCalled();
		});

		describe("requireRole option", () => {
			it("should allow access when role matches required role", async () => {
				mockVerifySession.mockResolvedValue({
					status: "ok",
					user: {
						id: 1,
						name: "Test User",
						email: "test@example.com",
						role: "admin",
					},
				});

				await expect(requireAuth({ requireRole: ["admin"] })).resolves.toBeUndefined();
			});

			it("should deny access when role does not match required roles", async () => {
				mockVerifySession.mockResolvedValue({
					status: "ok",
					user: {
						id: 1,
						name: "Test User",
						email: "test@example.com",
						role: "user",
					},
				});

				await expect(requireAuth({ requireRole: ["admin", "teacher"] })).rejects.toThrow(
					"Redirect to /",
				);
			});
		});
	});
});
