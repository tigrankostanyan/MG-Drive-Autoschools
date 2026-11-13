import { Clock } from "lucide-react";
import { toPercent } from "@/lib/utils";

export interface ProgressIndicatorProps {
	current: number;
	total: number;
	remainingTime?: string | undefined;
	className?: string | undefined;
}

export function ProgressIndicator({
	current,
	total,
	remainingTime,
	className = "",
}: ProgressIndicatorProps) {
	const percentage = toPercent(current, total);

	return (
		<div className={`w-full space-y-1.5 select-none ${className}`}>
			<div className="flex items-center justify-between text-[11px] font-medium text-slate-500">
				<span className="tabular-nums">
					Հարց <strong className="text-slate-900 font-bold">{current}</strong> / {total}
				</span>
				{remainingTime && (
					<span className="flex items-center gap-1 text-slate-500 tabular-nums">
						<Clock className="size-3 text-slate-400" />
						<span>{remainingTime}</span>
					</span>
				)}
			</div>

			<div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
				<div
					className="h-full rounded-full bg-primary transition-all duration-300 ease-out"
					style={{ width: `${percentage}%` }}
				/>
			</div>
		</div>
	);
}
