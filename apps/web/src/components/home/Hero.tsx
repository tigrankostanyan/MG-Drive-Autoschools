import type { HeroSettingItem } from "@/lib/api/hero-setting";
import { heroCarBg, heroCarBgWebp } from "./hero/data";
import { HeroCopy } from "./hero/HeroCopy";
import { HeroFeatureDock } from "./hero/HeroFeatureDock";
import { HeroMobileCard } from "./hero/HeroMobileCard";

export function Hero({ data }: { data?: HeroSettingItem | null }) {
	return (
		<section className="relative pt-4 pb-2 sm:pt-6 sm:pb-3 lg:pt-8 lg:pb-4 overflow-x-clip bg-white dark:bg-slate-950">
			<div className="hidden lg:block absolute top-0 right-0 w-[58%] xl:w-[64%] 2xl:w-[68%] h-full overflow-hidden pointer-events-none z-0">
				<picture className="block w-full h-full">
					<source srcSet={heroCarBgWebp} type="image/webp" />
					<img
						src={heroCarBg}
						alt="MG Drive վարման դպրոցի ուսումնական մեքենան մայրուղու վրա"
						width={1342}
						height={784}
						fetchPriority="high"
						decoding="async"
						className="w-full h-full object-cover object-right"
					/>
				</picture>
				{/* Soft, natural left-to-right fade: white on left for readable typography, 100% transparent by halfway point so car & scenery stay crisp and un-fogged */}
				<div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff_0%,#ffffff_15%,rgba(255,255,255,0.65)_28%,rgba(255,255,255,0)_48%)] dark:bg-[linear-gradient(to_right,#020617_0%,#020617_15%,rgba(2,6,23,0.65)_28%,rgba(2,6,23,0)_48%)]" />
				{/* Soft bottom edge fade so no harsh horizontal pixel cut line exists */}
				<div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white via-white/60 to-transparent dark:from-slate-950 dark:via-slate-950/60 dark:to-transparent" />
			</div>

			<div className="container relative z-10">
				{/* Main Hero Content Row */}
				<div className="grid lg:grid-cols-12 gap-8 2xl:gap-12 items-center min-h-[360px] lg:min-h-[460px] 2xl:min-h-[520px]">
					<HeroCopy data={data} />
					{/* Right Column: Open on desktop to let the car, road and highway sign shine clearly */}
					<div className="hidden lg:block lg:col-span-5 xl:col-span-6" />
				</div>

				<HeroMobileCard />
				<HeroFeatureDock />
			</div>
		</section>
	);
}
