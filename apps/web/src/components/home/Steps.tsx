import { Car, ClipboardList, GraduationCap, type LucideIcon, MonitorPlay } from "lucide-react";
import { RevealOnScroll } from "@/components/shared/RevealOnScroll";

const STEPS: {
	num: string;
	icon: LucideIcon;
	title: string;
	text: string;
}[] = [
	{
		num: "01",
		icon: ClipboardList,
		title: "Գրանցվեք",
		text: "Լրացրեք գրանցման ձևը կամ մուտք գործեք Google-ով։",
	},
	{
		num: "02",
		icon: MonitorPlay,
		title: "Սովորեք տեսությունը",
		text: "Անցեք խմբերի հարցերը և դիտեք մանրամասն բացատրությունները։",
	},
	{
		num: "03",
		icon: Car,
		title: "Գործնական դասեր",
		text: "Ընտրեք հարմար ժամ և սովորեք վարել փորձառու հրահանգչի հետ։",
	},
	{
		num: "04",
		icon: GraduationCap,
		title: "Հանձնեք քննությունը",
		text: "Ամրապնդեք գիտելիքները թեստերով և վստահ գնացեք քննության։",
	},
];

export function Steps() {
	return (
		<section className="relative overflow-hidden py-20 sm:py-24 lg:py-28 bg-white dark:bg-slate-950">
			{/* Ambient subtle background glow */}
			<div className="pointer-events-none absolute -right-40 top-1/2 -translate-y-1/2 size-[600px] rounded-full bg-primary/[0.03] dark:bg-primary/5 blur-[120px]" />
			<div className="pointer-events-none absolute -left-40 top-1/2 -translate-y-1/2 size-[600px] rounded-full bg-blue-500/[0.03] dark:bg-blue-600/5 blur-[120px]" />

			<div className="container relative z-10">
				<RevealOnScroll>
					<div className="mx-auto max-w-2xl text-center">
						<div className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/[0.06] backdrop-blur-md px-3.5 py-1.5 mb-3 shadow-xs">
							<span className="size-1.5 rounded-full bg-primary animate-pulse" />
							<span className="text-[11.5px] font-black uppercase tracking-wider text-primary">
								Ինչպես է աշխատում
							</span>
						</div>
						<h2 className="mt-2 text-3xl sm:text-4xl lg:text-[42px] font-black text-slate-950 dark:text-white tracking-tight leading-tight">
							Ընդամենը 4 քայլ՝ Ձեր նպատակին հասնելու համար
						</h2>
						<p className="mt-3.5 text-sm sm:text-base text-slate-600 dark:text-slate-400 font-medium max-w-xl mx-auto">
							Պարզ և հստակ գործընթաց՝ առաջին գրանցումից մինչև վարորդական վկայականի ստացում
						</p>
					</div>
				</RevealOnScroll>

				<div className="relative grid gap-8 sm:grid-cols-2 lg:grid-cols-4 2xl:gap-12 mt-14 sm:mt-16 lg:mt-20">
					{/* Connecting subtle line on desktop aligned with center of unified badge */}
					<div className="hidden lg:block absolute left-[12.5%] right-[12.5%] top-[52px] h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent z-0" />

					{STEPS.map((step, idx) => (
						<RevealOnScroll key={step.num} delay={idx * 80} className="h-full">
							<div className="group relative flex flex-col items-center text-center p-5 2xl:p-6 rounded-2xl transition-all duration-300 hover:bg-white/60 dark:hover:bg-slate-900/60 h-full">
								{/* Unified Icon & Number Badge */}
								<div className="relative z-10 mb-5">
									<div className="relative grid size-16 sm:size-17 2xl:size-18 place-items-center rounded-2xl 2xl:rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 text-primary shadow-sm group-hover:border-primary/40 group-hover:shadow-xl group-hover:shadow-primary/15 transition-all duration-300 group-hover:-translate-y-1">
										<step.icon className="size-7 2xl:size-7.5 transition-transform duration-300 group-hover:scale-110" />

										{/* Integrated Number Tag */}
										<span className="absolute -top-2.5 -right-2.5 grid size-7 2xl:size-7.5 place-items-center rounded-full bg-gradient-to-br from-blue-600 via-primary to-blue-700 font-mono text-[11px] 2xl:text-xs font-black text-white shadow-md shadow-primary/25 ring-4 ring-white dark:ring-slate-950 transition-transform duration-300 group-hover:scale-110">
											{step.num}
										</span>
									</div>
								</div>

								{/* Step Title & Description */}
								<h3 className="mt-2 text-base sm:text-lg 2xl:text-xl font-bold text-slate-950 dark:text-white tracking-tight group-hover:text-primary transition-colors duration-200">
									{step.title}
								</h3>
								<p className="mt-2 text-xs sm:text-sm 2xl:text-[14.5px] leading-relaxed text-slate-600 dark:text-slate-400 max-w-[260px] 2xl:max-w-[290px] font-normal mx-auto">
									{step.text}
								</p>
							</div>
						</RevealOnScroll>
					))}
				</div>
			</div>
		</section>
	);
}
