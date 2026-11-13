import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { z } from "zod";
import { ApiError } from "./client-base";
import { request } from "./request";

vi.mock("../auth-session", () => ({
	clearSessionUser: vi.fn(),
}));

vi.mock("../notify", () => ({
	notify: {
		error: vi.fn(),
	},
}));

vi.mock("./csrf", () => ({
	fetchCsrfToken: vi.fn(() => Promise.resolve("test-csrf-token")),
	invalidateCsrfCache: vi.fn(),
}));

vi.mock("./schemas", () => ({
	parseErrorBody: vi.fn((raw: unknown) => raw),
	parseJson: vi.fn((res: Response, schema?: z.ZodType) => {
		if (!res.ok) return Promise.reject(new Error("Not ok"));
		return res.json().then((data) => {
			if (schema) return schema.parseAsync(data);
			return data;
		});
	}),
}));

vi.mock("./ssr-context", () => ({
	getSsrContext: vi.fn(() => Promise.resolve({})),
}));

import { clearSessionUser } from "../auth-session";
import { notify } from "../notify";
import { parseErrorBody } from "./schemas";

const mockClearSessionUser = vi.mocked(clearSessionUser);
const mockNotifyError = vi.mocked(notify.error);
const mockParseErrorBody = vi.mocked(parseErrorBody);

// Helper to set up global fetch mock
function setupFetch(mockFetch: ReturnType<typeof vi.fn>) {
	global.fetch = mockFetch as typeof fetch;
}

