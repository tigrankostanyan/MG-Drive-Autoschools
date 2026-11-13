import { vi } from "vitest";
import type { ZodType } from "zod";

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
	parseJson: vi.fn((res: Response, schema?: ZodType) => {
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
import { fetchCsrfToken, invalidateCsrfCache } from "./csrf";
import { parseErrorBody, parseJson } from "./schemas";
import { getSsrContext } from "./ssr-context";

export const mockClearSessionUser = vi.mocked(clearSessionUser);
export const mockNotifyError = vi.mocked(notify.error);
export const mockFetchCsrfToken = vi.mocked(fetchCsrfToken);
export const mockInvalidateCsrfCache = vi.mocked(invalidateCsrfCache);
export const mockParseErrorBody = vi.mocked(parseErrorBody);
export const mockParseJson = vi.mocked(parseJson);
export const mockGetSsrContext = vi.mocked(getSsrContext);

// Helper to set up global fetch mock
export function setupFetch(mockFetch: ReturnType<typeof vi.fn>) {
	global.fetch = mockFetch as typeof fetch;
}
