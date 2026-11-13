import { SectionHeading } from "@/components/shared/SectionHeading";
import { HOW_IT_WORKS_BENEFITS } from "./data";

export function HowItWorksBenefits() {
	return (
		<section className="py-16 sm:py-20 lg:py-24 bg-slate-50/60 dark:bg-slate-950 relative overflow-hidden border-t border-slate-200/80 dark:border-slate-800">
			{/* Subtle ambient depth */}
			<div className="pointer-events-none absolute -left-40 top-1/2 -translate-y-1/2 size-[500px] rounded-full bg-primary/[0.03] blur-[120px]" />
			<div className="pointer-events-none absolute -right-40 top-1/2 -translate-y-1/2 size-[500px] rounded-full bg-blue-500/[0.03] blur-[120px]" />

			<div className="container relative z-10">
				<SectionHeading
					align="left"
					eyebrow="Առավելություններ"
					title="Ինչու՞ ընտրել մեզ"
					description="Նորարարական մոտեցում, որը փոխում է վարորդական ուսուցման չափանիշները Հայաստանում։"
					className="mb-12 sm:mb-14"
				/>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
					{HOW_IT_WORKS_BENEFITS.map((b) => (
						<div
							key={b.title}
							className="group relative overflow-hidden rounded-2xl sm:rounded-3xl p-7 sm:p-8 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-[0_4px_20px_-4px_rgba(15,23,42,0.06)] hover:shadow-[0_16px_36px_-6px_rgba(4,77,218,0.12)] hover:border-primary/40 transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between"
						>
							<div
								className={`pointer-events-none absolute right-0 top-0 w-48 h-48 ${b.bg} rounded-full blur-3xl -mr-16 -mt-16 opacity-40 group-hover:opacity-70 transition-opacity duration-500`}
							/>
							<div className="relative z-10">
								<div className="size-12 rounded-2xl bg-primary/10 border border-primary/15 text-primary flex items-center justify-center mb-6 shadow-xs group-hover:scale-105 group-hover:bg-primary group-hover:text-white transition-all duration-300">
									<b.icon className="size-5.5" />
								</div>
								<h3 className="text-lg sm:text-xl font-bold text-slate-950 group-hover:text-primary transition-colors">
									{b.title}
								</h3>
								<p className="mt-2.5 text-sm leading-relaxed text-slate-600 font-medium">
									{b.text}
								</p>
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
