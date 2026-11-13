import { Link } from "@tanstack/react-router";
import { BookOpen, CheckCircle2, Clock, Layers } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { ProfileProgressGroup } from "@/lib/api/profile";
import { formatProfileDate } from "@/lib/api/profile";
import { toPercent } from "@/lib/utils";

/** Timeline driven by real per-topic progress from /profile/progress. */
export function LessonsTab({ groups }: { groups: ProfileProgressGroup[] }) {
	return (
		<div className="animate-in fade-in slide-in-from-bottom-3 duration-500 space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h3 className="text-lg font-black text-slate-900">Դասերի ընթացք և ժամանակացույց</h3>
					<p className="text-xs text-slate-500 font-medium">
						Ըստ թեմաների՝ ձեր լուծած հարցերի ընթացքը և վերջին ակտիվությունը
					</p>
				</div>
			</div>

			{groups.length === 0 ? (
				<div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/60 p-8 text-center">
					<Layers className="mx-auto size-8 text-slate-300" />
					<p className="mt-3 text-sm font-bold text-slate-700">Դեռ թեմաներ հասանելի չեն</p>
					<p className="mt-1 text-xs font-medium text-slate-500">
						Հենց ուսուցիչը թեմաներ ավելացնի, դրանք կերևան այստեղ։
					</p>
				</div>
			) : (
				<div className="relative space-y-0 pl-2">
					{groups.map((group, i) => {
						const isCompleted =
							group.hasProgress &&
							(group.totalQuestions === 0 || group.answeredCount >= group.totalQuestions);
						const total = group.totalQuestions || group.answeredCount;
						const pct = toPercent(group.answeredCount, total);
						return (
							<div key={group.groupId} className="group relative flex gap-5 pb-6">
								{i < groups.length - 1 && (
									<div className="absolute left-[20px] top-12 bottom-0 w-0.5 bg-slate-200" />
								)}
								<div
									className={`relative z-10 mt-1.5 grid size-10 shrink-0 place-items-center rounded-full border-4 border-white shadow-md transition-transform group-hover:scale-110 ${
										isCompleted
											? "bg-emerald-500 text-white"
											: "bg-blue-600 text-white ring-4 ring-blue-100"
									}`}
								>
									{isCompleted ? (
										<CheckCircle2 className="size-4.5" />
									) : (
										<Clock className="size-4.5" />
									)}
								</div>

								<div
									className={`flex-1 rounded-2xl border p-5 transition-all ${
										isCompleted
											? "border-slate-200/80 bg-white hover:border-slate-300 shadow-xs"
											: "border-blue-200 bg-gradient-to-br from-blue-50/50 via-white to-indigo-50/30 shadow-md shadow-blue-500/5"
									}`}
								>
									<div className="flex flex-wrap items-center justify-between gap-2 mb-2">
										<div className="flex items-center gap-2">
											<Badge variant={isCompleted ? "completed" : "gradient"} size="sm">
												{isCompleted ? "Ավարտված" : group.hasProgress ? "Ընթացքի մեջ" : "Չսկսված"}
											</Badge>
											<span className="text-xs font-bold text-slate-500 flex items-center gap-1">
												<BookOpen className="size-3.5" />
												{group.answeredCount} / {total} հարց
											</span>
										</div>
										<span className="text-xs font-black text-blue-600">{pct}%</span>
									</div>

									<h4 className="text-sm sm:text-base font-black text-slate-900">
										{group.number != null ? `Թեմա ${group.number} · ` : ""}
										{group.title}
									</h4>

									<div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-100">
										<div
											className={`h-full rounded-full transition-all duration-500 ${
												isCompleted ? "bg-emerald-500" : "bg-blue-600"
											}`}
											style={{ width: `${pct}%` }}
										/>
									</div>

									<div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between text-xs gap-2">
										<span className="text-slate-500 font-semibold">
											Վերջին ակտիվություն՝{" "}
											<span className="text-slate-900 font-bold">
												{formatProfileDate(group.updatedAt)}
											</span>
										</span>
										<Button asChild variant="ghost" size="sm">
											<Link to="/groups">Շարունակել</Link>
										</Button>
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
