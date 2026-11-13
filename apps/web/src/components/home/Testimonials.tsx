import { PenLine, Quote } from "lucide-react";
import { RevealOnScroll } from "@/components/shared/RevealOnScroll";
import { Button } from "@/components/ui/button";
import { Carousel } from "./testimonials/Carousel";
import { ReviewDialog } from "./testimonials/ReviewDialog";
import { useReviews } from "./testimonials/useReviews";

export function Testimonials() {
	const {
		testimonials,
		dialogOpen,
		setDialogOpen,
		rating,
		setRating,
		hoverRating,
		setHoverRating,
		comment,
		setComment,
		submitting,
		openReviewDialog,
		submitReview,
		isEmpty,
	} = useReviews();

	return (
		<section className="hero-ink relative overflow-hidden py-20 sm:py-24 lg:py-28 2xl:py-32 text-white">
			{/* Ambient atmospheric glows identical to Study Program */}
			<div className="pointer-events-none absolute -right-40 -top-40 size-[600px] rounded-full bg-blue-500/15 blur-[130px]" />
			<div className="pointer-events-none absolute -left-40 -bottom-40 size-[600px] rounded-full bg-indigo-500/10 blur-[130px]" />
			<div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(59,130,246,0.12),rgba(255,255,255,0))]" />
			<div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.03)_1px,transparent_0)] bg-[length:32px_32px]" />

			<div className="container relative z-10">
				<RevealOnScroll>
					<div className="max-w-2xl mb-12 sm:mb-16">
						<div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-400/25 text-blue-400 text-xs font-bold uppercase tracking-wider mb-3">
							<Quote className="size-3.5 rotate-180" />
							<span>Ուսանողների կարծիքներ</span>
						</div>
						<h2 className="text-3xl sm:text-4xl lg:text-[42px] 2xl:text-[48px] font-black text-white tracking-tight leading-tight mb-3">
							Ինչու՞ են ընտրում մեզ
						</h2>
						<p className="text-slate-300 text-sm sm:text-base 2xl:text-lg max-w-xl font-medium leading-relaxed">
							Մեր ուսանողների վստահությունը մեր ամենամեծ ձեռքբերումն է: Ծանոթացեք մեր շրջանավարտների
							կարծիքներին:
						</p>
						{!isEmpty && (
							<Button
								onClick={openReviewDialog}
								className="mt-6 gap-2 bg-primary border border-primary shadow-md shadow-primary/25 hover:bg-primary-hover"
							>
								<PenLine className="size-4" />
								<span>Թողեք ձեր կարծիքը</span>
							</Button>
						)}
					</div>
				</RevealOnScroll>

				<RevealOnScroll delay={100}>
					{isEmpty ? (
						<div className="rounded-3xl border border-white/10 bg-slate-950/90 backdrop-blur-xl p-10 sm:p-14 text-center">
							<Quote className="size-10 text-blue-400/60 mx-auto mb-4" />
							<h3 className="text-lg sm:text-xl font-black text-white mb-2">Դեռ կարծիքներ չկան</h3>
							<p className="text-slate-300 text-sm sm:text-base font-medium max-w-md mx-auto">
								Եղեք առաջինը, ով կկիսվի իր փորձառությամբ մեր վարման դպրոցի մասին։
							</p>
							<Button
								onClick={openReviewDialog}
								className="mt-6 gap-2 bg-primary border border-primary shadow-md shadow-primary/25 hover:bg-primary-hover"
							>
								<PenLine className="size-4" />
								<span>Թողեք ձեր կարծիքը</span>
							</Button>
						</div>
					) : (
						<Carousel testimonials={testimonials} />
					)}
				</RevealOnScroll>
			</div>

			<ReviewDialog
				open={dialogOpen}
				onOpenChange={setDialogOpen}
				rating={rating}
				onRatingChange={setRating}
				hoverRating={hoverRating}
				onHoverRatingChange={setHoverRating}
				comment={comment}
				onCommentChange={setComment}
				submitting={submitting}
				onSubmit={submitReview}
			/>
		</section>
	);
}
