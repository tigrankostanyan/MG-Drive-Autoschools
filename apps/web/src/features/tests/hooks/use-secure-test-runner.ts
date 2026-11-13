import { useCallback, useEffect, useMemo, useState } from "react";
import { useCountdown } from "@/hooks/use-countdown";
import { fetchTestQuestion, submitTestSession } from "@/lib/api/tests";
import type { QuestionView, TestSubmissionResult } from "@/lib/api/types";
import { logger } from "@/lib/observability/logger";
import type { SecureTestRunnerLoaderData } from "../types";

export interface SecureTestRunnerReturn {
	current: number;
	question: QuestionView | null;
	questions: QuestionView[];
	answers: Record<number, number>;
	finished: boolean;
	isSubmitting: boolean;
	isSubmitted: boolean;
	score: number;
	correctCount: number;
	wrongCount: number;
	isPassed: boolean;
	mm: string;
	ss: string;
	formattedTimeSpent: string;
	selectAnswer: (questionIndex: number, optionIndex: number) => void;
	finishRun: () => void;
	submitResult: () => Promise<TestSubmissionResult>;
	reset: () => void;
	goPrevious: () => void;
	goNext: () => void;
	loadingQuestion: boolean;
	error: string | null;
}

export function useSecureTestRunner(
	loaderData: SecureTestRunnerLoaderData,
): SecureTestRunnerReturn {
	const { test, sessionId, questionCount, timeLimitSeconds } = loaderData;

	const [questions, setQuestions] = useState<QuestionView[]>([]);
	const [current, setCurrent] = useState(0);
	const [answers, setAnswers] = useState<Record<number, number>>({});
	const [finished, setFinished] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isSubmitted, setIsSubmitted] = useState(false);
	const [loadingQuestion, setLoadingQuestion] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const { secondsLeft: left, setSecondsLeft } = useCountdown(timeLimitSeconds, !finished, () => {
		setFinished(true);
	});

	const currentQuestion = questions[current] ?? null;

	const fetchQuestion = useCallback(
		async (index: number) => {
			if (index >= questions.length) {
				setLoadingQuestion(true);
				setError(null);
				try {
					const { data } = await fetchTestQuestion(sessionId, index);
					const newQuestion: QuestionView = data.question as QuestionView;

					setQuestions((prev) => {
						const newQuestions = [...prev];
						newQuestions[index] = newQuestion;
						return newQuestions;
					});
				} catch (err) {
					logger.error("test_runner.question_fetch_failed", "Question fetch error", { error: err });
					setError(err instanceof Error ? err.message : "Unknown error");
				} finally {
					setLoadingQuestion(false);
				}
			}
		},
		[sessionId, questions.length],
	);

	useEffect(() => {
		if (!finished && current < questionCount) {
			fetchQuestion(current);
			if (current + 1 < questionCount) {
				fetchQuestion(current + 1);
			}
		}
	}, [current, finished, questionCount, fetchQuestion]);

	const selectAnswer = useCallback((questionIndex: number, optionIndex: number) => {
		setAnswers((a) => ({ ...a, [questionIndex]: optionIndex }));
	}, []);

	const goPrevious = useCallback(() => {
		if (current > 0) setCurrent((c) => c - 1);
	}, [current]);

	const goNext = useCallback(() => {
		if (current < questions.length - 1) setCurrent((c) => c + 1);
	}, [questions.length]);

	const finishRun = useCallback(() => {
		setFinished(true);
	}, []);

	const submitResult = useCallback(async () => {
		if (isSubmitting || isSubmitted) {
			return {
				saved: false,
				score: 0,
				correctCount: 0,
				wrongCount: 0,
				passed: false,
				status: "error" as "error",
			};
		}

		setIsSubmitting(true);
		setError(null);

		try {
			const timeSpent = timeLimitSeconds - left;
			const result = await submitTestSession(sessionId, test.id, answers, timeSpent);
			const data: TestSubmissionResult = result.data;
			setIsSubmitted(true);
			return data;
		} catch (err) {
			const msg = err instanceof Error ? err.message : "Unknown error";
			setError(msg);
			throw err;
		} finally {
			setIsSubmitting(false);
		}
	}, [sessionId, test.id, answers, timeLimitSeconds, left, isSubmitting, isSubmitted]);

	const reset = useCallback(() => {
		setCurrent(0);
		setAnswers({});
		setFinished(false);
		setIsSubmitted(false);
		setQuestions([]);
		setError(null);
		setSecondsLeft(timeLimitSeconds);
	}, [timeLimitSeconds, setSecondsLeft]);

	useEffect(() => {
		reset();
	}, [test.id, reset]);

	const mm = String(Math.floor(left / 60)).padStart(2, "0");
	const ss = String(left % 60).padStart(2, "0");
	const timeSpentSeconds = timeLimitSeconds - left;
	const formattedTimeSpent = useMemo(() => {
		const total = Math.max(0, Math.floor(timeSpentSeconds));
		const m = Math.floor(total / 60);
		const s = total % 60;
		return `${m}:${s.toString().padStart(2, "0")}`;
	}, [timeSpentSeconds]);

	const correctCount = useMemo(() => {
		let count = 0;
		for (let i = 0; i < questionCount; i++) {
			if (answers[i] !== undefined) count++;
		}
		return count;
	}, [answers, questionCount]);

	const wrongCount = useMemo(
		() => Object.keys(answers).length - correctCount,
		[answers, correctCount],
	);

	const isPassed = useMemo(() => wrongCount <= questionCount * 0.2, [wrongCount, questionCount]);

	return {
		current,
		question: currentQuestion,
		questions,
		answers,
		finished,
		isSubmitting,
		isSubmitted,
		score: 0,
		correctCount,
		wrongCount,
		isPassed,
		mm,
		ss,
		formattedTimeSpent,
		selectAnswer,
		finishRun,
		submitResult,
		reset,
		goPrevious,
		goNext,
		loadingQuestion: loadingQuestion || (questions.length === 0 && current === 0),
		error,
	};
}
