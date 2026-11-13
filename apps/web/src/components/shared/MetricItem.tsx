import { cn } from "@/lib/utils";

export interface MetricItem {
	value: string | number;
	unit?: string;
	label: string;
	description?: string;
	isPercentage?: boolean;
}

export interface MetricItemProps {
	metric: MetricItem;
	className?: string;
}

export function MetricItemView({ metric, className }: MetricItemProps) {
	return (
		<div className={cn("p-5 sm:p-6 lg:px-8 flex flex-col justify-center select-none", className)}>
			<div className="flex items-baseline gap-1.5">
				<span className="text-3xl sm:text-4xl lg:text-[40px] font-black tracking-tight text-slate-950 dark:text-white tabular-nums leading-none">
					{metric.value}
				</span>
				{metric.unit && (
					<span
						className={
							metric.isPercentage || metric.unit === "%"
								? "text-2xl sm:text-3xl lg:text-[32px] font-black tracking-tight text-primary leading-none ml-0.5"
								: "text-[12px] font-bold text-slate-400 uppercase tracking-wide"
						}
					>
						{metric.unit}
					</span>
				)}
			</div>
			<span className="mt-2 text-[11.5px] font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
				{metric.label}
			</span>
			{metric.description && (
				<p className="mt-1 text-[12.5px] text-slate-500 dark:text-slate-400 font-medium leading-normal">
					{metric.description}
				</p>
			)}
		</div>
	);
}
