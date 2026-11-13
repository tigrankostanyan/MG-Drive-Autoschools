import { Link } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { QuestionCard } from "@/components/quiz/QuestionCard";
import { Button } from "@/components/ui/button";
import type { GroupRunner } from "@/features/groups";
import { toCardQuestion } from "@/lib/quiz";

export function GroupQuestionList({ runner }: { runner: GroupRunner }) {
	const {
		questions,
		answers,
		page,
		perPage,
		showAll,
		reviewMode,
		qLoading,
		totalPages,
		nextGroup,
		revealMap,
		handleSelect,
		handlePage,
	} = runner;

	return (
		<div className="w-full space-y-6 sm:space-y-8">
			{qLoading ? (
				<div className="w-full flex justify-center py-20 bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-xs">
					<Loader2 className="size-8 animate-spin text-muted-foreground" />
				</div>
			) : reviewMode ? (
				<>
					{questions.map((q, i) => (
						<QuestionCard
							key={q.id}
							question={toCardQuestion(q, i, revealMap[q.id])}
							number={i + 1}
							selected={answers[q.id] ?? null}
							reveal={true}
							onSelect={() => {}}
						/>
					))}
					{nextGroup && (
						<div className="pt-6 flex justify-center">
							<Button
								asChild
								size="lg"
								className="h-12 px-7 rounded-xl bg-primary text-white hover:bg-primary/90 text-sm font-semibold shadow-md shadow-primary/20"
							>
								<Link to="/groups/$groupId" params={{ groupId: String(nextGroup.id) }}>
									<span>Հաջորդ խումբ՝ {nextGroup.title}</span>
									<ChevronRight className="size-4 ml-1.5" />
								</Link>
							</Button>
						</div>
					)}
				</>
			) : (
				questions.map((q, i) => (
					<QuestionCard
						key={q.id}
						question={toCardQuestion(q, showAll ? i : (page - 1) * perPage + i, revealMap[q.id])}
						number={showAll ? i + 1 : (page - 1) * perPage + i + 1}
						selected={answers[q.id] ?? null}
						reveal={revealMap[q.id] !== undefined}
						onSelect={(idx) => handleSelect(q.id, idx)}
					/>
				))
			)}

			{!reviewMode && !showAll && totalPages > 1 && (
				<div className="pt-4 flex items-center justify-center gap-3">
					<Button
						variant="outline"
						size="sm"
						disabled={page <= 1 || qLoading}
						onClick={() => handlePage(page - 1)}
						className="h-10 px-4 rounded-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs sm:text-sm font-semibold shadow-xs"
					>
						<ChevronLeft className="size-4 mr-1" /> Նախորդ
					</Button>
					<span className="font-mono text-xs sm:text-sm font-bold px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-slate-700 dark:text-slate-200 shadow-xs">
						{page} / {totalPages}
					</span>
					<Button
						variant="outline"
						size="sm"
						disabled={page >= totalPages || qLoading}
						onClick={() => handlePage(page + 1)}
						className="h-10 px-4 rounded-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs sm:text-sm font-semibold shadow-xs"
					>
						Հաջորդ <ChevronRight className="size-4 ml-1" />
					</Button>
				</div>
			)}
		</div>
	);
}
