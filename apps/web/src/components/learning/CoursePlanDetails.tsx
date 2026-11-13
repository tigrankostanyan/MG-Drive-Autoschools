import type { CoursePlan } from "./course-plans";

interface CoursePlanDetailsProps {
	plan: CoursePlan;
	isPopular: boolean;
}

export function CoursePlanDetails({ plan, isPopular }: CoursePlanDetailsProps) {
	return (
		<div
			className={`mt-5 p-4 rounded-xl sm:rounded-2xl border flex items-center justify-between ${
				isPopular
					? "bg-white/[0.05] border-white/10"
					: "bg-slate-50/80 dark:bg-slate-800/60 border-slate-100 dark:border-slate-800"
			}`}
		>
			<div>
				<p
					className={`text-[11px] font-bold uppercase tracking-wider ${
						isPopular ? "text-slate-400" : "text-slate-500 dark:text-slate-400"
					}`}
				>
					Տևողություն
				</p>
				<p
					className={`text-xl font-black mt-0.5 ${
						isPopular ? "text-white" : "text-slate-950 dark:text-white"
					}`}
				>
					{plan.duration}
				</p>
			</div>
			<div className="text-right">
				<p
					className={`text-[11px] font-bold uppercase tracking-wider ${
						isPopular ? "text-slate-400" : "text-slate-500 dark:text-slate-400"
					}`}
				>
					Գրաֆիկ
				</p>
				<p
					className={`text-xs font-bold mt-1 ${
						isPopular ? "text-slate-200" : "text-slate-700 dark:text-slate-300"
					}`}
				>
					{plan.schedule}
				</p>
			</div>
		</div>
	);
}
