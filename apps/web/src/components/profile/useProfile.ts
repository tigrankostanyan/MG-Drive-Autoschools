import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useRef } from "react";
import { normalizeError } from "@/lib/api/errors";
import type { ProfileData, ProfileProgress } from "@/lib/api/profile";
import { fetchProfile, fetchProfileProgress } from "@/lib/api/profile";

export interface ProfileDataState {
	profile: ProfileData | null;
	progress: ProfileProgress | null;
	loading: boolean;
	error: string | null;
	reload: () => void;
}

/** Query key for profile data - scoped to user */
const PROFILE_QUERY_KEY = ["profile"] as const;

/** Stale time: 1 minute - profile data should be fresh but not too aggressive */
const PROFILE_STALE_TIME = 60_000;

/**
 * Loads profile data using TanStack Query with AbortController support.
 * Proper loading, empty and error states prevent null-profile flashes.
 */
export function useProfileData(): ProfileDataState {
	const controllerRef = useRef<AbortController | null>(null);
	const queryClient = useQueryClient();

	const reload = useCallback(() => {
		queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEY });
	}, [queryClient]);

	const { data, error, isLoading, isError } = useQuery({
		queryKey: PROFILE_QUERY_KEY,
		queryFn: async () => {
			controllerRef.current?.abort();
			controllerRef.current = new AbortController();
			const signal = controllerRef.current.signal;

			try {
				const [profileRes, progressRes] = await Promise.all([
					fetchProfile({ signal }),
					fetchProfileProgress({ signal }),
				]);
				return { profile: profileRes, progress: progressRes };
			} catch (err) {
				if (signal.aborted) {
					// Intentional cancellation – don't surface as a user-facing error.
					// React Query will ignore the result when a newer query supersedes this one.
					return { profile: null, progress: null };
				}
				throw err;
			}
		},
		staleTime: PROFILE_STALE_TIME,
		retry: false,
		// Don't refetch on window focus for profile page
		refetchOnWindowFocus: false,
	});

	// Cleanup on unmount
	useEffect(() => {
		return () => {
			controllerRef.current?.abort();
		};
	}, []);

	return {
		profile: data?.profile ?? null,
		progress: data?.progress ?? null,
		loading: isLoading,
		error: isError ? normalizeError(error).message : null,
		reload,
	};
}
