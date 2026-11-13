import { HERO_DOCK_FEATURES } from "./data";

export function HeroFeatureDock() {
	return (
		<div className="mt-8 sm:mt-12 lg:mt-16 translate-y-4 sm:translate-y-6 lg:translate-y-8 -mb-4 sm:-mb-6 lg:-mb-8 w-full relative z-20">
			<div className="relative rounded-2xl lg:rounded-3xl bg-slate-950/90 dark:bg-slate-950/95 border border-white/10 p-3.5 sm:p-4.5 lg:p-5 2xl:p-6 shadow-[0_20px_50px_-10px_rgba(0,0,0,0.45)] backdrop-blur-xl overflow-hidden">
				{/* Top edge hairline light reflection */}
				<div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5 sm:gap-3.5 lg:gap-3 2xl:gap-4 items-center">
					{HERO_DOCK_FEATURES.map(({ Icon, title, desc, isLast }) => {
						const edgeClass = isLast
							? "col-span-1 sm:col-span-2 lg:col-span-1"
							: "lg:border-r lg:border-white/10 lg:pr-3 xl:pr-4 2xl:pr-6";
						return (
							<div
								key={title}
								className={`relative flex items-center gap-3.5 p-2 sm:p-2.5 2xl:p-3 rounded-xl hover:bg-white/[0.04] transition-all duration-300 group cursor-default ${edgeClass}`}
							>
								<div className="size-10 sm:size-11.5 2xl:size-12 rounded-xl 2xl:rounded-2xl bg-blue-500/15 border border-blue-400/25 flex items-center justify-center text-blue-400 shrink-0 group-hover:scale-105 group-hover:bg-primary group-hover:text-white group-hover:border-primary group-hover:shadow-[0_0_20px_rgba(4,77,218,0.35)] transition-all duration-300">
									<Icon className="size-5 2xl:size-5.5 transition-transform" />
								</div>
								<div className="min-w-0">
									<h4 className="text-[11.5px] sm:text-[12px] 2xl:text-[13px] font-black uppercase tracking-wider text-white group-hover:text-blue-300 transition-colors truncate">
										{title}
									</h4>
									<p className="text-[10.5px] sm:text-[11px] 2xl:text-[12px] text-slate-400 mt-0.5 leading-snug font-medium line-clamp-1">
										{desc}
									</p>
								</div>
							</div>
						);
					})}
				</div>
			</div>
		</div>
	);
}
