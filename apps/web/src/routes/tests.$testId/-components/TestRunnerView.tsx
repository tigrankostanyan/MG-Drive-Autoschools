import { type TestRunnerLoaderData, useTestRunner } from "@/features/tests";
import { TestResultsScreen } from "@/features/tests/components/TestResultsScreen";
import { TestRunnerActiveView } from "@/features/tests/components/TestRunnerActiveView";

/** The two test views (results review and active run) for one test. */
export function TestRunnerView({ loaderData }: { loaderData: TestRunnerLoaderData }) {
	const runner = useTestRunner(loaderData);
	const {
		test,
		questions,
		current,
		setCurrent,
		answers,
		answerChanges,
		finished,
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
		nextTest,
		filteredQuestions,
		finishRun,
		selectAnswer,
		reset,
	} = runner;

	// VIEW 1: RESULTS & DETAILED REVIEW SCREEN
	if (finished) {
		return (
			<TestResultsScreen
				test={test}
				questions={questions}
				answers={answers}
				filteredQuestions={filteredQuestions}
				correctCount={correctCount}
				wrongCount={wrongCount}
				isPassed={isPassed}
				formattedTimeSpent={formattedTimeSpent}
				askSave={askSave}
				isSaving={isSaving}
				isSaved={isSaved}
				nextTest={nextTest}
				reviewFilter={reviewFilter}
				onReviewFilterChange={setReviewFilter}
				onSaveResult={handleSaveResult}
				onRetry={reset}
			/>
		);
	}

	// VIEW 2: ACTIVE TEST QUESTION RUNNER
	return (
		<TestRunnerActiveView
			questions={questions}
			current={current}
			setCurrent={setCurrent}
			answers={answers}
			answerChanges={answerChanges}
			left={left}
			mm={mm}
			ss={ss}
			onSelectAnswer={selectAnswer}
			onFinish={finishRun}
		/>
	);
}
