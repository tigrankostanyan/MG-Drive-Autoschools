import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { type MetricItem, MetricItemView } from "./MetricItem";

export type { MetricItem } from "./MetricItem";

export interface OverviewStatsProps {
	metrics: MetricItem[];
	className?: string;
}

/** Grid template for each supported metric count; any other count falls back to one column. */
const GRID_COLUMNS_BY_COUNT: Record<number, string> = {
	2: "sm:grid-cols-2",
	3: "sm:grid-cols-3",
	4: "sm:grid-cols-2 lg:grid-cols-4",
};

export function OverviewStats({ metrics, className }: OverviewStatsProps) {
	const gridColsClass = GRID_COLUMNS_BY_COUNT[metrics.length] ?? "sm:grid-cols-1";

	return (
		<Card padding="none" className={cn("mt-6 sm:mt-7 overflow-hidden", className)}>
			<div
				className={cn(
					"grid grid-cols-1 divide-y divide-slate-100 dark:divide-slate-800",
					gridColsClass,
					"sm:divide-y-0 sm:divide-x sm:divide-slate-100 dark:sm:divide-slate-800",
				)}
			>
				{metrics.map((metric) => (
					<MetricItemView key={metric.label} metric={metric} />
				))}
			</div>
		</Card>
	);
}
