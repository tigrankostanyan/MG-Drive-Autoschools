import { Sparkles } from "lucide-react";
import {
	Area,
	AreaChart,
	Tooltip as RechartsTooltip,
	ResponsiveContainer,
	XAxis,
	YAxis,
} from "recharts";
import type { ActivityData } from "@/lib/api/analytics";

export function ActivityChartCard({
	activityData,
	loading,
}: {
	activityData: ActivityData[];
	loading: boolean;
}) {
	return (
		<div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/60 lg:col-span-2">
			<div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between pb-4">
				<div>
					<h2 className="text-lg font-extrabold text-slate-900 dark:text-white">
						Ուսանողների Ակտիվություն և Քննությունների Դինամիկա
					</h2>
					<p className="text-xs text-slate-400">
						Շաբաթական հանձնված թեստերի և դրական արդյունքների քանակը
					</p>
				</div>
				<span className="inline-flex items-center gap-1.5 rounded-full bg-accent/10 px-3 py-1 text-xs font-bold text-accent dark:bg-accent/20 dark:text-accent">
					<Sparkles className="size-3.5" /> Բարձր արդյունավետություն
				</span>
			</div>
			<div className="h-64 w-full pt-4">
				{loading ? (
					<div className="h-full w-full bg-slate-100 dark:bg-slate-800/50 rounded-2xl animate-pulse" />
				) : (
					<ResponsiveContainer width="100%" height="100%">
						<AreaChart data={activityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
							<defs>
								<linearGradient id="colorTests" x1="0" y1="0" x2="0" y2="1">
									<stop offset="5%" stopColor="#6366F1" stopOpacity={0.4} />
									<stop offset="95%" stopColor="#6366F1" stopOpacity={0.0} />
								</linearGradient>
								<linearGradient id="colorPasses" x1="0" y1="0" x2="0" y2="1">
									<stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
									<stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
								</linearGradient>
							</defs>
							<XAxis dataKey="date" stroke="#94A3B8" fontSize={12} tickLine={false} />
							<YAxis stroke="#94A3B8" fontSize={12} tickLine={false} />
							<RechartsTooltip
								contentStyle={{
									backgroundColor: "#0F172A",
									borderColor: "#334155",
									borderRadius: "1rem",
									color: "#fff",
									fontSize: "12px",
								}}
							/>
							<Area
								type="monotone"
								dataKey="tests"
								stroke="#6366F1"
								strokeWidth={3}
								fillOpacity={1}
								fill="url(#colorTests)"
								name="Ընդհանուր Թեստեր"
							/>
							<Area
								type="monotone"
								dataKey="passes"
								stroke="#10B981"
								strokeWidth={3}
								fillOpacity={1}
								fill="url(#colorPasses)"
								name="Հանձնված (90%+)"
							/>
						</AreaChart>
					</ResponsiveContainer>
				)}
			</div>
		</div>
	);
}
