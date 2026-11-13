import { Link } from "@tanstack/react-router";
import { ArrowRight, CheckCircle2, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { TestData } from "@/lib/api/types";

interface TestResultsPromptActionsProps {
	askSave: boolean;
	isSaving: boolean;
	isSaved: boolean;
	nextTest: TestData | null;
	onSaveResult: (save: boolean) => void;
	onRetry: () => void;
}

export function TestResultsPromptActions({
	askSave,
	isSaving,
	isSaved,
	nextTest,
	onSaveResult,
	onRetry,
}: TestResultsPromptActionsProps) {
	return (
		<>
			{/* Save Prompt (if user hasn't chosen yet) */}
			{askSave && (
				<div className="mt-6 p-5 sm:p-6 rounded-2xl border border-primary/20 bg-primary/[0.04] dark:bg-primary/10 flex flex-col sm:flex-row items-center justify-between gap-4">
					<div className="space-y-1 text-center sm:text-left">
						<p className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100">
							Ցանկանո՞ւմ եք պահպանել արդյունքը ձեր պրոֆիլում:
						</p>
						<p className="text-xs text-slate-500 dark:text-slate-400">
							Արդյունքը կգրանցվի ձեր վիճակագրության մեջ:
						</p>
					</div>
					<div className="flex items-center gap-3 shrink-0 w-full sm:w-auto">
						<Button
							variant="outline"
							onClick={() => onSaveResult(false)}
							disabled={isSaving}
							className="flex-1 sm:flex-initial rounded-xl"
						>
							Ոչ
						</Button>
						<Button
							onClick={() => onSaveResult(true)}
							disabled={isSaving}
							isLoading={isSaving}
							className="flex-1 sm:flex-initial rounded-xl bg-primary text-white"
						>
							Այո, պահպանել
						</Button>
					</div>
				</div>
			)}

			{isSaved && (
				<div className="mt-6 p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-center gap-3 text-emerald-800 dark:text-emerald-300 text-sm font-semibold">
					<CheckCircle2 className="size-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
					<span>Արդյունքը հաջողությամբ պահպանվել է ձեր պրոֆիլում:</span>
				</div>
			)}

			{/* Action Buttons */}
			<div className="mt-6 sm:mt-8 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
				<Button
					variant="outline"
					size="lg"
					onClick={onRetry}
					className="w-full sm:w-auto rounded-xl px-5 sm:px-6 border-slate-200 dark:border-slate-800 text-sm sm:text-base h-11 sm:h-12"
				>
					<RotateCcw className="size-4 mr-2" />
					Կրկին փորձել
				</Button>

				<div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3">
					<Button
						asChild
						variant="ghost"
						size="lg"
						className="w-full sm:w-auto rounded-xl text-sm sm:text-base h-11 sm:h-12"
					>
						<Link to="/tests">Բոլոր թեստերը</Link>
					</Button>

					{nextTest && (
						<Button
							asChild
							size="lg"
							className="w-full sm:w-auto rounded-xl bg-primary text-white shadow-md shadow-primary/20 hover:bg-primary/90 text-sm sm:text-base h-11 sm:h-12 font-semibold"
						>
							<Link to="/tests/$testId" params={{ testId: String(nextTest.id) }}>
								<span>Հաջորդ թեստ՝ {nextTest.title}</span>
								<ArrowRight className="size-4 ml-2" />
							</Link>
						</Button>
					)}
				</div>
			</div>
		</>
	);
}
