import { ArrowLeft, Plus, TrendingUp } from "lucide-react";

export function AssignmentHeader({
	expandedGroupId,
	studentCount,
	onBack,
	onToggleAssign,
	onViewAnalytics,
}: {
	expandedGroupId: number;
	studentCount: number;
	onBack: () => void;
	onToggleAssign: () => void;
	onViewAnalytics?: (() => void) | undefined;
}) {
	return (
		<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-6 dark:border-slate-800">
			<div className="flex items-center gap-4">
				<button
					type="button"
					onClick={onBack}
					className="grid size-11 place-items-center rounded-xl bg-slate-100 text-slate-600 transition-colors hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
				>
					<ArrowLeft className="size-5" />
				</button>
				<div>
					<h2 className="text-xl font-black text-slate-900 dark:text-white">
						Խումբ #{expandedGroupId} - Ուսանողներ
					</h2>
					<p className="mt-1 text-sm font-semibold text-slate-500">
						Ընդհանուր {studentCount} ուսանող
					</p>
				</div>
			</div>
			<div className="flex items-center gap-2.5">
				{onViewAnalytics && (
					<button
						type="button"
						onClick={onViewAnalytics}
						className="flex items-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-4 py-2.5 text-xs font-bold text-blue-700 hover:bg-blue-100 dark:border-blue-800 dark:bg-blue-950/40 dark:text-blue-300 transition-colors"
					>
						<TrendingUp className="size-4" /> Խմբի Անալիտիկա
					</button>
				)}
				<button
					type="button"
					onClick={onToggleAssign}
					className="flex items-center gap-2 rounded-xl bg-[image:var(--gradient-accent)] px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-accent/25 transition-all hover:brightness-110"
				>
					<Plus className="size-4" /> Կառավարել Ուսանողներին
				</button>
			</div>
		</div>
	);
}
