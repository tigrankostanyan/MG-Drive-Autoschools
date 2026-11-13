import { Car, type LucideIcon, MonitorPlay, Zap } from "lucide-react";
import { RevealOnScroll } from "@/components/shared/RevealOnScroll";

const PROGRAM_CARDS: {
	icon: LucideIcon;
	label: string;
	value: string;
	unit: string;
	schedule: string;
	note: string;
}[] = [
	{
		icon: MonitorPlay,
		label: "Տեսություն",
		value: "30",
		unit: "ժ",
		schedule: "Շաբաթական 3 անգամ · 2 ժամ",
		note: "Խմբային և առցանց քննարկումներ",
	},
	{
		icon: Car,
		label: "Պրակտիկա",
		value: "16",
		unit: "ժ",
		schedule: "Անհատական · ձեր գրաֆիկով",
		note: "Քաղաքային երթևեկություն և ավտոդրոմ",
	},
	{
		icon: Zap,
		label: "Ընդհանուր",
		value: "2.5",
		unit: "ամիս",
		schedule: "46 դասաժամ · 10 շաբաթ",
		note: "Ամբողջական պատրաստում քննությանը",
	},
];

export function Program() {
	return (
		<section className="hero-ink relative overflow-hidden py-20 sm:py-24 lg:py-28 2xl:py-32">
			{/* Ambient atmospheric glows */}
			<div className="pointer-events-none absolute -right-40 -top-40 size-[600px] rounded-full bg-blue-500/15 blur-[130px]" />
			<div className="pointer-events-none absolute -left-40 -bottom-40 size-[600px] rounded-full bg-indigo-500/10 blur-[130px]" />
			<div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(59,130,246,0.12),rgba(255,255,255,0))]" />

			<div className="container relative z-10">
				<RevealOnScroll>
					<div className="mb-14 2xl:mb-16 text-center max-w-2xl mx-auto">
						<div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-400/25 text-blue-400 text-xs font-bold uppercase tracking-wider mb-3">
							<span className="size-1.5 rounded-full bg-blue-400 animate-pulse" />
							Տևողություն և պլան
						</div>
						<h2 className="mt-2 text-3xl sm:text-4xl lg:text-5xl 2xl:text-[54px] font-black text-white tracking-tight">
							Ուսումնական ծրագիր
						</h2>
						<p className="mt-3 text-slate-300 text-[15px] sm:text-base 2xl:text-lg font-medium">
							Հավասարակշռված տեսական և գործնական պարապմունքներ՝ վարորդական իրավունքի հանձնման համար
						</p>
					</div>
				</RevealOnScroll>

				<div className="grid gap-6 lg:gap-8 2xl:gap-10 lg:grid-cols-3">
					{PROGRAM_CARDS.map((card, idx) => (
						<RevealOnScroll key={card.label} delay={idx * 90} className="h-full">
							<div className="relative overflow-hidden rounded-3xl 2xl:rounded-[2rem] border border-white/10 bg-slate-950/90 p-8 sm:p-9 2xl:p-11 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/50 hover:shadow-[0_20px_50px_rgba(4,77,218,0.25)] flex flex-col justify-between group h-full">
								<div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:via-blue-400/60 transition-colors duration-500" />
								<div className="pointer-events-none absolute -top-16 -right-16 size-36 rounded-full bg-blue-500/10 blur-2xl group-hover:bg-blue-500/20 transition-all duration-500" />
								<div>
									<div className="size-12 rounded-2xl bg-blue-500/15 border border-blue-400/25 flex items-center justify-center text-blue-400 shadow-sm group-hover:scale-105 group-hover:bg-primary group-hover:text-white group-hover:border-primary group-hover:shadow-[0_0_20px_rgba(4,77,218,0.35)] transition-all duration-300">
										<card.icon className="size-6" />
									</div>
									<p className="mt-7 font-mono text-xs uppercase tracking-[0.2em] font-bold text-blue-300">
										{card.label}
									</p>
									<div className="mt-2.5 font-display text-5xl sm:text-6xl 2xl:text-7xl font-black text-white tracking-tight flex items-baseline gap-2">
										<span>{card.value}</span>
										<span className="text-2xl sm:text-3xl 2xl:text-4xl font-bold text-blue-400">
											{card.unit}
										</span>
									</div>
									<p className="mt-3.5 text-[15px] sm:text-base 2xl:text-[17px] font-semibold text-slate-200 leading-relaxed">
										{card.schedule}
									</p>
								</div>
								<div className="mt-6 pt-5 border-t border-white/10 flex items-center gap-2 text-xs sm:text-[13px] text-slate-400 font-medium">
									<div className="size-1.5 rounded-full bg-blue-400 shrink-0" />
									<span>{card.note}</span>
								</div>
							</div>
						</RevealOnScroll>
					))}
				</div>
			</div>
		</section>
	);
}
