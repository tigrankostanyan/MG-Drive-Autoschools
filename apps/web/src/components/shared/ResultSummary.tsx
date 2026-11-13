import { CheckCircle2, XCircle } from "lucide-react";
import { PASS_THRESHOLD_PERCENT } from "@/lib/quiz";
import { cn, toPercent } from "@/lib/utils";

export interface ResultSummaryProps {
	score: number;
	total: number;
	percentage?: number | undefined;
	passed?: boolean | undefined;
	label?: string | undefined;
	className?: string | undefined;
}

export function ResultSummary({
	score,
	total,
	percentage,
	passed,
	label = "Ճիշտ պատասխաններ",
	className,
}: ResultSummaryProps) {
	const calcPercent = percentage ?? toPercent(score, total);
	const isPassed = passed ?? calcPercent >= PASS_THRESHOLD_PERCENT;

	return (
		<div
			className={cn(
				"rounded-xl border p-2.5 sm:p-3 transition-colors select-none",
				isPassed
					? "bg-emerald-50/70 border-emerald-200/70 dark:bg-emerald-950/30 dark:border-emerald-800/60"
					: "bg-amber-50/70 border-amber-200/70 dark:bg-amber-950/30 dark:border-amber-800/60",
				className,
			)}
		>
			<div className="flex items-center justify-between">
				<div className="flex items-baseline gap-1.5">
					<span className="text-xl sm:text-2xl font-black text-slate-950 dark:text-white tabular-nums leading-none">
						{score}
					</span>
					<span className="text-xs font-bold text-slate-400">/ {total}</span>
				</div>

				<div className="flex items-center gap-1.5">
					<span
						className={cn(
							"text-sm font-black tabular-nums",
							isPassed
								? "text-emerald-600 dark:text-emerald-400"
								: "text-amber-600 dark:text-amber-400",
						)}
					>
						{calcPercent}%
					</span>
					{isPassed ? (
						<CheckCircle2 className="size-4 text-emerald-500 shrink-0" />
					) : (
						<XCircle className="size-4 text-amber-500 shrink-0" />
					)}
				</div>
			</div>

			<p className="mt-1 text-[11px] font-medium text-slate-500 dark:text-slate-400 tracking-wide">
				{label}
			</p>
		</div>
	);
}
