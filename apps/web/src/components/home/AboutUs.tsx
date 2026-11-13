import { Link } from "@tanstack/react-router";
import { ArrowRight, Sparkles } from "lucide-react";
import { RevealOnScroll } from "@/components/shared/RevealOnScroll";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Button } from "@/components/ui/button";
import { AboutFeatureRows } from "./about/AboutFeatureRows";
import { AboutTagStrip } from "./about/AboutTagStrip";
import { AboutVisual } from "./about/AboutVisual";

export function AboutUs() {
	return (
		<section
			id="about"
			className="py-20 lg:py-28 relative overflow-hidden bg-gradient-to-b from-white via-slate-50/50 to-white dark:from-slate-950 dark:via-slate-900/30 dark:to-slate-950"
		>
			{/* Ambient background depth & subtle lighting */}
			<div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
				{/* Soft primary glow top left */}
				<div className="absolute top-[10%] left-[-5%] w-[45%] h-[45%] rounded-full bg-primary/[0.04] dark:bg-primary/10 blur-[130px]" />
				{/* Soft blue glow bottom right */}
				<div className="absolute bottom-[5%] right-[-5%] w-[40%] h-[50%] rounded-full bg-blue-500/[0.05] dark:bg-blue-600/10 blur-[150px]" />
				{/* Subtle geometric dot grid for tactile depth */}
				<div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(0,0,0,0.025)_1px,transparent_0)] bg-[length:28px_28px] dark:bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.025)_1px,transparent_0)]" />
			</div>

			<div className="container relative z-10">
				<div className="grid gap-12 lg:grid-cols-12 lg:gap-12 2xl:gap-16 items-center">
					{/* Ձախ սյունակ */}
					<RevealOnScroll className="lg:col-span-6 space-y-7 2xl:space-y-8 max-w-xl xl:max-w-2xl">
						<SectionHeading
							align="left"
							eyebrow="Մեր վարման դպրոցի մասին"
							eyebrowIcon={<Sparkles className="size-3.5 text-primary" />}
							title="Անվտանգ վարում սովորելու լավագույն վայրը"
							description="Մենք տրամադրում ենք բարձրակարգ վարորդական կրթություն անհատական մոտեցմամբ, ժամանակակից մեքենաներով և անվտանգության վրա հիմնված ուսուցման մեթոդներով:"
							className="mb-0 lg:mb-0"
						/>

						{/* Feature Rows */}
						<AboutFeatureRows />

						{/* CTA Button */}
						<div className="pt-2">
							<Button asChild size="lg" className="group gap-3">
								<Link to="/how-it-works">
									<span>Ավելին մեր մասին</span>
									<div className="size-6 rounded-full bg-white/20 flex items-center justify-center transition-transform duration-300 group-hover:translate-x-1 shrink-0">
										<ArrowRight className="size-3.5" />
									</div>
								</Link>
							</Button>
						</div>
					</RevealOnScroll>

					{/* Աջ սյունակ */}
					<RevealOnScroll delay={100} className="lg:col-span-6">
						<AboutVisual />
					</RevealOnScroll>
				</div>

				{/* Ներքևի շերտ */}
				<RevealOnScroll delay={150}>
					<AboutTagStrip />
				</RevealOnScroll>
			</div>
		</section>
	);
}
