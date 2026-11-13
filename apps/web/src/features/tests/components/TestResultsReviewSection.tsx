import type { ReviewFilter } from "@/features/tests";
import type { QuestionData } from "@/lib/api/types";
import { toCardQuestion } from "@/lib/quiz";
import { QuestionReviewCard } from "./QuestionReviewCard";

interface TestResultsReviewSectionProps {
	questions: QuestionData[];
	answers: Record<number, number>;
	filteredQuestions: { q: QuestionData; originalIndex: number }[];
	correctCount: number;
	wrongCount: number;
	reviewFilter: ReviewFilter;
	onReviewFilterChange: (filter: ReviewFilter) => void;
}

export function TestResultsReviewSection({
	questions,
	answers,
	filteredQuestions,
	correctCount,
	wrongCount,
	reviewFilter,
	onReviewFilterChange,
}: TestResultsReviewSectionProps) {
	return (
		<>
			{/* Review Filter & Title Section */}
			<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 sm:pt-4">
				<div>
					<h2 className="text-lg sm:text-2xl font-bold text-slate-900 dark:text-slate-100">
						Հարցերի մանրամասն վերլուծություն
					</h2>
					<p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
						Տեսեք յուրաքանչյուր հարցի ձեր պատասխանը և ճիշտ տարբերակը:
					</p>
				</div>

				{/* Review Filter Tabs */}
				<div className="inline-flex p-1 rounded-2xl bg-slate-200/70 dark:bg-slate-800 shrink-0 w-full sm:w-auto">
					<button
						type="button"
						onClick={() => onReviewFilterChange("all")}
						className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
							reviewFilter === "all"
								? "bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xs"
								: "text-slate-600 dark:text-slate-400 hover:text-slate-900"
						}`}
					>
						Բոլորը ({questions.length})
					</button>
					<button
						type="button"
						onClick={() => onReviewFilterChange("correct")}
						className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
							reviewFilter === "correct"
								? "bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-300 shadow-xs"
								: "text-slate-600 dark:text-slate-400 hover:text-slate-900"
						}`}
					>
						Ճիշտ ({correctCount})
					</button>
					<button
						type="button"
						onClick={() => onReviewFilterChange("incorrect")}
						className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
							reviewFilter === "incorrect"
								? "bg-white dark:bg-slate-900 text-rose-700 dark:text-rose-300 shadow-xs"
								: "text-slate-600 dark:text-slate-400 hover:text-slate-900"
						}`}
					>
						Սխալ ({wrongCount})
					</button>
				</div>
			</div>

			{/* Question Review Cards List */}
			<div className="space-y-6 sm:space-y-8">
				{filteredQuestions.length > 0 ? (
					filteredQuestions.map(({ q, originalIndex }) => (
						<QuestionReviewCard
							key={q.id}
							question={toCardQuestion(q, originalIndex)}
							number={originalIndex + 1}
							selectedAnswer={answers[q.id] ?? null}
						/>
					))
				) : (
					<div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-12 text-center text-slate-500 dark:text-slate-400">
						Այս ֆիլտրով հարցեր չկան:
					</div>
				)}
			</div>
		</>
	);
}
