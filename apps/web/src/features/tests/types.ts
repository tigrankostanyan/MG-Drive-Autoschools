export type ReviewFilter = "all" | "correct" | "incorrect";

export type QuestionForm = {
	question: string;
	correctAnswerIndex: number;
	number: number;
	options: string[];
};

import type { QuestionData } from "@/lib/api/types";

export interface TestRunnerLoaderData {
	test: { id: number; title: string; number: number; slug: string };
	questions: QuestionData[];
	allTests: { id: number; title: string; number: number; slug: string }[];
}

export interface SecureTestRunnerLoaderData {
	test: { id: number; title: string; number: number; slug: string };
	questionCount: number;
	timeLimitSeconds: number;
	sessionId: string;
}
