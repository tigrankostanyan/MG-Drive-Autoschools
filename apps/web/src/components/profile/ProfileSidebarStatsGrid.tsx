import { CheckCircle2, Flame, Target, XCircle } from "lucide-react";
import type { ProfileStats } from "@/lib/api/profile";

interface ProfileSidebarStatsGridProps {
	stats: ProfileStats | null;
	avgScore: number;
	passedTests: number;
	failedTests: number;
}

export function ProfileSidebarStatsGrid({
	stats,
	avgScore,
	passedTests,
	failedTests,
}: ProfileSidebarStatsGridProps) {
	return (
		<div className="border-t border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/60 p-4 sm:p-5">
			<div className="grid grid-cols-2 gap-2.5">
				{/* Passed */}
				<div className="rounded-2xl bg-white dark:bg-slate-800/80 p-3 border border-slate-200/80 dark:border-slate-700 shadow-xs flex items-center gap-3">
					<div className="grid size-9 shrink-0 place-items-center rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400">
						<CheckCircle2 className="size-5" />
					</div>
					<div className="min-w-0">
						<p className="text-base font-black text-slate-950 dark:text-white leading-none">
							{passedTests}
						</p>
						<p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 mt-1 truncate">
							Հանձնած
						</p>
					</div>
				</div>

				{/* Failed */}
				<div className="rounded-2xl bg-white dark:bg-slate-800/80 p-3 border border-slate-200/80 dark:border-slate-700 shadow-xs flex items-center gap-3">
					<div className="grid size-9 shrink-0 place-items-center rounded-xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400">
						<XCircle className="size-5" />
					</div>
					<div className="min-w-0">
						<p className="text-base font-black text-slate-950 dark:text-white leading-none">
							{failedTests}
						</p>
						<p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 mt-1 truncate">
							Սխալներ
						</p>
					</div>
				</div>

				{/* Average */}
				<div className="rounded-2xl bg-white dark:bg-slate-800/80 p-3 border border-slate-200/80 dark:border-slate-700 shadow-xs flex items-center gap-3">
					<div className="grid size-9 shrink-0 place-items-center rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400">
						<Target className="size-5" />
					</div>
					<div className="min-w-0">
						<p className="text-base font-black text-slate-950 dark:text-white leading-none">
							{avgScore}%
						</p>
						<p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 mt-1 truncate">
							Միջին
						</p>
					</div>
				</div>

				{/* Finished topics */}
				<div className="rounded-2xl bg-white dark:bg-slate-800/80 p-3 border border-slate-200/80 dark:border-slate-700 shadow-xs flex items-center gap-3">
					<div className="grid size-9 shrink-0 place-items-center rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400">
						<Flame className="size-5 fill-amber-500 text-amber-500" />
					</div>
					<div className="min-w-0">
						<p className="text-base font-black text-slate-950 dark:text-white leading-none">
							{stats?.completedGroups ?? 0}/{stats?.totalGroups ?? 0}
						</p>
						<p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 mt-1 truncate">
							Թեմաներ
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}
