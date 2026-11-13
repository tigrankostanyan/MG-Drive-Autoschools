import type { z } from "zod";
import { getQuestionImageUrl } from "@/lib/media";
import { PAGE_LIMIT_MAX, pageQuery } from "./query";
import { request } from "./request";
import { testsResponseSchema } from "./resource-schemas";
import { testDataSchema, testResponseSchema, testSessionResponseSchema } from "./schemas";
import { questionStreamResponseSchema, testSubmissionResultSchema } from "./test-schemas";
import type { FileItem, QuestionData, TestData } from "./types";

// LEGACY API (kept for backward compatibility - consider deprecating)

const TESTS_MAX_PAGES = 20;

export async function fetchTests(page = 1, limit = PAGE_LIMIT_MAX): Promise<{ data: TestData[] }> {
	const res = await request<{ tests: TestData[] }>(
		`/tests${pageQuery(page, limit)}`,
		undefined,
		testsResponseSchema(testDataSchema),
	);
	return { data: res.tests ?? [] };
}

export async function fetchAllTests(): Promise<{ data: TestData[] }> {
	const data: TestData[] = [];
	for (let page = 1; page <= TESTS_MAX_PAGES; page += 1) {
		const res = await fetchTests(page, PAGE_LIMIT_MAX);
		data.push(...res.data);
		if (res.data.length < PAGE_LIMIT_MAX) break;
	}
	return { data };
}

export async function fetchTest(
	id: number | string,
): Promise<{ data: TestData & { questions?: QuestionData[] } }> {
	const res = await request<{
		status?: string;
		test: TestData & { questions?: QuestionData[] };
	}>(`/tests/${id}`, undefined, testResponseSchema);
	return { data: res.test };
}

export async function createTestSession(testId: number): Promise<{
	data: z.infer<typeof testSessionResponseSchema>;
}> {
	const res = await request<z.infer<typeof testSessionResponseSchema>>(
		"/tests/session",
		{
			method: "POST",
			body: JSON.stringify({ testId }),
		},
		testSessionResponseSchema,
	);

	return {
		data: {
			sessionId: res.sessionId,
			testId: res.testId,
			questionCount: res.questionCount,
			timeLimitSeconds: res.timeLimitSeconds,
		},
	};
}

export async function fetchTestQuestion(
	sessionId: string,
	questionIndex: number,
): Promise<{
	data: z.infer<typeof questionStreamResponseSchema>;
}> {
	const res = await request<z.infer<typeof questionStreamResponseSchema>>(
		`/tests/session/${sessionId}/question/${questionIndex}`,
		undefined,
		questionStreamResponseSchema,
	);

	const imageFile =
		res.question.files?.find((f) => f.name_used === "question_img") ?? res.question.files?.[0];
	const imageUrl =
		res.question.image || getQuestionImageUrl(imageFile as FileItem | undefined, "large");

	return {
		data: {
			question: {
				...res.question,
				imageUrl: imageUrl,
			},
			nextQuestionIndex: res.nextQuestionIndex,
			hasNext: res.hasNext,
		},
	};
}

export async function submitTestSession(
	sessionId: string,
	testId: number,
	answers: Record<number, number>,
	timeSpent: number,
): Promise<{ data: z.infer<typeof testSubmissionResultSchema> }> {
	const res = await request<z.infer<typeof testSubmissionResultSchema>>(
		`/tests/session/${sessionId}/submit`,
		{
			method: "POST",
			body: JSON.stringify({
				sessionId,
				testId,
				answers,
				timeSpent,
			}),
		},
		testSubmissionResultSchema,
	);

	return { data: res };
}

// Cancel a test session (cleanup on abandon)
export async function cancelTestSession(sessionId: string): Promise<{ status: string }> {
	return request<{ status: string }>(`/tests/session/${sessionId}`, {
		method: "DELETE",
	});
}

// LEGACY TEST SUBMISSION (keep for other flows)

export async function submitTestResult(payload: {
	testId?: number;
	groupId?: number;
	score: number;
	correct_count: number;
	wrong_count: number;
	time_spent: number;
	status: string;
}) {
	return request<{
		status: string;
		saved?: boolean;
		result?: unknown;
		message?: string;
	}>("/tests/submit", {
		method: "POST",
		body: JSON.stringify(payload),
	});
}

export async function createTest(body: { title: string }): Promise<{ data: TestData }> {
	const res = await request<{ status?: string; test: TestData }>("/tests", {
		method: "POST",
		body: JSON.stringify(body),
	});
	return { data: res.test };
}

export async function updateTest(
	id: number | string,
	body: { title?: string },
): Promise<{ data: TestData }> {
	const res = await request<{ status?: string; test: TestData }>(`/tests/${id}`, {
		method: "PATCH",
		body: JSON.stringify(body),
	});
	return { data: res.test };
}

export async function deleteTest(id: number | string) {
	return request<unknown>(`/tests/${id}`, { method: "DELETE" });
}
