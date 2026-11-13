import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import heroRoad from "@/assets/hero-road.webp";
import { useAuthModal } from "@/components/auth/auth-modal-context";
import { Button } from "@/components/ui/button";
import { useSession } from "@/hooks/use-session";

export function FooterCta() {
	const { user } = useSession();
	const { openAuthModal } = useAuthModal();

	return (
		<div className="relative w-full py-16 sm:py-20 overflow-hidden bg-slate-950 border-t border-white/10">
			{/* Top edge hairline light reflection */}
			<div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
			<div className="pointer-events-none absolute -right-20 -bottom-20 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl" />

			<div className="absolute inset-0 z-0">
				<img
					src={heroRoad}
					alt="Մայրուղի՝ արևամուտի լույսի ներքո"
					className="w-full h-full object-cover object-center opacity-10 mix-blend-luminosity"
				/>
				<div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-950 to-slate-950" />
			</div>

			<div className="container relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 py-2">
				<div className="flex flex-col text-white text-center md:text-left">
					<h2 className="text-2xl sm:text-3xl lg:text-4xl 2xl:text-[42px] font-extrabold tracking-tight mb-2.5">
						Պատրա՞ստ եք սկսել ձեր վարորդական ուղին
					</h2>
					<p className="text-slate-300 text-base sm:text-lg 2xl:text-xl max-w-xl 2xl:max-w-2xl">
						Կատարեք առաջին քայլը դեպի վստահ վարում։ Գրանցվեք այսօր։
					</p>
				</div>
				{user ? (
					<Button
						asChild
						size="lg"
						className="shrink-0 gap-3.5 group rounded-full font-bold uppercase tracking-wider bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/30 cursor-pointer"
					>
						<Link to="/tests">
							<span>Սկսել հիմա</span>
							<div className="size-6 rounded-full bg-white/20 flex items-center justify-center transition-transform duration-300 group-hover:translate-x-1 shrink-0">
								<ArrowRight className="size-3.5" />
							</div>
						</Link>
					</Button>
				) : (
					<Button
						type="button"
						size="lg"
						onClick={openAuthModal}
						className="shrink-0 gap-3.5 group rounded-full font-bold uppercase tracking-wider bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/30 cursor-pointer"
					>
						<span>Սկսել հիմա</span>
						<div className="size-6 rounded-full bg-white/20 flex items-center justify-center transition-transform duration-300 group-hover:translate-x-1 shrink-0">
							<ArrowRight className="size-3.5" />
						</div>
					</Button>
				)}
			</div>
		</div>
	);
}
