import type { GroupScheduleInfo } from "@/lib/group-schedule";

export function AccessToggleCard({
	grantStudentAccess,
	schedule,
	onToggleAccess,
}: {
	grantStudentAccess: boolean;
	schedule: GroupScheduleInfo;
	onToggleAccess: (value: boolean) => void;
}) {
	return (
		<div className="flex items-center justify-between gap-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
			<div>
				<h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
					Անվճար մուտք թեստերին և խմբերին
				</h3>
				<p className="mt-1 max-w-lg text-xs font-semibold text-slate-500">
					Երբ միացված է, այս խմբի ուսանողները ստանում են student մուտք և կարող են օգտվել կայքի
					խմբերից ու թեստերից առանց վճարման:
				</p>
				<p
					className={`mt-2 text-xs font-bold ${
						schedule.state === "pending"
							? "text-amber-600"
							: schedule.state === "active"
								? "text-emerald-600"
								: "text-slate-400"
					}`}
				>
					{schedule.detail}
				</p>
			</div>
			<button
				type="button"
				role="switch"
				aria-checked={grantStudentAccess}
				aria-label="Անվճար մուտք թեստերին և խմբերին"
				onClick={() => onToggleAccess(!grantStudentAccess)}
				className={`relative h-7 w-12 shrink-0 cursor-pointer rounded-full transition-colors ${grantStudentAccess ? "bg-emerald-500" : "bg-slate-300 dark:bg-slate-700"}`}
			>
				<span
					className={`absolute top-0.5 size-6 rounded-full bg-white shadow transition-all ${grantStudentAccess ? "left-[22px]" : "left-0.5"}`}
				/>
			</button>
		</div>
	);
}
