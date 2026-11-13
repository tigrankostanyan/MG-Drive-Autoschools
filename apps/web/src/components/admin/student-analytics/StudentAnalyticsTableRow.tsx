import {
	AlertTriangle,
	ChevronDown,
	FileText,
	Loader2,
	TrendingDown,
	TrendingUp,
} from "lucide-react";
import type { StudentAnalyticsItem } from "@/lib/api/analytics";
import { StudentExpandedDetails } from "./StudentExpandedDetails";

export function StudentAnalyticsTableRow({
	student,
	isExpanded,
	isToggling,
	onToggleExpand,
	onToggleAnalytics,
}: {
	student: StudentAnalyticsItem;
	isExpanded: boolean;
	isToggling: boolean;
	onToggleExpand: () => void;
	onToggleAnalytics: () => void;
}) {
	const initial = student.name ? student.name.charAt(0).toUpperCase() : "U";

	// Last score badge
	const renderScoreBadge = () => {
		if (student.attempts === 0 || student.latestScore < 50) {
			return (
				<span className="inline-flex items-center rounded-full bg-rose-50 px-3 py-1 text-xs font-bold text-rose-600 dark:bg-rose-950/40 dark:text-rose-400">
					Ցածր
				</span>
			);
		}
		if (student.latestScore >= 80) {
			return (
				<span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
					Գերազանց
				</span>
			);
		}
		return (
			<span className="inline-flex items-center rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-600 dark:bg-amber-950/40 dark:text-amber-400">
				Միջին
			</span>
		);
	};

	// Growth dynamics
	const renderGrowth = () => {
		if (student.growth > 0) {
			return (
				<span className="inline-flex items-center gap-1 font-bold text-emerald-600 dark:text-emerald-400">
					<TrendingUp className="size-3.5" />+{student.growth.toFixed(1)}
				</span>
			);
		}
		if (student.growth < 0) {
			return (
				<span className="inline-flex items-center gap-1 font-bold text-rose-600 dark:text-rose-400">
					<TrendingDown className="size-3.5" />
					{student.growth.toFixed(1)}
				</span>
			);
		}
		return <span className="font-semibold text-slate-400">— 0</span>;
	};

	// Status badge
	const renderStatusBadge = () => {
		if (student.status === "risk") {
			return (
				<span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-1 text-[11px] font-bold text-rose-600 dark:bg-rose-950/40 dark:text-rose-400">
					<AlertTriangle className="size-3" />
					Ռիսկային
				</span>
			);
		}
		if (student.status === "improving") {
			return (
				<span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
					<TrendingUp className="size-3" />
					Աճող
				</span>
			);
		}
		return (
			<span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-bold text-slate-500 dark:bg-slate-800 dark:text-slate-400">
				Կայուն
			</span>
		);
	};

	return (
		<>
			<tr
				className={`group border-b border-slate-100 dark:border-slate-800/80 transition-colors ${
					isExpanded
						? "bg-slate-50/60 dark:bg-slate-800/30"
						: "hover:bg-slate-50/40 dark:hover:bg-slate-800/20"
				}`}
			>
				{/* 1. Student */}
				<td className="py-4 pl-6 pr-4">
					<div className="flex items-center gap-3">
						{student.avatar ? (
							<img
								src={student.avatar}
								alt={student.name}
								className="size-10 rounded-2xl object-cover ring-2 ring-slate-100 dark:ring-slate-800"
							/>
						) : (
							<div className="grid size-10 place-items-center rounded-2xl bg-blue-50 dark:bg-blue-950/40 font-black text-blue-600 dark:text-blue-400 ring-2 ring-blue-100/50 dark:ring-blue-900/30">
								{initial}
							</div>
						)}
						<div className="min-w-0">
							<div className="flex items-center gap-2">
								<span className="truncate font-extrabold text-sm text-slate-900 dark:text-white">
									{student.name}
								</span>
								{student.groupTitle && (
									<span className="rounded-md bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 text-[10px] font-bold text-slate-500">
										{student.groupTitle}
									</span>
								)}
							</div>
							<p className="truncate text-xs font-semibold text-slate-400">{student.email}</p>
						</div>
					</div>
				</td>

				{/* 2. Attempts */}
				<td className="py-4 px-4">
					<div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300">
						<FileText className="size-3.5 text-slate-400" />
						<span>{student.attempts}</span>
					</div>
				</td>

				{/* 3. Last Score */}
				<td className="py-4 px-4">{renderScoreBadge()}</td>

				{/* 4. Growth Dynamics */}
				<td className="py-4 px-4 text-xs">{renderGrowth()}</td>

				{/* 5. Status */}
				<td className="py-4 px-4">{renderStatusBadge()}</td>

				{/* 6. Analytics Switch */}
				<td className="py-4 px-4">
					<button
						type="button"
						role="switch"
						aria-checked={student.include_in_analytics}
						disabled={isToggling}
						onClick={onToggleAnalytics}
						className={`relative h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors focus:outline-none ${
							student.include_in_analytics ? "bg-[#044dda]" : "bg-slate-200 dark:bg-slate-700"
						} ${isToggling ? "opacity-60 cursor-not-allowed" : ""}`}
					>
						{isToggling ? (
							<span className="absolute inset-0 flex items-center justify-center">
								<Loader2 className="size-3 animate-spin text-white" />
							</span>
						) : (
							<span
								className={`absolute top-0.5 size-5 rounded-full bg-white shadow-sm transition-all ${
									student.include_in_analytics ? "left-[22px]" : "left-0.5"
								}`}
							/>
						)}
					</button>
				</td>

				{/* 7. Action */}
				<td className="py-4 pr-6 pl-4 text-right">
					<div className="flex items-center justify-end">
						<button
							type="button"
							onClick={onToggleExpand}
							title={isExpanded ? "Փակել" : "Դիտել մանրամասները"}
							className={`grid size-8 place-items-center rounded-xl transition-all ${
								isExpanded
									? "bg-accent/10 text-accent rotate-180"
									: "text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800"
							}`}
						>
							<ChevronDown className="size-4" />
						</button>
					</div>
				</td>
			</tr>

			{/* Expanded details accordion */}
			{isExpanded && (
				<tr>
					<td colSpan={7} className="p-0">
						<StudentExpandedDetails student={student} />
					</td>
				</tr>
			)}
		</>
	);
}
