import { request } from "./client";
import { questionsResponseSchema } from "./resource-schemas";
import type { QuestionData } from "./types";

/**
 * `/question` returns the entire set with no pagination, so a burst of callers
 * (admin shell + editors) would otherwise re-download it each time. A short TTL
 * plus in-flight sharing keeps that to one request per burst.
 */
const QUESTIONS_CACHE_TTL_MS = 3_000;

let questionsCache: { data: QuestionData[]; expiresAt: number } | null = null;
let questionsInflight: Promise<QuestionData[]> | null = null;

function invalidateQuestionsCache() {
	questionsCache = null;
}

async function loadAllQuestions(): Promise<QuestionData[]> {
	if (questionsCache && questionsCache.expiresAt > Date.now()) {
		return questionsCache.data;
	}
	if (questionsInflight) return questionsInflight;
	questionsInflight = request<{ questions: QuestionData[] }>(
		"/question",
		undefined,
		questionsResponseSchema,
	)
		.then((res) => {
			const data = res.questions ?? [];
			questionsCache = {
				data,
				expiresAt: Date.now() + QUESTIONS_CACHE_TTL_MS,
			};
			return data;
		})
		.finally(() => {
			questionsInflight = null;
		});
	return questionsInflight;
}

export async function createQuestion(body: {
	row_id: number;
	table_name: string;
	question: string;
	correctAnswerIndex: number;
	number: number;
	options: string[];
}): Promise<{ data: QuestionData }> {
	const res = await request<{ status: string; question: QuestionData }>("/question", {
		method: "POST",
		body: JSON.stringify(body),
	});
	invalidateQuestionsCache();
	return { data: res.question };
}
export async function updateQuestion(
	id: number | string,
	body: {
		question?: string;
		correctAnswerIndex?: number;
		number?: number;
		options?: string[];
	},
): Promise<{ data: QuestionData }> {
	const res = await request<{ status: string; question: QuestionData }>(`/question/${id}`, {
		method: "PATCH",
		body: JSON.stringify(body),
	});
	invalidateQuestionsCache();
	return { data: res.question };
}
export async function deleteQuestion(id: number | string) {
	const res = await request<{ message?: string }>(`/question/${id}`, {
		method: "DELETE",
	});
	invalidateQuestionsCache();
	return res;
}
export async function reorderQuestions(tableName: string, rowId: number, questionIds: number[]) {
	const res = await request<{ status: string; message: string }>(`/question/reorder`, {
		method: "POST",
		body: JSON.stringify({ tableName, rowId, questionIds }),
	});
	invalidateQuestionsCache();
	return res;
}
/**
 * Questions for one owning row. The API cannot filter server-side, so the
 * shared full set is fetched once and filtered in memory.
 */
export async function fetchQuestions(
	row_id: number,
	table_name: string,
): Promise<{ data: QuestionData[] }> {
	const questions = await loadAllQuestions();
	return {
		data: questions.filter((q) => q.row_id === row_id && q.table_name === table_name),
	};
}
