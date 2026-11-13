import { CheckCircle2, Clock, Lock, Unlock } from "lucide-react";
import type { StudentGroupData } from "@/lib/api/types";
import type { GroupScheduleInfo } from "@/lib/group-schedule";

export function GroupCardBadges({
	group,
	schedule,
}: {
	group: StudentGroupData;
	schedule: GroupScheduleInfo;
}) {
	return (
		<div className="flex items-center gap-2 mb-2">
			<span className="font-mono text-[10px] font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
				#{group.id}
			</span>
			{schedule.state === "no-schedule" || schedule.state === "active" ? (
				<span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
					<CheckCircle2 className="size-3" /> {schedule.label}
				</span>
			) : schedule.state === "pending" ? (
				<span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-600 dark:bg-amber-950/40 dark:text-amber-400">
					<Clock className="size-3" /> {schedule.label}
				</span>
			) : (
				<span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-400 dark:bg-slate-800 dark:text-slate-500">
					<Clock className="size-3" /> {schedule.label}
				</span>
			)}
			{group.grantStudentAccess ? (
				<span className="inline-flex items-center gap-1 rounded-full bg-accent/10 px-2 py-0.5 text-[10px] font-bold text-accent dark:bg-accent/20">
					<Unlock className="size-3" /> Մուտք՝ թույլատրված
				</span>
			) : (
				<span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-400 dark:bg-slate-800 dark:text-slate-500">
					<Lock className="size-3" /> Առանց մուտքի
				</span>
			)}
		</div>
	);
}
