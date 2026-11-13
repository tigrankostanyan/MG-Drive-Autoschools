import { request } from "./client";
import { dashboardAnalyticsResponseSchema } from "./resource-schemas";

export interface ActivityData {
	date: string;
	tests: number;
	passes: number;
}

export interface CategoryData {
	name: string;
	value: number;
	color: string;
}

export interface AnalyticsResponse {
	activityData: ActivityData[];
	categoryData: CategoryData[];
}

export interface StudentAnalyticsResultItem {
	id: number;
	testId?: number | null;
	groupId?: number | null;
	title: string;
	type: "test" | "group";
	score: number;
	correct_count?: number;
	wrong_count?: number;
	time_spent?: number;
	status: string;
	date: string;
}

export interface StudentAnalyticsItem {
	id: number;
	name: string;
	email: string;
	phone?: string;
	avatar?: string | null;
	groupId?: number | null;
	groupTitle?: string | null;
	include_in_analytics: boolean;
	attempts: number;
	scores: number[];
	testScores: number[];
	groupScores: number[];
	latestScore: number;
	avgScore: number;
	growth: number;
	testGrowth: number;
	groupGrowth: number;
	status: "risk" | "improving" | "stagnant";
	totalCorrect: number;
	totalWrong: number;
	testAttempts: number;
	groupAttempts: number;
	recentResults: StudentAnalyticsResultItem[];
}

export interface StudentAnalyticsSummary {
	tests: {
		count: number;
		avgGrowth: number;
		mistakes: number;
	};
	groups: {
		count: number;
		avgGrowth: number;
		mistakes: number;
	};
	overall: {
		attempts: number;
		avgScore: number;
		mistakes: number;
		passRate: number;
	};
	counts: {
		total: number;
		active: number;
		improving: number;
		risk: number;
		stagnant: number;
	};
}

export interface StudentAnalyticsResponse {
	students: StudentAnalyticsItem[];
	summary: StudentAnalyticsSummary;
}

export async function fetchDashboardAnalytics(): Promise<AnalyticsResponse> {
	const { data } = await request<{ data: AnalyticsResponse }>(
		"/admin/analytics",
		undefined,
		dashboardAnalyticsResponseSchema,
	);
	return data;
}

export async function fetchStudentAnalytics(params?: {
	groupId?: number | string;
	search?: string;
	status?: string;
}): Promise<StudentAnalyticsResponse> {
	const query = new URLSearchParams();
	if (params?.groupId && params.groupId !== "all") {
		query.set("groupId", String(params.groupId));
	}
	if (params?.search?.trim()) {
		query.set("search", params.search.trim());
	}
	if (params?.status && params.status !== "all") {
		query.set("status", params.status);
	}

	const qs = query.toString();
	const path = qs ? `/admin/analytics/students?${qs}` : "/admin/analytics/students";
	const res = await request<{ data: StudentAnalyticsResponse }>(path);
	return res.data;
}

export async function toggleStudentAnalytics(
	studentId: number,
	include?: boolean,
): Promise<{ id: number; include_in_analytics: boolean }> {
	const res = await request<{ data: { id: number; include_in_analytics: boolean } }>(
		`/admin/analytics/students/${studentId}/toggle`,
		{
			method: "PATCH",
			body: JSON.stringify(typeof include === "boolean" ? { include } : {}),
		},
	);
	return res.data;
}

export async function bulkToggleStudentAnalytics(body: {
	include: boolean;
	groupId?: number | string | undefined;
	userIds?: number[] | undefined;
}): Promise<{ status: string; include: boolean }> {
	return request<{ status: string; include: boolean }>("/admin/analytics/students/bulk-toggle", {
		method: "POST",
		body: JSON.stringify(body),
	});
}
