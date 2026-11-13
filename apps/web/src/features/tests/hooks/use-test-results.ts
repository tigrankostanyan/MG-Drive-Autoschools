import { useMemo, useState } from "react";
import { toast } from "sonner";
import { useAsyncSubmit } from "@/hooks/use-async-submit";
import { submitTestResult } from "@/lib/api/tests";
import type { QuestionData } from "@/lib/api/types";
import { buildTestResult, countCorrect, isTestPassed } from "@/lib/quiz";

type TestResultsOptions = {
	testId: number | undefined;
	questions: QuestionData[];
	answers: Record<number, number>;
	totalSeconds: number;
	timeLeftSeconds: number;
	setAskSave: (value: boolean) => void;
};

export function useTestResults(opts: TestResultsOptions) {
	const { testId, questions, answers, totalSeconds, timeLeftSeconds, setAskSave } = opts;
	const [isSaved, setIsSaved] = useState(false);

	const { isSubmitting, run } = useAsyncSubmit({
		fallbackError: "Արդյունքը չպահպանվեց. Խնդրում ենք ստուգել ձեր ինտերնետային կապը:",
		onSuccess: () => setIsSaved(true),
		onError: (message) => toast.error(message),
	});

	const handleSaveResult = async (save: boolean) => {
		if (!save) {
			setAskSave(false);
			return;
		}
		if (questions.length === 0 || testId === undefined) return;
		await run(() =>
			submitTestResult(
				buildTestResult({
					testId,
					questions,
					answers,
					totalSeconds,
					timeLeftSeconds,
				}),
			),
		);
		setAskSave(false);
	};

	const correctCount = useMemo(() => countCorrect(questions, answers), [answers, questions]);

	const wrongCount = useMemo(
		() => Math.max(0, Object.keys(answers).length - correctCount),
		[answers, correctCount],
	);

	const isPassed = useMemo(
		() => isTestPassed(correctCount, questions.length),
		[correctCount, questions.length],
	);

	const timeSpentSeconds = totalSeconds - timeLeftSeconds;
	const formattedTimeSpent = useMemo(() => {
		const total = Math.max(0, Math.floor(timeSpentSeconds));
		const m = Math.floor(total / 60);
		const s = total % 60;
		return `${m}:${s.toString().padStart(2, "0")}`;
	}, [timeSpentSeconds]);

	return {
		isSaving: isSubmitting,
		isSaved,
		setIsSaved,
		handleSaveResult,
		correctCount,
		wrongCount,
		isPassed,
		formattedTimeSpent,
	};
}
