import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ReviewFilter } from "@/features/tests";
import type { QuestionData, TestData } from "@/lib/api/types";
import { TestResultsReviewSection } from "./TestResultsReviewSection";
import { TestResultsSummaryCard } from "./TestResultsSummaryCard";

interface TestResultsScreenProps {
	test: TestData;
	questions: QuestionData[];
	answers: Record<number, number>;
	filteredQuestions: { q: QuestionData; originalIndex: number }[];
	correctCount: number;
	wrongCount: number;
	isPassed: boolean;
	formattedTimeSpent: string;
	askSave: boolean;
	isSaving: boolean;
	isSaved: boolean;
	nextTest: TestData | null;
	reviewFilter: ReviewFilter;
	onReviewFilterChange: (filter: ReviewFilter) => void;
	onSaveResult: (save: boolean) => void;
	onRetry: () => void;
}

export function TestResultsScreen({
	test,
	questions,
	answers,
	filteredQuestions,
	correctCount,
	wrongCount,
	isPassed,
	formattedTimeSpent,
	askSave,
	isSaving,
	isSaved,
	nextTest,
	reviewFilter,
	onReviewFilterChange,
	onSaveResult,
	onRetry,
}: TestResultsScreenProps) {
	return (
		<div className="w-full min-h-[calc(100dvh-4.5rem)] sm:min-h-[calc(100dvh-5rem)] bg-[#F8FAFC] dark:bg-[#0B0F19] py-4 sm:py-10 px-4 sm:px-6 lg:px-8">
			<div className="w-full max-w-[1400px] mx-auto space-y-6 sm:space-y-10">
				{/* Top Bar Navigation */}
				<div className="flex items-center justify-between">
					<Button
						asChild
						variant="outline"
						size="sm"
						className="rounded-xl border-slate-200 dark:border-slate-800 shadow-xs bg-white dark:bg-slate-900 h-9 px-3 text-xs sm:text-sm"
					>
						<Link to="/tests">
							<ArrowLeft className="size-3.5 sm:size-4 mr-1.5 sm:mr-2" />
							Թեստեր
						</Link>
					</Button>

					<h3 className="text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400">
						{test.title}
					</h3>
				</div>

				<TestResultsSummaryCard
					testTitle={test.title}
					totalQuestions={questions.length}
					correctCount={correctCount}
					wrongCount={wrongCount}
					isPassed={isPassed}
					formattedTimeSpent={formattedTimeSpent}
					askSave={askSave}
					isSaving={isSaving}
					isSaved={isSaved}
					nextTest={nextTest}
					onSaveResult={onSaveResult}
					onRetry={onRetry}
				/>

				<TestResultsReviewSection
					questions={questions}
					answers={answers}
					filteredQuestions={filteredQuestions}
					correctCount={correctCount}
					wrongCount={wrongCount}
					reviewFilter={reviewFilter}
					onReviewFilterChange={onReviewFilterChange}
				/>
			</div>
		</div>
	);
}
