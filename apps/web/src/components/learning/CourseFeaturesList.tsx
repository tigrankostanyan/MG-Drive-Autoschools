import { CheckCircle2 } from "lucide-react";

interface CourseFeaturesListProps {
	features: string[];
	isPopular: boolean;
}

export function CourseFeaturesList({ features, isPopular }: CourseFeaturesListProps) {
	return (
		<div
			className={`mt-6 pt-5 border-t ${
				isPopular ? "border-white/10" : "border-slate-100 dark:border-slate-800"
			}`}
		>
			<p
				className={`text-xs font-bold uppercase tracking-wider mb-3.5 ${
					isPopular ? "text-slate-400" : "text-slate-500 dark:text-slate-400"
				}`}
			>
				Ծրագրում ներառված է՝
			</p>
			<ul className="space-y-2.5">
				{features.map((feat) => (
					<li
						key={feat}
						className={`flex items-start gap-2.5 text-xs sm:text-[13px] leading-snug font-medium ${
							isPopular ? "text-slate-200" : "text-slate-700 dark:text-slate-300"
						}`}
					>
						<CheckCircle2 className="size-4 text-emerald-400 shrink-0 mt-0.5" />
						<span>{feat}</span>
					</li>
				))}
			</ul>
		</div>
	);
}
