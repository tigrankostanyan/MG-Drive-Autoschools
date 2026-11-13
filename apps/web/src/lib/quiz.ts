import type { ReviewFilter } from "@/features/tests";
import type { QuestionData, QuestionOptions } from "./api";
import { getQuestionImageUrl } from "./media";
import { toPercent } from "./utils";

const PERCENT_MAX = 100;

export const TEST_MINUTES = 30;
export const TEST_TOTAL_SECONDS = TEST_MINUTES * 60;

export const PASS_THRESHOLD_PERCENT = 80;
export const MAX_ANSWER_CHANGES = 3;

export type CardQuestion = {
	id: number;
	text: string;
	options: string[];
	correct: number;
	explanation: string;
	imageUrl?: string | null;
	number: number;
};

// Reveal data for a single question, only available after server-side grading.
export type AnswerReveal = {
	correctAnswerIndex: number;
	explanation?: string | undefined;
};

export type RevealMap = Record<number, AnswerReveal>;

export function normalizeQuestionOptions(options: QuestionOptions | undefined): string[] {
	let parsed: unknown = options;
	if (typeof parsed === "string") {
		try {
			parsed = JSON.parse(parsed);
		} catch {
			return [];
		}
	}
	if (!Array.isArray(parsed)) return [];
	return parsed.map((entry: unknown) => {
		if (typeof entry === "string") return entry;
		if (entry === null) return "";
		if (typeof entry === "object") {
			const { hy, text } = entry as { hy?: unknown; text?: unknown };
			const localized = typeof hy === "string" ? hy : "";
			const fallback = typeof text === "string" ? text : "";
			return localized || fallback || "";
		}
		return String(entry);
	});
}

export function normalizeQuestion(q: QuestionData): QuestionData {
	const imageFile = q.files?.find((f) => f.name_used === "question_img") ?? q.files?.[0];
	return {
		...q,
		imageUrl: getQuestionImageUrl(imageFile, "large"),
	};
}

export function toCardQuestion(q: QuestionData, idx: number, reveal?: AnswerReveal): CardQuestion {
	const imageFile = q.files?.find((f) => f.name_used === "question_img") ?? q.files?.[0];
	const correctAnswerIndex = reveal?.correctAnswerIndex ?? q.correctAnswerIndex;
	return {
		id: q.id,
		text: q.question,
		options: normalizeQuestionOptions(q.options),
		correct: correctAnswerIndex === undefined ? -1 : correctAnswerIndex - 1,
		explanation: reveal?.explanation ?? q.explanation ?? "",
		imageUrl: getQuestionImageUrl(imageFile, "large"),
		number: idx + 1,
	};
}

export type ReviewedQuestion = { q: QuestionData; originalIndex: number };

export function isAnswerCorrect(
	q: QuestionData,
	answers: Record<number, number>,
	reveal?: AnswerReveal,
): boolean {
	const correctAnswerIndex = reveal?.correctAnswerIndex ?? q.correctAnswerIndex;
	if (correctAnswerIndex === undefined) return false;
	return answers[q.id] === correctAnswerIndex - 1;
}

export function countCorrect(
	questions: QuestionData[],
	answers: Record<number, number>,
	revealMap?: RevealMap,
): number {
	return questions.filter((q) => isAnswerCorrect(q, answers, revealMap?.[q.id])).length;
}

export function isTestPassed(correct: number, total: number): boolean {
	return total > 0 && correct >= total * (PASS_THRESHOLD_PERCENT / PERCENT_MAX);
}

export function formatTimeSpent(totalSeconds: number): string {
	const minutes = Math.floor(totalSeconds / 60);
	const seconds = totalSeconds % 60;
	return `${minutes > 0 ? `${minutes} ռ ` : ""}${seconds} վրկ`;
}

export function filterReviewQuestions(
	questions: QuestionData[],
	answers: Record<number, number>,
	filter: ReviewFilter,
): ReviewedQuestion[] {
	return questions
		.map((q, originalIndex) => ({ q, originalIndex }))
		.filter(({ q }) => {
			if (filter === "all") return true;
			const isAnswered = answers[q.id] !== undefined;
			const isCorrect = isAnswered && isAnswerCorrect(q, answers);
			return filter === "correct" ? isCorrect : !isCorrect;
		});
}

export function findNextTest<T extends { id: number }>(
	allTests: T[] | undefined,
	currentId: number | undefined,
): T | null {
	const list = allTests ?? [];
	const idx = list.findIndex((t) => t.id === currentId);
	if (idx >= 0 && idx < list.length - 1) return list[idx + 1] ?? null;
	return null;
}

export type TestResultPayload = {
	testId: number;
	score: number;
	correct_count: number;
	wrong_count: number;
	time_spent: number;
	status: string;
};

export function buildTestResult(input: {
	testId: number;
	questions: QuestionData[];
	answers: Record<number, number>;
	totalSeconds: number;
	timeLeftSeconds: number;
}): TestResultPayload {
	const correct = countCorrect(input.questions, input.answers);
	const wrong = Object.keys(input.answers).length - correct;
	const total = input.questions.length;
	return {
		testId: input.testId,
		score: toPercent(correct, total),
		correct_count: correct,
		wrong_count: wrong > 0 ? wrong : 0,
		time_spent: input.totalSeconds - input.timeLeftSeconds,
		status: isTestPassed(correct, total) ? "passed" : "failed",
	};
}
