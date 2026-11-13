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

describe("useProfileData - edge cases", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	it("should return null for profile when user has no phone", async () => {
		mockFetchProfile.mockResolvedValue({
			user: {
				id: 1,
				name: "Test User",
				email: "test@example.com",
				role: "user",
				phone: null,
			},
			stats: {
				totalTests: 0,
				passedTests: 0,
				failedTests: 0,
				avgScore: 0,
				progressPercent: 0,
				totalGroups: 0,
				completedGroups: 0,
			},
			results: [],
		});

		mockFetchProfileProgress.mockResolvedValue({
			progressPercent: 0,
			completedGroups: 0,
			totalGroups: 0,
			groups: [],
		});

		const { result } = renderHook(() => useProfileData(), { wrapper: createWrapper });

		await waitFor(() => {
			expect(result.current.loading).toBe(false);
		});

		expect(result.current.profile?.user.phone).toBeNull();
	});
});
