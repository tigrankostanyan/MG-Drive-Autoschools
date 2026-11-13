import { Award, CheckCircle2, Timer, XCircle } from "lucide-react";
import type { TestData } from "@/lib/api/types";
import { TEST_MINUTES } from "@/lib/quiz";
import { toPercent } from "@/lib/utils";
import { TestResultsPromptActions } from "./TestResultsPromptActions";

interface TestResultsSummaryCardProps {
	testTitle: string;
	totalQuestions: number;
	correctCount: number;
	wrongCount: number;
	isPassed: boolean;
	formattedTimeSpent: string;
	askSave: boolean;
	isSaving: boolean;
	isSaved: boolean;
	nextTest: TestData | null;
	onSaveResult: (save: boolean) => void;
	onRetry: () => void;
}

export function TestResultsSummaryCard({
	testTitle,
	totalQuestions,
	correctCount,
	wrongCount,
	isPassed,
	formattedTimeSpent,
	askSave,
	isSaving,
	isSaved,
	nextTest,
	onSaveResult,
	onRetry,
}: TestResultsSummaryCardProps) {
	return (
		<div className="bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-xs sm:shadow-sm p-4 sm:p-8 lg:p-10">
			<div className="flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6 pb-6 sm:pb-8 border-b border-slate-100 dark:border-slate-800">
				<div className="space-y-1.5 sm:space-y-2">
					<span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full text-[11px] sm:text-xs font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
						<Award className="size-3.5" />
						Քննության արդյունք
					</span>
					<h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-slate-100">
						{testTitle}
					</h1>
					<p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
						{isPassed
							? "Շնորհավորում ենք, դուք հաջողությամբ հանձնել եք թեստը:"
							: "Անհրաժեշտ է կրկնել նյութը և փորձել կրկին:"}
					</p>
				</div>

				{/* Status Badge */}
				<div className="flex items-center gap-3">
					{isPassed ? (
						<div className="flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl sm:rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 font-bold text-sm sm:text-lg shadow-xs sm:shadow-sm">
							<CheckCircle2 className="size-5 sm:size-6 text-emerald-600 dark:text-emerald-400" />
							<span>ԱՆՑԱԾ</span>
						</div>
					) : (
						<div className="flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl sm:rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 font-bold text-sm sm:text-lg shadow-xs sm:shadow-sm">
							<XCircle className="size-5 sm:size-6 text-rose-600 dark:text-rose-400" />
							<span>ՉԱՆՑԱԾ</span>
						</div>
					)}
				</div>
			</div>

			{/* Metrics Grid */}
			<div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 py-5 sm:py-8 border-b border-slate-100 dark:border-slate-800">
				{/* Score */}
				<div className="p-4 sm:p-5 rounded-2xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
					<span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-1">
						Հավաքած միավոր
					</span>
					<div className="flex items-baseline gap-1">
						<span className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-100">
							{correctCount}
						</span>
						<span className="text-lg font-bold text-slate-400 dark:text-slate-500">
							/ {totalQuestions}
						</span>
					</div>
					<span className="text-xs font-bold text-primary mt-1 block">
						{toPercent(correctCount, totalQuestions)}%
					</span>
				</div>

				{/* Correct Answers */}
				<div className="p-4 sm:p-5 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30">
					<span className="text-xs font-semibold text-emerald-700 dark:text-emerald-300 block mb-1">
						Ճիշտ պատասխան
					</span>
					<span className="text-3xl sm:text-4xl font-extrabold text-emerald-700 dark:text-emerald-300">
						{correctCount}
					</span>
					<span className="text-xs text-emerald-600/80 dark:text-emerald-400/80 mt-1 block">
						հարց
					</span>
				</div>

				{/* Incorrect Answers */}
				<div className="p-4 sm:p-5 rounded-2xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30">
					<span className="text-xs font-semibold text-rose-700 dark:text-rose-300 block mb-1">
						Սխալ պատասխան
					</span>
					<span className="text-3xl sm:text-4xl font-extrabold text-rose-700 dark:text-rose-300">
						{wrongCount}
					</span>
					<span className="text-xs text-rose-600/80 dark:text-rose-400/80 mt-1 block">հարց</span>
				</div>

				{/* Time Spent */}
				<div className="p-4 sm:p-5 rounded-2xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
					<span className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1 mb-1">
						<Timer className="size-3.5" />
						Ծախսված ժամանակ
					</span>
					<span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100">
						{formattedTimeSpent}
					</span>
					<span className="text-xs text-slate-400 dark:text-slate-500 mt-1 block">
						սահմանաչափը՝ {TEST_MINUTES} րոպե
					</span>
				</div>
			</div>

			<TestResultsPromptActions
				askSave={askSave}
				isSaving={isSaving}
				isSaved={isSaved}
				nextTest={nextTest}
				onSaveResult={onSaveResult}
				onRetry={onRetry}
			/>
		</div>
	);
}
