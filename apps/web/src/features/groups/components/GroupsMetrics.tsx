import { BookOpen } from "lucide-react";
import type { MetricItem } from "@/components/learning";

interface GroupsMetricsProps {
	metrics: MetricItem[];
}

export function GroupsMetrics({ metrics }: GroupsMetricsProps) {
	return (
		<div className="relative overflow-hidden rounded-2xl lg:rounded-3xl bg-slate-950/90 dark:bg-slate-950/95 border border-white/10 p-6 sm:p-7 shadow-[0_20px_50px_-10px_rgba(0,0,0,0.45)] backdrop-blur-xl">
			<div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
			<div className="pointer-events-none absolute -right-10 -bottom-10 w-72 h-72 bg-blue-600/15 rounded-full blur-3xl" />
			<div className="pointer-events-none absolute top-1/2 -translate-y-1/2 right-6 text-white/[0.03]">
				<BookOpen className="size-48" />
			</div>

			<div className="relative z-10 grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-white/10">
				{metrics.map((metric) => (
					<div
						key={metric.label}
						className="p-3 sm:p-4 lg:px-8 first:pl-0 last:pr-0 select-none flex flex-col justify-center"
					>
						<div className="flex items-baseline gap-2">
							<span className="text-3xl sm:text-4xl lg:text-[42px] font-black tracking-tight text-white tabular-nums leading-none">
								{metric.value}
							</span>
							{metric.unit && (
								<span
									className={
										metric.isPercentage || metric.unit === "%"
											? "text-2xl sm:text-3xl lg:text-[34px] font-black tracking-tight text-primary leading-none ml-0.5"
											: "text-xs sm:text-sm font-bold text-slate-400 uppercase tracking-wider"
									}
								>
									{metric.unit}
								</span>
							)}
						</div>
						<span className="mt-2 text-xs sm:text-[12.5px] font-mono font-bold uppercase tracking-wider text-slate-300">
							{metric.label}
						</span>
						{metric.description && (
							<p className="mt-1 text-xs sm:text-sm text-slate-400 font-medium leading-normal">
								{metric.description}
							</p>
						)}
					</div>
				))}
			</div>
		</div>
	);
}
