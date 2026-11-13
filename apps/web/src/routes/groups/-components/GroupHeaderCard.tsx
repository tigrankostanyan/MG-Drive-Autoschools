import { Link } from "@tanstack/react-router";
import { ArrowLeft, ChevronRight, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { GroupRunner } from "@/features/groups";

export function GroupHeaderCard({ runner }: { runner: GroupRunner }) {
	const { group, reviewMode, nextGroup, qLoading, handleExitReview, resetAnswers, handleFinish } =
		runner;

	return (
		<div className="w-full bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-xs sm:shadow-sm p-6 sm:p-7 lg:p-8">
			<div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
				{/* Left Info: Breadcrumbs, Title, Description */}
				<div className="space-y-2">
					<div className="flex items-center gap-2 mb-2">
						<Button
							asChild
							variant="outline"
							size="sm"
							className="h-8 px-2.5 rounded-xl border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-300 shadow-xs bg-white dark:bg-slate-900"
						>
							<Link to="/groups">
								<ArrowLeft className="size-3.5 mr-1" />
								Խմբեր
							</Link>
						</Button>
						<span className="text-slate-300 dark:text-slate-700">/</span>
						<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-primary/10 text-primary">
							Խումբ {group.number}
						</span>
					</div>

					<h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
						{group.title}
					</h1>

					{group.text && (
						<p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-2xl">
							{group.text}
						</p>
					)}
				</div>

				{/* Right Actions */}
				<div className="flex flex-wrap items-center gap-2.5 sm:gap-3 shrink-0 self-start md:self-center">
					{reviewMode ? (
						<>
							<Button
								variant="outline"
								size="sm"
								onClick={handleExitReview}
								className="h-10 px-4 rounded-xl border-slate-200 dark:border-slate-800 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 shadow-xs bg-white dark:bg-slate-900"
							>
								<RotateCcw className="size-3.5 mr-1.5" />
								Վերադառնալ
							</Button>
							{nextGroup && (
								<Button
									asChild
									size="sm"
									className="h-10 px-4 rounded-xl bg-primary text-white hover:bg-primary/90 text-xs sm:text-sm font-semibold shadow-sm shadow-primary/20"
								>
									<Link to="/groups/$groupId" params={{ groupId: String(nextGroup.id) }}>
										<span>Հաջորդ խումբ</span>
										<ChevronRight className="size-4 ml-1" />
									</Link>
								</Button>
							)}
						</>
					) : (
						<>
							<Button
								variant="outline"
								size="sm"
								onClick={resetAnswers}
								className="h-10 px-4 rounded-xl border-slate-200 dark:border-slate-800 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 shadow-xs bg-white dark:bg-slate-900"
							>
								<RotateCcw className="size-3.5 mr-1.5" />
								Սկսել նորից
							</Button>
							<Button
								size="sm"
								onClick={handleFinish}
								disabled={qLoading}
								isLoading={qLoading}
								className="h-10 px-5 rounded-xl bg-primary text-white hover:bg-primary/90 text-xs sm:text-sm font-semibold shadow-sm shadow-primary/20"
							>
								Ավարտել
							</Button>
						</>
					)}
				</div>
			</div>
		</div>
	);
}
