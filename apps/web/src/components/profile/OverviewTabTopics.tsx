import { Link } from "@tanstack/react-router";
import { CheckCircle2, Circle } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ProfileData } from "@/lib/api/profile";
import { toPercent } from "@/lib/utils";

type OverviewTopics = NonNullable<ProfileData>["completedTopics"];

const PERCENT_COMPLETE = 100;

interface OverviewTabTopicsProps {
	topics: OverviewTopics;
	completedGroups: number;
	totalGroups: number;
}

export function OverviewTabTopics({
	topics,
	completedGroups,
	totalGroups,
}: OverviewTabTopicsProps) {
	return (
		<div>
			<div className="mb-4 flex items-center justify-between">
				<div>
					<h3 className="text-lg font-black text-slate-900">Խմբերի և Թեմաների առաջընթաց</h3>
					<p className="text-xs text-slate-500 font-medium">
						Յուրացված հարցերի քանակն ըստ հիմնական թեմաների
					</p>
				</div>
				<span className="text-xs font-extrabold text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
					{completedGroups}/{totalGroups} Ավարտված
				</span>
			</div>

			{topics.length === 0 ? (
				<div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/60 p-8 text-center">
					<p className="text-sm font-bold text-slate-700">Դեռ ընթացք չունեք</p>
					<p className="mt-1 text-xs font-medium text-slate-500">
						Սկսեք առաջին թեմայից, և ձեր առաջընթացը կհայտնվի այստեղ։
					</p>
					<Button asChild variant="primary" size="sm" className="mt-4">
						<Link to="/groups">Սկսել ուսուցումը</Link>
					</Button>
				</div>
			) : (
				<div className="grid gap-3.5 sm:grid-cols-2 xl:grid-cols-3">
					{topics.map((t) => {
						const total = t.totalQuestions || t.answeredCount || 1;
						const pct = toPercent(t.answeredCount, total);
						const isCompleted = pct === PERCENT_COMPLETE;
						return (
							<div
								key={t.groupId}
								className="group relative flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-5 transition-all duration-200 hover:border-blue-200 hover:shadow-md hover:shadow-blue-500/5"
							>
								<div>
									<div className="flex items-start justify-between gap-2">
										<span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-extrabold text-slate-600 uppercase tracking-wide">
											Թեմա
										</span>
										<div
											className={`grid size-6 shrink-0 place-items-center rounded-full ${
												isCompleted ? "bg-emerald-500 text-white" : "bg-slate-100 text-slate-400"
											}`}
										>
											{isCompleted ? (
												<CheckCircle2 className="size-4" />
											) : (
												<Circle className="size-3.5" />
											)}
										</div>
									</div>

									<p className="mt-2 text-sm font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
										{t.title}
									</p>
								</div>

								<div className="mt-4">
									<div className="flex items-center justify-between text-xs font-bold text-slate-500 mb-1.5">
										<span>
											{t.answeredCount} / {total} հարց
										</span>
										<span
											className={
												isCompleted ? "text-emerald-600 font-black" : "text-blue-600 font-bold"
											}
										>
											{pct}%
										</span>
									</div>
									<div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
										<div
											className={`h-full rounded-full transition-all duration-500 ${
												isCompleted
													? "bg-emerald-500"
													: "bg-gradient-to-r from-blue-500 to-indigo-500"
											}`}
											style={{ width: `${pct}%` }}
										/>
									</div>
								</div>
							</div>
						);
					})}
				</div>
			)}
		</div>
	);
}
