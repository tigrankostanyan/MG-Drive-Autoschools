import { AlertCircle, CheckCircle2, Clock, XCircle } from "lucide-react";
import type { StudentAnalyticsItem, StudentAnalyticsSummary } from "@/lib/api/analytics";
import { StudentAnalyticsSummaryCards } from "./StudentAnalyticsSummaryCards";

export function StudentExpandedDetails({ student }: { student: StudentAnalyticsItem }) {
	const personalSummary: StudentAnalyticsSummary = {
		tests: {
			count: student.testAttempts,
			avgGrowth: student.testGrowth,
			mistakes: student.recentResults
				.filter((r) => r.type === "test")
				.reduce((acc, r) => acc + (r.wrong_count || 0), 0),
		},
		groups: {
			count: student.groupAttempts,
			avgGrowth: student.groupGrowth,
			mistakes: student.recentResults
				.filter((r) => r.type === "group")
				.reduce((acc, r) => acc + (r.wrong_count || 0), 0),
		},
		overall: {
			attempts: student.attempts,
			avgScore: student.avgScore,
			mistakes: student.totalWrong,
			passRate:
				student.attempts > 0
					? Math.round(
							(student.recentResults.filter((r) => r.status === "passed").length /
								student.attempts) *
								100,
						)
					: 0,
		},
		counts: {
			total: 1,
			active: student.include_in_analytics ? 1 : 0,
			improving: student.status === "improving" ? 1 : 0,
			risk: student.status === "risk" ? 1 : 0,
			stagnant: student.status === "stagnant" ? 1 : 0,
		},
	};

	const formatTime = (seconds?: number) => {
		if (!seconds) return "-";
		const mins = Math.floor(seconds / 60);
		const secs = seconds % 60;
		return mins > 0 ? `${mins} ր ${secs} վ` : `${secs} վ`;
	};

	const formatDate = (dateStr: string) => {
		try {
			const d = new Date(dateStr);
			return d.toLocaleDateString("hy-AM", {
				day: "2-digit",
				month: "2-digit",
				year: "numeric",
				hour: "2-digit",
				minute: "2-digit",
			});
		} catch {
			return dateStr;
		}
	};

	return (
		<div className="space-y-6 rounded-2xl bg-slate-50/70 p-6 dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800/80 my-3">
			{/* Student Personal Progress Summary */}
			<StudentAnalyticsSummaryCards
				summary={personalSummary}
				title={`${student.name} — Առաջընթացի ամփոփում`}
				compact
			/>

			{/* Solutions / Attempts Table */}
			<div className="space-y-3">
				<div className="flex items-center justify-between">
					<h5 className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
						Լուծված թեստերի և խմբերի պատմություն ({student.recentResults.length})
					</h5>
					{student.groupTitle && (
						<span className="rounded-full bg-slate-200/80 px-2.5 py-0.5 text-[11px] font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
							Խումբ՝ {student.groupTitle}
						</span>
					)}
				</div>

				{student.recentResults.length === 0 ? (
					<div className="flex items-center gap-2 rounded-2xl border border-dashed border-slate-200 p-6 text-xs font-semibold text-slate-400 dark:border-slate-800">
						<AlertCircle className="size-4 text-slate-400 shrink-0" />
						Ուսանողը դեռևս չունի լուծված թեստեր կամ խմբեր։
					</div>
				) : (
					<div className="overflow-x-auto rounded-2xl border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900 shadow-2xs">
						<table className="w-full text-left text-xs">
							<thead>
								<tr className="border-b border-slate-100 bg-slate-50/50 text-[11px] font-extrabold uppercase tracking-wider text-slate-400 dark:border-slate-800 dark:bg-slate-800/30">
									<th className="py-3 pl-4 pr-3">Թեստ / Խումբ</th>
									<th className="py-3 px-3">Ամսաթիվ</th>
									<th className="py-3 px-3 text-center">Միավոր</th>
									<th className="py-3 px-3 text-center">Ճիշտ / Սխալ</th>
									<th className="py-3 px-3">Տևողություն</th>
									<th className="py-3 pr-4 text-right">Արդյունք</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-semibold text-slate-700 dark:text-slate-200">
								{student.recentResults.map((result) => {
									const isPassed = result.status === "passed";
									return (
										<tr
											key={result.id}
											className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors"
										>
											<td className="py-3 pl-4 pr-3">
												<div className="flex items-center gap-2">
													<span
														className={`size-2 rounded-full ${
															result.type === "test" ? "bg-blue-500" : "bg-teal-500"
														}`}
													/>
													<span className="font-bold">{result.title}</span>
													<span className="text-[10px] text-slate-400">
														({result.type === "test" ? "Թեստ" : "Խումբ"})
													</span>
												</div>
											</td>
											<td className="py-3 px-3 text-slate-400 font-medium whitespace-nowrap">
												{formatDate(result.date)}
											</td>
											<td className="py-3 px-3 text-center font-black">
												<span
													className={
														result.score >= 80
															? "text-emerald-600 dark:text-emerald-400"
															: result.score >= 50
																? "text-amber-600 dark:text-amber-400"
																: "text-rose-600 dark:text-rose-400"
													}
												>
													{result.score}%
												</span>
											</td>
											<td className="py-3 px-3 text-center">
												<div className="inline-flex items-center gap-1.5 font-bold">
													<span className="text-emerald-600 dark:text-emerald-400">
														{result.correct_count ?? 0}
													</span>
													<span className="text-slate-300">/</span>
													<span className="text-rose-500 dark:text-rose-400">
														{result.wrong_count ?? 0}
													</span>
												</div>
											</td>
											<td className="py-3 px-3 text-slate-400">
												<div className="flex items-center gap-1">
													<Clock className="size-3 text-slate-300" />
													<span>{formatTime(result.time_spent)}</span>
												</div>
											</td>
											<td className="py-3 pr-4 text-right">
												<span
													className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-black ${
														isPassed
															? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400"
															: "bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400"
													}`}
												>
													{isPassed ? (
														<>
															<CheckCircle2 className="size-3" />
															Հանձնված
														</>
													) : (
														<>
															<XCircle className="size-3" />
															Չհանձնված
														</>
													)}
												</span>
											</td>
										</tr>
									);
								})}
							</tbody>
						</table>
					</div>
				)}
			</div>
		</div>
	);
}
