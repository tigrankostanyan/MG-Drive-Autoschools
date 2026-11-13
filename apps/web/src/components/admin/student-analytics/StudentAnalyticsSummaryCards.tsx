import { Activity, BookOpen, CheckSquare } from "lucide-react";
import type { StudentAnalyticsSummary } from "@/lib/api/analytics";

export function StudentAnalyticsSummaryCards({
	summary,
	title = "ԱՌԱՋԸՆԹԱՑԻ ԱՄՓՈՓՈՒՄ",
	compact = false,
}: {
	summary: StudentAnalyticsSummary;
	title?: string;
	compact?: boolean;
}) {
	const formatGrowth = (val: number) => {
		if (val > 0) return `+${val.toFixed(1)}`;
		if (val < 0) return val.toFixed(1);
		return "0";
	};

	return (
		<div className="space-y-3">
			<h4 className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
				{title}
			</h4>
			<div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
				{/* Card 1: Tests */}
				<div
					className={`relative overflow-hidden rounded-3xl border border-blue-100/80 bg-[#EEF4FF] p-5 transition-all dark:border-blue-900/30 dark:bg-blue-950/20 ${
						compact ? "p-4" : "p-5"
					}`}
				>
					<div className="flex items-center gap-2.5">
						<div className="grid size-9 place-items-center rounded-xl bg-white shadow-xs dark:bg-slate-800 text-blue-600 dark:text-blue-400">
							<CheckSquare className="size-4" />
						</div>
						<span className="text-xs font-black uppercase tracking-wider text-blue-900/70 dark:text-blue-300">
							ԹԵՍՏԵՐ
						</span>
					</div>

					<div className="mt-4 flex items-baseline justify-between">
						<div>
							<div className="text-2xl font-black text-slate-900 dark:text-white">
								{summary.tests.count}
							</div>
							<div className="mt-0.5 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
								Միջին աճ {formatGrowth(summary.tests.avgGrowth)}
							</div>
						</div>
						{summary.tests.mistakes > 0 && (
							<span className="rounded-full bg-rose-100 px-2.5 py-0.5 text-[11px] font-bold text-rose-600 dark:bg-rose-950/50 dark:text-rose-400">
								{summary.tests.mistakes} սխալ
							</span>
						)}
					</div>
				</div>

				{/* Card 2: Groups */}
				<div
					className={`relative overflow-hidden rounded-3xl border border-teal-100/80 bg-[#E8FAF7] p-5 transition-all dark:border-teal-900/30 dark:bg-teal-950/20 ${
						compact ? "p-4" : "p-5"
					}`}
				>
					<div className="flex items-center gap-2.5">
						<div className="grid size-9 place-items-center rounded-xl bg-white shadow-xs dark:bg-slate-800 text-teal-600 dark:text-teal-400">
							<BookOpen className="size-4" />
						</div>
						<span className="text-xs font-black uppercase tracking-wider text-teal-900/70 dark:text-teal-300">
							ԽՄԲԵՐ
						</span>
					</div>

					<div className="mt-4 flex items-baseline justify-between">
						<div>
							<div className="text-2xl font-black text-slate-900 dark:text-white">
								{summary.groups.count}
							</div>
							<div className="mt-0.5 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
								Միջին աճ {formatGrowth(summary.groups.avgGrowth)}
							</div>
						</div>
						{summary.groups.mistakes > 0 && (
							<span className="rounded-full bg-rose-100 px-2.5 py-0.5 text-[11px] font-bold text-rose-600 dark:bg-rose-950/50 dark:text-rose-400">
								{summary.groups.mistakes} սխալ
							</span>
						)}
					</div>
				</div>

				{/* Card 3: Overall */}
				<div
					className={`relative overflow-hidden rounded-3xl border border-amber-100/80 bg-[#FFF9EB] p-5 transition-all dark:border-amber-900/30 dark:bg-amber-950/20 ${
						compact ? "p-4" : "p-5"
					}`}
				>
					<div className="flex items-center gap-2.5">
						<div className="grid size-9 place-items-center rounded-xl bg-white shadow-xs dark:bg-slate-800 text-amber-600 dark:text-amber-400">
							<Activity className="size-4" />
						</div>
						<span className="text-xs font-black uppercase tracking-wider text-amber-900/70 dark:text-amber-300">
							ԸՆԴՀԱՆՈՒՐ
						</span>
					</div>

					<div className="mt-4 flex items-baseline justify-between">
						<div>
							<div className="text-2xl font-black text-slate-900 dark:text-white">
								{summary.overall.attempts}
							</div>
							<div className="mt-0.5 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
								Ընդհանուր փորձ
							</div>
						</div>
						<div className="flex flex-col items-end gap-1">
							<span className="rounded-full bg-white/80 dark:bg-slate-800/80 px-2.5 py-0.5 text-[11px] font-bold text-slate-700 dark:text-slate-300 shadow-xs">
								{summary.overall.avgScore} միավոր
							</span>
							{summary.overall.mistakes > 0 && (
								<span className="text-[10px] font-bold text-rose-600 dark:text-rose-400">
									{summary.overall.mistakes} ընդհ․ սխալ
								</span>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
