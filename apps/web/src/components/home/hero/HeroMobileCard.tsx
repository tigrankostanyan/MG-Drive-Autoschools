import { heroCarBg, heroCarBgMobileWebp, heroCarBgWebp } from "./data";

export function HeroMobileCard() {
	return (
		<div className="lg:hidden my-6 sm:my-8">
			<div className="relative aspect-[16/10] rounded-2xl overflow-hidden shadow-xl border border-slate-200/80 dark:border-slate-800">
				<picture>
					<source srcSet={heroCarBgMobileWebp} type="image/webp" media="(max-width: 767px)" />
					<source srcSet={heroCarBgWebp} type="image/webp" />
					<img
						src={heroCarBg}
						alt="MG Drive վարման դպրոցի ուսումնական մեքենան"
						width={1342}
						height={784}
						fetchPriority="high"
						decoding="async"
						className="w-full h-full object-cover object-[78%_center]"
					/>
				</picture>
				<div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/85 via-slate-950/35 to-transparent p-4 flex items-end justify-between">
					<div className="text-white">
						<div className="text-[10.5px] font-bold uppercase tracking-wider text-blue-400">
							Պաշտոնական վարման դպրոց
						</div>
						<div className="text-base font-black leading-tight mt-0.5">
							Որակյալ վարորդական կրթություն
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
