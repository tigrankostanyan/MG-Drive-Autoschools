import { Car, Users } from "lucide-react";
import g2 from "@/assets/gallery-2.webp";
import { Badge } from "@/components/ui/badge";
import { IconBox } from "@/components/ui/icon-box";

export function AboutVisual() {
	return (
		<div className="lg:col-span-6 grid gap-4 sm:gap-5 2xl:gap-6 sm:grid-cols-[1.1fr_0.9fr] sm:grid-rows-2 relative">
			{/* Main Central Photo Card */}
			<div className="relative overflow-hidden rounded-3xl sm:row-span-2 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.15)] border border-slate-200/80 dark:border-white/10 group">
				<img
					src={g2}
					alt="Ուսանող մեքենայի սրահում"
					loading="lazy"
					decoding="async"
					className="h-full w-full object-cover min-h-[340px] sm:min-h-[490px] 2xl:min-h-[550px] group-hover:scale-105 transition-transform duration-700 ease-out"
				/>
				{/* Subtle bottom gradient on image */}
				<div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-transparent pointer-events-none" />
				<div className="absolute bottom-5 left-5 right-5 text-white pointer-events-none">
					<span className="text-[11px] font-bold uppercase tracking-wider text-blue-400 block mb-1">
						Գործնական դասեր
					</span>
					<p className="text-base 2xl:text-lg font-bold leading-snug drop-shadow-sm">
						Վարելու իրական հմտություններ քաղաքային պայմաններում
					</p>
				</div>
			</div>

			{/* Top Stat Card (Airy Light Glass Card) */}
			<div className="flex flex-col justify-between rounded-3xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-7 2xl:p-8 shadow-[0_15px_35px_-8px_rgba(0,0,0,0.06)] hover:shadow-xl hover:border-primary/30 transition-all duration-300 hover:-translate-y-1">
				<div>
					<div className="flex items-center justify-between mb-2.5">
						<Badge variant="primary">Ավտոպարկ</Badge>
						<IconBox variant="primary" size="md">
							<Car className="size-5" />
						</IconBox>
					</div>
					<h3 className="text-xl sm:text-2xl 2xl:text-[26px] font-black text-slate-950 dark:text-white tracking-tight">
						20+ Ուսումնական մեքենաներ
					</h3>
				</div>
				<p className="mt-3 text-[13px] 2xl:text-sm leading-relaxed text-slate-600 dark:text-slate-400 font-medium">
					Մեր ավտոպարկը համալրված է ժամանակակից, կոմֆորտ և անվտանգ մեքենաներով:
				</p>
			</div>

			{/* Bottom Stat Card (Sleek Deep Navy Card matching hero dock) */}
			<div className="flex flex-col justify-between rounded-3xl bg-slate-950/95 border border-white/10 p-6 sm:p-7 2xl:p-8 text-white relative overflow-hidden shadow-[0_20px_50px_-10px_rgba(0,0,0,0.45)] hover:shadow-2xl hover:border-primary/40 transition-all duration-300 hover:-translate-y-1 group">
				{/* Hairline top reflection */}
				<div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:via-primary/50 transition-colors" />
				{/* Subtle decorative glow orb */}
				<div className="absolute -right-8 -top-8 size-36 bg-blue-500/15 rounded-full blur-2xl pointer-events-none group-hover:scale-125 transition-transform duration-500" />

				<div className="relative z-10 flex items-center justify-between">
					<div>
						<p className="font-display text-4xl sm:text-[42px] 2xl:text-5xl font-black tracking-tight text-white leading-none">
							30<span className="text-primary text-2xl font-bold">+</span>
						</p>
						<p className="text-[12px] font-bold uppercase tracking-wider mt-1.5 text-blue-300">
							Հրահանգիչներ
						</p>
					</div>
					<div className="size-11 rounded-xl bg-blue-500/15 border border-blue-400/25 flex items-center justify-center text-blue-400 group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all">
						<Users className="size-5" />
					</div>
				</div>

				<p className="mt-4 text-[12.5px] 2xl:text-sm leading-relaxed text-slate-300/90 relative z-10 font-medium">
					Փորձառու հրահանգիչները առաջնորդում են սկսնակներին հստակությամբ, վստահությամբ և
					հոգատարությամբ:
				</p>
			</div>
		</div>
	);
}