describe("request", () => {
	const originalNavigator = global.navigator;
	const originalWindow = global.window;
	let mockFetch: ReturnType<typeof vi.fn>;

	beforeEach(() => {
		mockFetch = vi.fn();
		setupFetch(mockFetch);

		Object.defineProperty(global, "navigator", {
			value: { onLine: true },
			writable: true,
			configurable: true,
		});
		Object.defineProperty(global, "window", {
			value: { location: { href: "" }, dispatchEvent: vi.fn() },
			writable: true,
			configurable: true,
		});
		vi.clearAllMocks();
	});

	afterEach(() => {
		vi.restoreAllMocks();
		Object.defineProperty(global, "navigator", {
			value: originalNavigator,
			writable: true,
			configurable: true,
		});
		Object.defineProperty(global, "window", {
			value: originalWindow,
			writable: true,
			configurable: true,
		});
	});

	describe("successful requests", () => {
		it("should return parsed JSON with schema on successful GET", async () => {
			const mockData = { id: 1, name: "Test User" };
			const mockResponse = {
				ok: true,
				status: 200,
				json: () => Promise.resolve(mockData),
			} as Response;

			mockFetch.mockResolvedValue(mockResponse);
			const schema = z.object({ id: z.number(), name: z.string() });
			const result = await request<typeof mockData>("/test", undefined, schema);
			expect(result).toEqual(mockData);
		});

		it("should return undefined for 204 No Content response", async () => {
			const mockResponse = {
				ok: true,
				status: 204,
				json: () => Promise.resolve(undefined),
			} as Response;
			mockFetch.mockResolvedValue(mockResponse);
			const result = await request<void>("/test");
			expect(result).toBeUndefined();
		});

		it("should merge custom headers with default headers", async () => {
			const mockResponse = {
				ok: true,
				status: 200,
				json: () => Promise.resolve({ success: true }),
			} as Response;

			mockFetch.mockResolvedValue(mockResponse);
			const customHeaders = { "X-Custom-Header": "value" };
			await request("/test", { headers: customHeaders });

			const callArgs = mockFetch.mock.calls[0];
			expect(callArgs).toBeDefined();
			const init = callArgs[1] as RequestInit;
			expect(init?.headers).toHaveProperty("Content-Type", "application/json");
			expect(init?.headers).toHaveProperty("X-Custom-Header", "value");
		});

		it("should use credentials: include for all requests", async () => {
			const mockResponse = {
				ok: true,
				status: 200,
				json: () => Promise.resolve({ success: true }),
			} as Response;

			mockFetch.mockResolvedValue(mockResponse);
			await request("/test");
			const callArgs = mockFetch.mock.calls[0];
			const init = callArgs[1] as RequestInit;
			expect(init?.credentials).toBe("include");
		});
	});

	describe("error handling", () => {
		it("should throw ApiError for 401 with kicked_out reason", async () => {
			const mockResponse = {
				ok: false,
				status: 401,
				statusText: "Unauthorized",
				text: () => Promise.resolve(JSON.stringify({ error: "kicked_out" })),
			} as Response;
			mockFetch.mockResolvedValue(mockResponse);
			await expect(request("/test")).rejects.toThrow(ApiError);
			await expect(request("/test")).rejects.toMatchObject({
				message: "kicked_out",
				status: 401,
			});
		});

		it("should throw ApiError for general 401 unauthorized", async () => {
			const mockResponse = {
				ok: false,
				status: 401,
				statusText: "Unauthorized",
				text: () => Promise.resolve(JSON.stringify({ message: "Invalid session" })),
			} as Response;

			mockFetch.mockResolvedValue(mockResponse);

			await expect(request("/test")).rejects.toThrow(ApiError);
			await expect(request("/test")).rejects.toMatchObject({
				message: "Invalid session",
				status: 401,
			});
		});

		it("should throw ApiError for 403 forbidden", async () => {
			const mockResponse = {
				ok: false,
				status: 403,
				statusText: "Forbidden",
				text: () => Promise.resolve(""),
			} as Response;

			mockFetch.mockResolvedValue(mockResponse);
			await expect(request("/test")).rejects.toThrow(ApiError);
			await expect(request("/test")).rejects.toMatchObject({
				message: "403 Forbidden",
				status: 403,
			});
		});

		it("should throw ApiError for 500 internal server error", async () => {
			const mockResponse = {
				ok: false,
				status: 500,
				statusText: "Internal Server Error",
				text: () => Promise.resolve(""),
			} as Response;

			mockFetch.mockResolvedValue(mockResponse);
			await expect(request("/test")).rejects.toThrow(ApiError);
			await expect(request("/test")).rejects.toMatchObject({
				status: 500,
			});
		});

		it("should use server message when available for error response", async () => {
			const mockResponse = {
				ok: false,
				status: 400,
				statusText: "Bad Request",
				text: () => Promise.resolve(JSON.stringify({ message: "Validation failed" })),
			} as Response;

			mockFetch.mockResolvedValue(mockResponse);
			await expect(request("/test")).rejects.toMatchObject({
				message: "Validation failed",
				status: 400,
			});
		});
	});

	describe("network errors", () => {
		it("should throw ApiError with network message when fetch fails", async () => {
			mockFetch.mockImplementation(() => Promise.reject(new Error("Network error")));

			await expect(request("/test")).rejects.toThrow(ApiError);
			await expect(request("/test")).rejects.toMatchObject({
				status: 0,
			});
		});

		it("should detect offline state and show appropriate message", async () => {
			Object.defineProperty(global, "navigator", {
				value: { onLine: false },
				writable: true,
				configurable: true,
			});

			mockFetch.mockImplementation(() => Promise.reject(new Error("Network error")));
			try {
				await request("/test");
			} catch (e) {
				expect((e as ApiError).message).toBe("Ինտերնետ կապ չկա։ Ստուգեք կապը և փորձեք կրկին։");
			}
		});
	});

	describe("session handling", () => {
		it("should clear session user on TOKEN_EXPIRED", async () => {
			mockParseErrorBody.mockImplementation(() => ({ code: "TOKEN_EXPIRED" }));

			const mockResponse = {
				ok: false,
				status: 401,
				statusText: "Unauthorized",
				text: () => Promise.resolve(JSON.stringify({ code: "TOKEN_EXPIRED" })),
			} as Response;

			mockFetch.mockResolvedValue(mockResponse);
			await request("/test").catch(() => {});
			expect(mockClearSessionUser).toHaveBeenCalled();
		});

		it("should clear session user on session_invalidated error", async () => {
			mockParseErrorBody.mockImplementation(() => ({ error: "session_invalidated" }));

			const mockResponse = {
				ok: false,
				status: 401,
				statusText: "Unauthorized",
				text: () => Promise.resolve(JSON.stringify({ error: "session_invalidated" })),
			} as Response;

			mockFetch.mockResolvedValue(mockResponse);
			await request("/test").catch(() => {});
			expect(mockClearSessionUser).toHaveBeenCalled();
		});

		it("should show notification on kicked_out in browser", async () => {
			const mockWindow = {
				location: { href: "" },
				addEventListener: vi.fn(),
				removeEventListener: vi.fn(),
				dispatchEvent: vi.fn(),
			};

			Object.defineProperty(global, "window", {
				value: mockWindow,
				writable: true,
				configurable: true,
			});

			Object.defineProperty(global, "navigator", {
				value: { onLine: true },
				writable: true,
				configurable: true,
			});

			const mockResponse = {
				ok: false,
				status: 401,
				statusText: "Unauthorized",
				text: () => Promise.resolve(JSON.stringify({ error: "kicked_out" })),
			} as Response;

			mockFetch.mockResolvedValue(mockResponse);
			await request("/test").catch(() => {});
			expect(mockNotifyError).toHaveBeenCalled();
		});
	});
});
