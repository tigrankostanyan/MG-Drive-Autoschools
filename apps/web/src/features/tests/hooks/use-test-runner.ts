import type { Dispatch, SetStateAction } from "react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useCountdown } from "@/hooks/use-countdown";
import type { QuestionData, TestData } from "@/lib/api/types";
import {
	filterReviewQuestions,
	findNextTest,
	MAX_ANSWER_CHANGES,
	TEST_TOTAL_SECONDS,
} from "@/lib/quiz";
import type { ReviewFilter, TestRunnerLoaderData } from "../types";
import { useTestResults } from "./use-test-results";

export type { TestRunnerLoaderData } from "../types";

export interface TestRunnerReturn {
	test: TestData;
	questions: QuestionData[];
	current: number;
	setCurrent: Dispatch<SetStateAction<number>>;
	answers: Record<number, number>;
	answerChanges: Record<number, number>;
	finished: boolean;
	hasStarted: boolean;
	left: number;
	askSave: boolean;
	isSaving: boolean;
	isSaved: boolean;
	reviewFilter: ReviewFilter;
	setReviewFilter: (filter: ReviewFilter) => void;
	handleSaveResult: (save: boolean) => void;
	correctCount: number;
	wrongCount: number;
	isPassed: boolean;
	formattedTimeSpent: string;
	mm: string;
	ss: string;
	question: QuestionData | undefined;
	nextTest: TestData | null;
	filteredQuestions: { q: QuestionData; originalIndex: number }[];
	finishRun: () => void;
	selectAnswer: (questionId: number, optionIndex: number) => void;
	reset: () => void;
}

export function useTestRunner(loaderData: TestRunnerLoaderData): TestRunnerReturn {
	const test = loaderData.test;
	const questions = loaderData.questions;

	const [current, setCurrent] = useState(0);
	const [answers, setAnswers] = useState<Record<number, number>>({});
	const [answerChanges, setAnswerChanges] = useState<Record<number, number>>({});
	const [hasStarted, setHasStarted] = useState(false);
	const [finished, setFinished] = useState(false);
	const [askSave, setAskSave] = useState(false);
	const [reviewFilter, setReviewFilter] = useState<ReviewFilter>("all");

	const { secondsLeft: left, setSecondsLeft } = useCountdown(
		TEST_TOTAL_SECONDS,
		hasStarted && !finished,
		() => {
			setFinished(true);
			setAskSave(true);
		},
	);

	const { isSaving, isSaved, setIsSaved, handleSaveResult, correctCount, wrongCount, isPassed } =
		useTestResults({
			testId: test?.id,
			questions,
			answers,
			totalSeconds: TEST_TOTAL_SECONDS,
			timeLeftSeconds: left,
			setAskSave,
		});

	const reset = useCallback(() => {
		setCurrent(0);
		setAnswers({});
		setAnswerChanges({});
		setHasStarted(false);
		setFinished(false);
		setSecondsLeft(TEST_TOTAL_SECONDS);
		setAskSave(false);
		setIsSaved(false);
		setReviewFilter("all");
	}, [setSecondsLeft, setIsSaved]);

	useEffect(() => {
		reset();
	}, [reset]);

	const mm = String(Math.floor(left / 60)).padStart(2, "0");
	const ss = String(left % 60).padStart(2, "0");
	const formattedTimeSpent = `${mm}:${ss}`;
	const question = questions[current];

	const nextTest = useMemo(
		() => findNextTest(loaderData.allTests, test?.id),
		[loaderData.allTests, test?.id],
	);

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Enter") {
				if (!finished && question && answers[question.id] !== undefined) {
					if (current === questions.length - 1) {
						setFinished(true);
						setAskSave(true);
					} else {
						setCurrent((c) => c + 1);
					}
				}
			}
		};
		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [finished, question, answers, current, questions.length]);

	const filteredQuestions = useMemo(
		() => filterReviewQuestions(questions, answers, reviewFilter),
		[questions, answers, reviewFilter],
	);

	const finishRun = () => {
		setFinished(true);
		setAskSave(true);
	};

	const selectAnswer = (questionId: number, idx: number) => {
		if (!hasStarted) {
			setHasStarted(true);
		}

		const currentAnswer = answers[questionId];
		const changesUsed = answerChanges[questionId] ?? 0;

		// Same option selected again: do nothing
		if (currentAnswer === idx) return;

		// If already answered previously and reached maximum changes, ignore
		if (currentAnswer !== undefined && changesUsed >= MAX_ANSWER_CHANGES) {
			return;
		}

		// If this is a change from an existing answer, increment change count
		if (currentAnswer !== undefined) {
			setAnswerChanges((prev) => ({
				...prev,
				[questionId]: (prev[questionId] ?? 0) + 1,
			}));
		}

		setAnswers((a) => ({ ...a, [questionId]: idx }));
	};

	return {
		test,
		questions,
		current,
		setCurrent,
		answers,
		answerChanges,
		finished,
		hasStarted,
		left,
		askSave,
		isSaving,
		isSaved,
		reviewFilter,
		setReviewFilter,
		handleSaveResult,
		correctCount,
		wrongCount,
		isPassed,
		formattedTimeSpent,
		mm,
		ss,
		question,
		nextTest,
		filteredQuestions,
		finishRun,
		selectAnswer,
		reset,
	};
}
