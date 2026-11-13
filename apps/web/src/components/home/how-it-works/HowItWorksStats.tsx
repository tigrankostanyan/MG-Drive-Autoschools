const STATS = [
	{
		label: "Տեսություն",
		accent: "text-blue-400",
		value: "30",
		unit: "ժամ",
		caption: "Շաբաթական 3 անգամ",
	},
	{
		label: "Պրակտիկա",
		accent: "text-violet-400",
		value: "10-24",
		unit: "ժամ",
		caption: "Անհատական գրաֆիկով",
	},
	{
		label: "Ընդհանուր",
		accent: "text-emerald-400",
		value: "2.5",
		unit: "ամիս",
		caption: "Մինչև պետական քննություն",
	},
];

export function HowItWorksStats() {
	return (
		<section className="hero-ink relative overflow-hidden py-16 sm:py-20 lg:py-24 border-y border-slate-800/80 text-white">
			<div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(59,130,246,0.12),transparent)]" />
			<div className="pointer-events-none absolute -right-40 -top-40 size-[500px] rounded-full bg-blue-500/10 blur-[130px]" />
			<div className="pointer-events-none absolute -left-40 -bottom-40 size-[500px] rounded-full bg-indigo-500/10 blur-[130px]" />

			<div className="container relative z-10">
				<div className="text-center max-w-2xl mx-auto mb-12 sm:mb-14">
					<div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-400/25 text-blue-400 text-xs font-bold uppercase tracking-wider mb-3">
						<span className="size-1.5 rounded-full bg-blue-400 animate-pulse" />
						Տևողություն և պլան
					</div>
					<h2 className="text-3xl sm:text-4xl lg:text-[42px] font-black text-white tracking-tight leading-tight">
						Որքա՞ն է տևում
					</h2>
					<p className="mt-3 text-sm sm:text-base text-slate-300 font-medium">
						Օպտիմիզացված ուսուցում՝ առանց որակի կորստի
					</p>
				</div>

				<div className="grid md:grid-cols-3 gap-8 sm:gap-12 text-center divide-y md:divide-y-0 md:divide-x divide-slate-800/80">
					{STATS.map((stat) => (
						<div key={stat.label} className="px-4 py-6 md:py-0 group">
							<p
								className={`font-mono text-xs font-bold uppercase tracking-[0.2em] mb-4 ${stat.accent}`}
							>
								{stat.label}
							</p>
							<div className="font-display text-6xl sm:text-7xl lg:text-8xl font-black text-white tracking-tight flex items-baseline justify-center gap-2">
								<span>{stat.value}</span>
								<span className={`text-2xl sm:text-3xl font-bold tracking-normal ${stat.accent}`}>
									{stat.unit}
								</span>
							</div>
							<p className="mt-4 text-sm text-slate-300 font-medium">{stat.caption}</p>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
