import { getQuestionImageUrl, request } from "./client";
import { fetchAllPages, PAGE_LIMIT_MAX, pageQuery } from "./query";
import { dataListResponseSchema, paginatedResponseSchema } from "./resource-schemas";
import {
	answerCheckResponseSchema,
	groupDataSchema,
	groupProgressResponseSchema,
	groupQuestionsResponseSchema,
} from "./schemas";
import type { AnswerCheckResult, GroupData, Paginated, QuestionData } from "./types";

export async function fetchGroups(page = 1, limit = PAGE_LIMIT_MAX): Promise<Paginated<GroupData>> {
	return request<Paginated<GroupData>>(
		`/groups${pageQuery(page, limit)}`,
		undefined,
		paginatedResponseSchema(groupDataSchema),
	);
}

// Every group across pages
export async function fetchAllGroups(): Promise<{ data: GroupData[] }> {
	return { data: await fetchAllPages(fetchGroups) };
}

// Lightweight list (no nested questions) used by the admin shell
export async function fetchGroupMetadata(): Promise<{ data: GroupData[] }> {
	const res = await request<{ data: GroupData[] }>(
		"/groups/metadata",
		undefined,
		dataListResponseSchema(groupDataSchema),
	);
	return { data: res.data ?? [] };
}

export async function fetchGroup(id: number | string): Promise<{ data: GroupData }> {
	const res = await request<{ status?: string; group: GroupData }>(`/groups/${id}`, undefined);
	return { data: res.group };
}

export async function fetchGroupQuestions(
	id: number | string,
	page = 1,
	limit = 20,
): Promise<{ questions: QuestionData[]; total: number }> {
	type GroupQuestionsResponse = {
		status?: string;
		data: {
			total: number;
			questions: QuestionData[];
		};
	};
	const res = await request<GroupQuestionsResponse>(
		`/groups/${id}/questions${pageQuery(page, limit)}`,
		undefined,
		groupQuestionsResponseSchema,
	);
	const questions = (res.data?.questions ?? []).map((q) => ({
		...q,
		imageUrl: getQuestionImageUrl(
			q.files?.find((f) => f.name_used === "question_img") ?? q.files?.[0],
			"large",
		),
	}));
	return { questions, total: res.data?.total ?? 0 };
}

export async function saveGroupProgress(id: number | string, answers: Record<number, number>) {
	return request<{ status?: string }>(`/groups/${id}/progress`, {
		method: "POST",
		body: JSON.stringify({ answers }),
	});
}

export async function fetchGroupProgress(
	id: number | string,
): Promise<{ data: Record<string, number> }> {
	type GroupProgressResponse = {
		status?: string;
		answers: Record<string, number>;
	};
	const res = await request<GroupProgressResponse>(
		`/groups/${id}/progress`,
		undefined,
		groupProgressResponseSchema,
	);
	return { data: res.answers ?? {} };
}

// Server-side grading: the correct answers never reach the client until the
// student submits their answers for a group.
export async function checkGroupAnswers(
	id: number | string,
	answers: Record<number, number>,
): Promise<AnswerCheckResult[]> {
	const res = await request<{ status?: string; results: AnswerCheckResult[] }>(
		`/groups/${id}/check`,
		{ method: "POST", body: JSON.stringify({ answers }) },
		answerCheckResponseSchema,
	);
	return res.results ?? [];
}

export async function createGroup(body: {
	title: string;
	text?: string;
}): Promise<{ data: GroupData }> {
	type CreateGroupResponse = { status?: string; group: GroupData };
	const res = await request<CreateGroupResponse>("/groups", {
		method: "POST",
		body: JSON.stringify(body),
	});
	return { data: res.group };
}

export async function updateGroup(
	id: number | string,
	body: { title?: string; text?: string },
): Promise<{ data: GroupData }> {
	type UpdateGroupResponse = { status?: string; group: GroupData };
	const res = await request<UpdateGroupResponse>(`/groups/${id}`, {
		method: "PATCH",
		body: JSON.stringify(body),
	});
	return { data: res.group };
}

export async function deleteGroup(id: number | string) {
	return request<unknown>(`/groups/${id}`, { method: "DELETE" });
}

export async function reorderGroups(groupIds: number[]) {
	return request<{ status?: string }>(`/groups/reorder`, {
		method: "PATCH",
		body: JSON.stringify({ groupIds }),
	});
}
