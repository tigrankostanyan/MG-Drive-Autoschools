import { IconBox } from "@/components/ui/icon-box";
import { ABOUT_FEATURES } from "./data";

export function AboutFeatureRows() {
	return (
		<div className="space-y-3.5 2xl:space-y-4 pt-1">
			{ABOUT_FEATURES.map(({ Icon, title, desc }) => (
				<div
					key={title}
					className="group flex items-start gap-4 p-4.5 2xl:p-5 rounded-2xl sm:rounded-3xl bg-white dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-primary/40 transition-all duration-300"
				>
					<IconBox
						variant="primary"
						size="lg"
						className="group-hover:scale-105 group-hover:bg-primary group-hover:text-white mt-0.5"
					>
						<Icon className="size-5 transition-transform" />
					</IconBox>
					<div>
						<h3 className="text-base 2xl:text-lg font-bold text-slate-950 dark:text-white group-hover:text-primary transition-colors">
							{title}
						</h3>
						<p className="mt-1 text-[13px] 2xl:text-sm leading-relaxed text-slate-600 dark:text-slate-400 font-medium">
							{desc}
						</p>
					</div>
				</div>
			))}
		</div>
	);
}
