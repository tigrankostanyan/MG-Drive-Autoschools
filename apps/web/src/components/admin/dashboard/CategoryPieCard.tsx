import { Cell, Pie, PieChart, Tooltip as RechartsTooltip, ResponsiveContainer } from "recharts";
import type { CategoryData } from "@/lib/api/analytics";

export function CategoryPieCard({
	categoryData,
	loading,
}: {
	categoryData: CategoryData[];
	loading: boolean;
}) {
	return (
		<div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/60 flex flex-col justify-between">
			<div>
				<h2 className="text-lg font-extrabold text-slate-900 dark:text-white">
					Հարցերի Բաշխվածություն
				</h2>
				<p className="text-xs text-slate-400">Ըստ կատեգորիաների և թեմաների</p>
				<div className="mt-4 h-48 w-full">
					{loading ? (
						<div className="h-full w-full bg-slate-100 dark:bg-slate-800/50 rounded-2xl animate-pulse" />
					) : (
						<ResponsiveContainer width="100%" height="100%">
							<PieChart>
								<Pie
									data={categoryData}
									cx="50%"
									cy="50%"
									innerRadius={55}
									outerRadius={80}
									paddingAngle={4}
									dataKey="value"
								>
									{categoryData.map((entry) => (
										<Cell key={entry.name} fill={entry.color} />
									))}
								</Pie>
								<RechartsTooltip />
							</PieChart>
						</ResponsiveContainer>
					)}
				</div>
			</div>
			<div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
				{categoryData.map((c) => (
					<div key={c.name} className="flex items-center justify-between text-xs font-semibold">
						<div className="flex items-center gap-2">
							<span className="size-2.5 rounded-full" style={{ backgroundColor: c.color }} />
							<span className="text-slate-600 dark:text-slate-300">{c.name}</span>
						</div>
						<span className="font-bold text-slate-900 dark:text-white">{c.value} հարց</span>
					</div>
				))}
			</div>
		</div>
	);
}
