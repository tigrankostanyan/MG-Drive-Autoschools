import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Play } from "lucide-react";
import { useAuthModal } from "@/components/auth/auth-modal-context";
import { Button } from "@/components/ui/button";

export function HowItWorksCta({
	isAuthenticated,
}: {
	ctaLink?: "/tests" | "/auth";
	isAuthenticated: boolean;
}) {
	const { openAuthModal } = useAuthModal();

	return (
		<section className="py-16 sm:py-20 lg:py-24 bg-slate-50/60 dark:bg-slate-950 relative overflow-hidden">
			{/* Subtle ambient glow behind CTA */}
			<div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 size-[650px] rounded-full bg-primary/[0.04] blur-[140px]" />

			<div className="container relative z-10">
				{/* Main CTA Card */}
				<div className="relative rounded-3xl sm:rounded-[2.5rem] bg-gradient-to-br from-primary via-blue-600 to-primary bg-[length:200%_auto] overflow-hidden px-6 py-14 sm:px-12 sm:py-16 lg:py-20 text-center shadow-2xl shadow-primary/25 border border-blue-400/30">
					<div className="pointer-events-none absolute -left-20 -top-20 size-[360px] rounded-full bg-white/10 blur-[70px]" />
					<div className="pointer-events-none absolute -right-20 -bottom-20 size-[360px] rounded-full bg-black/15 blur-[70px]" />
					<div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />

					<div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center">
						<div className="size-14 sm:size-15 rounded-2xl bg-white/15 border border-white/25 text-white flex items-center justify-center mb-6 shadow-md backdrop-blur-sm">
							<Play className="size-7 ml-0.5" />
						</div>
						<h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
							Պատրա՞ստ եք սկսել
						</h2>
						<p className="mt-4 text-base sm:text-lg text-blue-100/90 font-medium leading-relaxed max-w-xl">
							Գրանցվեք հիմա, ստացեք մուտք դեպի պլատֆորմ և սկսեք ձեր ճանապարհը դեպի վարորդական
							իրավունք:
						</p>
						<div className="mt-8 sm:mt-10 flex flex-col sm:flex-row gap-3.5 sm:gap-4 w-full sm:w-auto items-stretch sm:items-center">
							{isAuthenticated ? (
								<Button
									asChild
									size="lg"
									className="w-full sm:w-auto bg-white text-primary hover:bg-blue-50 shadow-lg shadow-black/15"
								>
									<Link to="/tests">Անցնել թեստերին</Link>
								</Button>
							) : (
								<Button
									type="button"
									size="lg"
									onClick={openAuthModal}
									className="w-full sm:w-auto bg-white text-primary hover:bg-blue-50 shadow-lg shadow-black/15 cursor-pointer"
								>
									Սկսել ուսուցումը
								</Button>
							)}
							<Button
								asChild
								size="lg"
								variant="outline"
								className="w-full sm:w-auto border-white/30 bg-white/10 text-white hover:bg-white/20 hover:text-white backdrop-blur-sm"
							>
								<Link to="/">Գլխավոր էջ</Link>
							</Button>
						</div>
					</div>
				</div>

				{/* Integrated FAQ Shortcut with light context styling */}
				<div className="mt-8 sm:mt-10 flex justify-center">
					<Link
						to="/how-it-works"
						hash="faq"
						className="inline-flex items-center gap-3 py-2.5 px-6 rounded-full border border-slate-200/90 bg-white hover:bg-slate-50 hover:border-primary/30 text-slate-700 hover:text-primary transition-all duration-200 shadow-xs hover:shadow-sm group"
					>
						<div className="grid size-7 place-items-center rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
							<ArrowUpRight className="size-3.5 group-hover:rotate-45 transition-transform duration-200" />
						</div>
						<span className="font-bold text-xs sm:text-[13px] tracking-wide text-slate-800 group-hover:text-primary">
							Ունե՞ք հարցեր։ Անցեք FAQ բաժին
						</span>
					</Link>
				</div>
			</div>
		</section>
	);
}
