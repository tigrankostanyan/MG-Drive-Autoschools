import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import type * as React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import * as profileApi from "@/lib/api/profile";
import { useProfileData } from "./useProfile";

vi.mock("@/lib/api/profile", () => ({
	fetchProfile: vi.fn(),
	fetchProfileProgress: vi.fn(),
}));

vi.mock("@/lib/api/errors", () => ({
	normalizeError: vi.fn((err) => ({
		message: err?.message || "Unknown error",
		status: err?.status || 500,
		isAuthError: !!(err?.status === 401 || err?.status === 403),
		isNetworkError: err?.status === 0,
		isValidationError: err?.status === 400 || err?.status === 422,
		code: "",
	})),
}));

const mockFetchProfile = vi.mocked(profileApi.fetchProfile);
const mockFetchProfileProgress = vi.mocked(profileApi.fetchProfileProgress);

function createWrapper({ children }: { children: React.ReactNode }) {
	const queryClient = new QueryClient({
		defaultOptions: {
			queries: {
				retry: false,
			},
		},
	});
	return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

describe("useProfileData - interactivity", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockFetchProfile.mockResolvedValue({
			user: {
				id: 1,
				name: "Test User",
				email: "test@example.com",
				role: "user",
				include_in_analytics: true,
				has_paid: true,
			},
			stats: {
				totalTests: 10,
				passedTests: 8,
				failedTests: 2,
				avgScore: 85,
				progressPercent: 80,
				totalGroups: 5,
				completedGroups: 4,
			},
			results: [],
			wrongAnswers: [],
			completedTopics: [],
			feedback: null,
		});

		mockFetchProfileProgress.mockResolvedValue({
			progressPercent: 80,
			completedGroups: 4,
			totalGroups: 5,
			groups: [],
		});
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	it("should reload data when reload is called", async () => {
		const { result } = renderHook(() => useProfileData(), { wrapper: createWrapper });

		await waitFor(() => {
			expect(result.current.loading).toBe(false);
		});

		// Reset mocks to track new calls
		mockFetchProfile.mockClear();
		mockFetchProfileProgress.mockClear();

		result.current.reload();

		await waitFor(() => {
			expect(mockFetchProfile).toHaveBeenCalled();
			expect(mockFetchProfileProgress).toHaveBeenCalled();
		});
	});

	it("should handle aborted requests gracefully", async () => {
		const abortError = new Error("Aborted");
		abortError.name = "AbortError";
		mockFetchProfile.mockRejectedValue(abortError);
		mockFetchProfileProgress.mockRejectedValue(abortError);

		const { result } = renderHook(() => useProfileData(), { wrapper: createWrapper });

		await waitFor(() => {
			// Should not set error for aborted requests
			expect(result.current.loading).toBe(false);
		});
	});

	it("should fetch profile and progress in parallel", async () => {
		const { result } = renderHook(() => useProfileData(), { wrapper: createWrapper });

		await waitFor(() => {
			expect(result.current.loading).toBe(false);
		});

		expect(mockFetchProfile).toHaveBeenCalledTimes(1);
		expect(mockFetchProfileProgress).toHaveBeenCalledTimes(1);
	});

	it("should handle partial success - profile loaded but progress failed", async () => {
		mockFetchProfileProgress.mockRejectedValue(new Error("Progress failed"));

		const { result } = renderHook(() => useProfileData(), { wrapper: createWrapper });

		await waitFor(() => {
			expect(result.current.loading).toBe(false);
		});

		expect(result.current.profile).toBeDefined();
		expect(result.current.progress).toBeNull();
		expect(result.current.error).toBe("Progress failed");
	});
});
