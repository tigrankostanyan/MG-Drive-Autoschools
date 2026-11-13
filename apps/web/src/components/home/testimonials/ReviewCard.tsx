import { Star } from "lucide-react";
import type { ReviewItem } from "@/lib/api/reviews";
import { initialsOf } from "./helpers";

const STAR_MAX = 5;

export function ReviewCard({ item, isFeatured }: { item: ReviewItem; isFeatured: boolean }) {
	return (
		<div
			className={`relative shrink-0 w-[320px] sm:w-[380px] lg:w-[calc((100%-3rem)/3)] 2xl:w-[calc((100%-4rem)/3)] min-w-[320px] snap-start rounded-3xl p-7 sm:p-8 2xl:p-9 flex flex-col justify-between transition-all duration-300 backdrop-blur-xl overflow-hidden group select-none ${
				isFeatured
					? "bg-slate-950/95 border border-primary/50 shadow-[0_20px_50px_rgba(4,77,218,0.25)] ring-1 ring-primary/20 hover:-translate-y-1"
					: "border border-white/10 bg-slate-950/90 shadow-lg hover:-translate-y-1 hover:border-primary/40 hover:shadow-[0_20px_50px_rgba(4,77,218,0.2)]"
			}`}
		>
			{/* Top glow accent line */}
			<div
				className={`pointer-events-none absolute inset-x-0 top-0 h-px transition-colors duration-500 ${
					isFeatured
						? "bg-gradient-to-r from-transparent via-blue-400 to-transparent"
						: "bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:via-blue-400/60"
				}`}
			/>

			{/* Ambient glow in card */}
			<div
				className={`pointer-events-none absolute -top-12 -right-12 size-32 rounded-full blur-2xl transition-all duration-500 ${
					isFeatured ? "bg-blue-500/20" : "bg-blue-500/10 group-hover:bg-blue-500/20"
				}`}
			/>

			<div>
				{/* Star Rating */}
				<div className="flex gap-1.5 mb-5">
					{Array.from({ length: STAR_MAX }, (_, i) => i + 1).map((star) => (
						<Star
							key={star}
							className={`size-4 drop-shadow-sm ${
								star <= (item.rating || STAR_MAX)
									? "text-amber-400 fill-amber-400"
									: "text-slate-600"
							}`}
						/>
					))}
				</div>

				{/* Review Text */}
				<p
					className={`text-[15px] sm:text-base leading-relaxed font-medium mb-6 sm:mb-8 relative z-10 ${
						isFeatured ? "text-white" : "text-slate-200"
					}`}
				>
					«{item.comment}»
				</p>
			</div>

			{/* Author Info */}
			<div className="flex items-center gap-3.5 relative z-10 pt-4 border-t border-white/10">
				<div
					className={`grid size-11 shrink-0 place-items-center rounded-xl font-bold text-xs shadow-md transition-transform group-hover:scale-105 ${
						isFeatured
							? "bg-blue-500/20 border border-blue-400/40 text-blue-300"
							: "bg-white/10 border border-white/15 text-white"
					}`}
				>
					{initialsOf(item.name)}
				</div>
				<div>
					<p className="font-bold text-sm sm:text-[15px] text-white">{item.name}</p>
					<p className="text-xs text-slate-400 font-medium">{item.type || "Ուսանող"}</p>
				</div>
			</div>
		</div>
	);
}
