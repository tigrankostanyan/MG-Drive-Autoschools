import { Camera, CheckCircle2, Sparkles } from "lucide-react";

/** Ambient cover banner shown above the profile tabs. */
export function ProfileBanner() {
	return (
		<div className="relative -mt-18 sm:-mt-20 pt-18 sm:pt-20 h-[240px] sm:h-[270px] lg:h-[290px] w-full overflow-hidden bg-slate-950 border-b border-white/10 shadow-[0_20px_50px_-10px_rgba(0,0,0,0.35)]">
			{/* Subtle top reflection line matching hero dock */}
			<div className="absolute top-18 sm:top-20 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />

			{/* Abstract Lighting Gradients */}
			<div className="absolute inset-0 opacity-40 pointer-events-none">
				<div className="absolute -left-16 top-10 h-[280px] w-[280px] rounded-full bg-blue-600/30 blur-3xl" />
				<div className="absolute right-10 top-10 h-[260px] w-[260px] rounded-full bg-indigo-600/30 blur-3xl" />
				<div className="absolute left-1/2 bottom-0 h-[140px] w-[320px] -translate-x-1/2 rounded-full bg-blue-400/20 blur-2xl" />
			</div>

			{/* Subtle decorative grid */}
			<div
				className="absolute inset-0 opacity-10 pointer-events-none"
				style={{
					backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
					backgroundSize: "24px 24px",
				}}
			/>

			{/* Banner Content */}
			<div className="container h-full flex items-start justify-between relative z-10 pt-5 sm:pt-7">
				<div className="flex items-center gap-2">
					<div className="flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 backdrop-blur-md border border-white/15 text-white shadow-sm">
						<Sparkles className="size-3.5 text-amber-300 animate-pulse" />
						<span className="text-xs font-bold tracking-wide">MG Drive PRO Ուսումնական Պորտալ</span>
					</div>
					<div className="hidden md:flex items-center gap-1.5 rounded-full bg-blue-500/15 border border-blue-400/25 px-3 py-1 text-blue-300 text-xs font-semibold backdrop-blur-md">
						<CheckCircle2 className="size-3 text-emerald-400" />
						<span>2026 Պաշտոնական</span>
					</div>
				</div>

				<button
					type="button"
					className="group flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs sm:text-sm font-bold text-white shadow-sm backdrop-blur-md transition-all hover:bg-white/20 hover:scale-[1.02] active:scale-95 cursor-pointer"
				>
					<Camera className="size-3.5 sm:size-4 text-white/90 group-hover:rotate-12 transition-transform" />
					<span>Փոխել շապիկը</span>
				</button>
			</div>
		</div>
	);
}
