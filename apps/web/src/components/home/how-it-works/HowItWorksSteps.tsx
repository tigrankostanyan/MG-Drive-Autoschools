import { Link } from "@tanstack/react-router";
import salonImage from "@/assets/how-it-works-salon.webp";
import { useAuthModal } from "@/components/auth/auth-modal-context";
import { useSession } from "@/hooks/use-session";
import { HOW_IT_WORKS_STEPS } from "./data";

export function HowItWorksSteps({ ctaLink: _ctaLink }: { ctaLink?: "/tests" | "/auth" }) {
	const { user } = useSession();
	const { openAuthModal } = useAuthModal();

	return (
		<section className="relative min-h-[82vh] lg:min-h-[86vh] flex flex-col justify-end pt-24 pb-12 sm:pb-16 overflow-hidden bg-slate-950 text-slate-100">
			{/* Background Image */}
			<div className="absolute inset-0 z-0">
				<img
					src={salonImage}
					alt="Վարման ուսուցման սրահ՝ վարման դպրոցի մեքենայի ինտերիեր"
					loading="lazy"
					decoding="async"
					className="w-full h-full object-cover object-center"
				/>
				{/* Smooth brand deep-navy gradient overlay */}
				<div className="absolute inset-0 bg-gradient-to-b from-slate-950/25 via-slate-950/65 to-slate-950" />
				<div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-slate-950 via-slate-950/90 to-transparent" />
			</div>

			{/* Page Title */}
			<div className="container relative z-10 mb-8 sm:mb-10">
				<span className="inline-block mb-3 text-xs font-bold tracking-[0.25em] uppercase text-blue-300">
					Ուսուցման ընթացք
				</span>
				<h1 className="max-w-2xl text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
					Ինչպես է անցնում ուսուցումը
				</h1>
			</div>

			{/* 4 Feature Blocks Grid */}
			<div className="container relative z-10">
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6">
					{HOW_IT_WORKS_STEPS.map((step) => (
						<div
							key={step.title}
							className="group relative flex flex-col items-center text-center p-6 sm:p-7 rounded-2xl sm:rounded-3xl bg-slate-950/90 border border-white/10 backdrop-blur-xl hover:bg-slate-950 hover:border-primary/50 transition-all duration-300 hover:-translate-y-1 shadow-[0_20px_50px_-10px_rgba(0,0,0,0.45)] overflow-hidden"
						>
							{/* Hairline reflection */}
							<div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:via-primary/50 transition-colors" />

							{/* Normalized Icon Badge matching hero dock */}
							<div className="relative mb-5 flex items-center justify-center">
								<div className="size-14 sm:size-15 rounded-2xl bg-blue-500/15 border border-blue-400/25 flex items-center justify-center text-blue-400 shadow-sm group-hover:scale-105 group-hover:bg-primary group-hover:text-white group-hover:border-primary group-hover:shadow-[0_0_20px_rgba(4,77,218,0.35)] transition-all duration-300">
									<step.icon className="size-6.5 sm:size-7 stroke-[2.2]" />
								</div>
							</div>

							{/* Text Content */}
							<h3 className="text-white text-base sm:text-lg font-black tracking-wider uppercase mb-2 group-hover:text-blue-300 transition-colors">
								{step.title}
							</h3>
							<p className="text-slate-300 text-xs sm:text-[13px] leading-relaxed max-w-[250px] mb-5 font-normal line-clamp-2">
								{step.description}
							</p>

							{/* More Button */}
							{user ? (
								<Link
									to="/tests"
									className="mt-auto px-6 py-2 rounded-full bg-white/10 hover:bg-white hover:text-slate-950 border border-white/15 text-white/90 text-xs font-bold tracking-wider uppercase transition-all duration-200"
								>
									Ավելին
								</Link>
							) : (
								<button
									type="button"
									onClick={openAuthModal}
									className="mt-auto px-6 py-2 rounded-full bg-white/10 hover:bg-white hover:text-slate-950 border border-white/15 text-white/90 text-xs font-bold tracking-wider uppercase transition-all duration-200 cursor-pointer"
								>
									Ավելին
								</button>
							)}
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
