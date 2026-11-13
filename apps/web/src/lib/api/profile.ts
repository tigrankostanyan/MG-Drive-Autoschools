import { request } from "./client";
import { profileProgressResponseSchema, profileResponseSchema } from "./schemas";
import type {
	ProfileCompletedTopic,
	ProfileData,
	ProfileFeedback,
	ProfileProgress,
	ProfileProgressGroup,
	ProfileResult,
} from "./types";

export type {
	ProfileCompletedTopic,
	ProfileData,
	ProfileFeedback,
	ProfileProgress,
	ProfileProgressGroup,
	ProfileResult,
};

export type ProfileStats = {
	totalTests: number;
	passedTests: number;
	failedTests: number;
	avgScore: number;
	progressPercent: number;
	totalGroups: number;
	completedGroups: number;
};

export async function fetchProfile(opts?: { signal?: AbortSignal }): Promise<ProfileData> {
	type ProfileResponse = { status?: string; data: ProfileData };
	const res = await request<ProfileResponse>(
		"/profile",
		opts?.signal ? { signal: opts.signal } : undefined,
		profileResponseSchema,
	);
	return res.data;
}

export async function fetchProfileProgress(opts?: {
	signal?: AbortSignal;
}): Promise<ProfileProgress> {
	type ProgressResponse = { status?: string; data: ProfileProgress };
	const res = await request<ProgressResponse>(
		"/profile/progress",
		opts?.signal ? { signal: opts.signal } : undefined,
		profileProgressResponseSchema,
	);
	return res.data;
}

/** Format an ISO/Sequelize date as a short, locale-stable `YYYY-MM-DD`. */
export function formatProfileDate(value: string | null | undefined): string {
	if (!value) return "—";
	const date = new Date(value);
	if (Number.isNaN(date.getTime())) return "—";
	return date.toISOString().slice(0, 10);
}
