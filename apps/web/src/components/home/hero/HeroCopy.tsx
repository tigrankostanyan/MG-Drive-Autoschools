import { Link } from "@tanstack/react-router";
import { ArrowRight, CheckCircle2, Download } from "lucide-react";
import { useAuthModal } from "@/components/auth/auth-modal-context";
import { Button } from "@/components/ui/button";
import { usePwaInstall } from "@/hooks/use-pwa-install";
import { useSession } from "@/hooks/use-session";
import type { HeroSettingItem } from "@/lib/api/hero-setting";
import { splitHeroTitle } from "./data";

export function HeroCopy({ data }: { data?: HeroSettingItem | null | undefined }) {
	const { user } = useSession();
	const { openAuthModal } = useAuthModal();
	const { install } = usePwaInstall();
	const { titleLine1, titleLine2 } = splitHeroTitle(data?.title);

	return (
		<div className="lg:col-span-7 xl:col-span-6 relative z-10 pt-1 lg:pt-2 2xl:pt-4">
			<h1 className="text-[32px] sm:text-4xl md:text-5xl lg:text-[58px] xl:text-[68px] 2xl:text-[76px] font-black text-slate-950 dark:text-white leading-[1.08] 2xl:leading-[1.05] tracking-tight mb-4 sm:mb-5 2xl:mb-6">
				<span className="block font-black text-slate-950 dark:text-white drop-shadow-sm">
					{titleLine1}.
				</span>
				<span className="block text-primary font-black mt-1 sm:mt-2 drop-shadow-sm">
					{titleLine2}.
				</span>
			</h1>

			<p className="text-[15px] sm:text-base lg:text-[17px] 2xl:text-[18.5px] text-slate-600 dark:text-slate-300 mb-6 sm:mb-8 2xl:mb-10 max-w-xl 2xl:max-w-2xl leading-relaxed font-medium">
				{data?.subtitle ||
					"Պրոֆեսիոնալ վարման դասեր Հայաստանում՝ տեսական խմբեր, քննական թեստեր և գործնական պարապմունքներ նոր սովորողների համար:"}
			</p>

			<div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 sm:gap-4 mb-6 sm:mb-8 2xl:mb-10">
				{user ? (
					<Button asChild size="lg" className="flex items-center justify-center gap-3 group">
						<Link to="/tests">
							<span>{data?.primary_button_text || "Սկսել հիմա"}</span>
							<div className="size-6 2xl:size-6.5 rounded-full bg-white/20 flex items-center justify-center transition-transform duration-300 group-hover:translate-x-1 shrink-0">
								<ArrowRight className="size-3.5" />
							</div>
						</Link>
					</Button>
				) : (
					<Button
						type="button"
						size="lg"
						onClick={openAuthModal}
						className="flex items-center justify-center gap-3 group cursor-pointer"
					>
						<span>{data?.primary_button_text || "Սկսել հիմա"}</span>
						<div className="size-6 2xl:size-6.5 rounded-full bg-white/20 flex items-center justify-center transition-transform duration-300 group-hover:translate-x-1 shrink-0">
							<ArrowRight className="size-3.5" />
						</div>
					</Button>
				)}
				<Button
					type="button"
					onClick={() => void install()}
					className="inline-flex items-center justify-start gap-3.5 cursor-pointer bg-white hover:bg-slate-50 text-slate-900 rounded-full p-1 pr-6 h-auto w-fit shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-all duration-300 transform hover:-translate-y-0.5 group border-none"
				>
					<div className="relative flex items-center justify-center size-10 rounded-full bg-primary text-white shrink-0 group-hover:scale-110 transition-all duration-300 overflow-hidden shadow-lg shadow-primary/30 ring-2 ring-primary/20 ring-offset-2">
						<div className="absolute inset-0 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-white/60 to-transparent transition-transform duration-[800ms] ease-in-out z-0" />
						<Download className="size-5 animate-bounce relative z-10" />
					</div>
					<span className="font-bold tracking-wider text-[13px] 2xl:text-[13.5px]">
						Ներբեռնել App-ը
					</span>
				</Button>
			</div>
			<div className="flex flex-wrap items-center gap-x-3.5 2xl:gap-x-5 gap-y-2 text-[12px] sm:text-[13px] 2xl:text-[14px] font-bold text-slate-800 dark:text-slate-200 pt-1">
				<div className="flex items-center gap-2">
					<CheckCircle2 className="size-4.5 text-primary shrink-0" />
					<span>ՀՀ ՃՈ հաստատված</span>
				</div>
				<span className="text-slate-300 dark:text-slate-700 hidden sm:inline">|</span>
				<div className="flex items-center gap-2">
					<CheckCircle2 className="size-4.5 text-primary shrink-0" />
					<span>Սերտիֆիկացված հրահանգիչներ</span>
				</div>
				<span className="text-slate-300 dark:text-slate-700 hidden sm:inline">|</span>
				<div className="flex items-center gap-2">
					<CheckCircle2 className="size-4.5 text-primary shrink-0" />
					<span>Ճկուն ժամանակացույց</span>
				</div>
			</div>
		</div>
	);
}
