import g1 from "@/assets/gallery-1.webp";
import g2 from "@/assets/gallery-2.webp";
import g3 from "@/assets/gallery-3.webp";
import g4 from "@/assets/gallery-4.webp";
import heroRoad from "@/assets/hero-road.webp";
import { RevealOnScroll } from "@/components/shared/RevealOnScroll";

const galleryItems = [
	{
		id: 1,
		img: g1,
		span: "md:col-span-1 md:row-span-1",
		title: "Գործնական վարում",
		subtitle: "Քաղաքային երթևեկություն",
	},
	{
		id: 2,
		img: g2,
		span: "md:col-span-1 md:row-span-2",
		title: "Ժամանակակից ավտոպարկ",
		subtitle: "Ապահով և հարմարավետ մեքենաներ",
	},
	{
		id: 3,
		img: g3,
		span: "md:col-span-1 md:row-span-1",
		title: "Տեսական դասընթաց",
		subtitle: "Հարմարավետ լսարաններ",
	},
	{
		id: 4,
		img: g4,
		span: "md:col-span-1 md:row-span-1",
		title: "Քննական հրապարակ",
		subtitle: "Նախապատրաստում քննությանը",
	},
	{
		id: 5,
		img: heroRoad,
		span: "md:col-span-1 md:row-span-2",
		title: "Փորձառու հրահանգիչներ",
		subtitle: "Անհատական մոտեցում",
	},
	{
		id: 6,
		img: g1, // Reusing g1 for the wide image
		span: "md:col-span-2 md:row-span-1",
		title: "Անվտանգություն",
		subtitle: "Վստահություն ղեկին",
	},
];
export function Gallery() {
	return (
		<section className="py-20 sm:py-24 lg:py-28 2xl:py-32 bg-slate-50/60 dark:bg-slate-950 border-y border-slate-200/60 dark:border-slate-800/60 relative overflow-hidden">
			<div className="container relative z-10">
				<RevealOnScroll>
					<div className="mb-12 sm:mb-16 text-center max-w-2xl mx-auto">
						<div className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/[0.06] backdrop-blur-md px-3.5 py-1.5 mb-3 shadow-xs">
							<span className="size-1.5 rounded-full bg-primary animate-pulse" />
							<span className="text-[11.5px] font-black uppercase tracking-wider text-primary">
								Մեր Առօրյան
							</span>
						</div>
						<h2 className="mt-2 text-3xl sm:text-4xl lg:text-[42px] 2xl:text-[48px] font-black text-slate-950 dark:text-white tracking-tight leading-tight">
							Պատկերասրահ
						</h2>
						<p className="mt-3 text-sm sm:text-base 2xl:text-lg text-slate-600 dark:text-slate-400 font-medium">
							Իրական կադրեր մեր գործնական և տեսական պարապմունքներից
						</p>
					</div>
				</RevealOnScroll>

				<div className="grid grid-cols-1 md:grid-cols-3 auto-rows-[240px] sm:auto-rows-[260px] lg:auto-rows-[290px] 2xl:auto-rows-[330px] gap-5 lg:gap-6 2xl:gap-8">
					{galleryItems.map((item, idx) => (
						<RevealOnScroll key={item.id} delay={idx * 60} className={item.span}>
							<div className="group relative overflow-hidden rounded-3xl h-full shadow-sm hover:shadow-xl border border-slate-200/80 dark:border-slate-800 transition-all duration-300">
								<img
									src={item.img}
									alt={item.title}
									loading="lazy"
									decoding="async"
									className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
								/>
								<div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/25 to-transparent transition-opacity duration-300" />
								<div className="absolute bottom-0 left-0 w-full p-5 sm:p-6 2xl:p-7 transition-all duration-300">
									<p className="font-display text-base sm:text-lg lg:text-xl 2xl:text-2xl font-bold text-white drop-shadow-sm leading-snug">
										{item.title}
									</p>
									<p className="mt-1 text-xs sm:text-sm 2xl:text-[15px] text-slate-300 drop-shadow-sm font-medium">
										{item.subtitle}
									</p>
								</div>
							</div>
						</RevealOnScroll>
					))}
				</div>
			</div>
		</section>
	);
}
