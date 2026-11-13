import { ArrowLeft, ArrowRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { ReviewItem } from "@/lib/api/reviews";
import { PLACEHOLDER_TESTIMONIALS } from "./data";
import { ReviewCard } from "./ReviewCard";

const PERCENT_MAX = 100;
const CARD_WIDTH_FALLBACK_PX = 400;
const DRAG_SENSITIVITY = 1.4;

export function Carousel({ testimonials }: { testimonials: ReviewItem[] | null }) {
	const scrollRef = useRef<HTMLElement>(null);
	const progressBarRef = useRef<HTMLDivElement>(null);
	const rafRef = useRef<number | null>(null);
	const [isDragging, setIsDragging] = useState(false);
	const isMouseDownRef = useRef(false);
	const startXRef = useRef(0);
	const scrollLeftRef = useRef(0);

	useEffect(() => {
		if (scrollRef.current) {
			scrollRef.current.scrollLeft = 0;
		}
		return () => {
			if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
		};
	}, []);

	// Drive the progress bar through the DOM instead of React state so scrolling
	// never re-renders the list; rAF coalesces bursts of scroll events.
	const handleScroll = () => {
		if (rafRef.current !== null) return;
		rafRef.current = requestAnimationFrame(() => {
			rafRef.current = null;
			const el = scrollRef.current;
			const bar = progressBarRef.current;
			if (!el || !bar) return;
			const maxScroll = el.scrollWidth - el.clientWidth;
			const progress = maxScroll > 0 ? (el.scrollLeft / maxScroll) * PERCENT_MAX : 0;
			bar.style.width = `${Math.max(progress, 10)}%`;
		});
	};

	const scrollByAmount = (direction: number) => {
		if (scrollRef.current) {
			const cardWidth = scrollRef.current.firstElementChild?.clientWidth || CARD_WIDTH_FALLBACK_PX;
			scrollRef.current.scrollBy({
				left: direction * (cardWidth + 24),
				behavior: "smooth",
			});
		}
	};

	const handleMouseDown = (e: React.MouseEvent) => {
		if (!scrollRef.current) return;
		isMouseDownRef.current = true;
		setIsDragging(true);
		startXRef.current = e.pageX - scrollRef.current.offsetLeft;
		scrollLeftRef.current = scrollRef.current.scrollLeft;
	};

	const handleMouseMove = (e: React.MouseEvent) => {
		if (!isMouseDownRef.current || !scrollRef.current) return;
		e.preventDefault();
		const x = e.pageX - scrollRef.current.offsetLeft;
		const walk = (x - startXRef.current) * DRAG_SENSITIVITY;
		scrollRef.current.scrollLeft = scrollLeftRef.current - walk;
	};

	const handleMouseUpOrLeave = () => {
		if (isMouseDownRef.current) {
			isMouseDownRef.current = false;
			setIsDragging(false);
		}
	};

	return (
		<>
			{/* Drag-to-Scroll & Swipe Carousel Container */}
			<section
				ref={scrollRef}
				aria-label="Կարծիքների սահիկ"
				onScroll={handleScroll}
				onMouseDown={handleMouseDown}
				onMouseMove={handleMouseMove}
				onMouseUp={handleMouseUpOrLeave}
				onMouseLeave={handleMouseUpOrLeave}
				className={`flex gap-6 2xl:gap-8 overflow-x-auto pb-8 pt-2 select-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden ${
					isDragging
						? "cursor-grabbing scroll-auto snap-none"
						: "cursor-grab scroll-smooth snap-x snap-mandatory"
				}`}
				style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
			>
				{(testimonials ?? PLACEHOLDER_TESTIMONIALS).map((item, index) => (
					<ReviewCard key={item.id} item={item} isFeatured={index === 0} />
				))}
			</section>

			{/* Bottom Scroll Controls */}
			<div className="mt-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
				<div className="w-full max-w-md h-1.5 bg-slate-800/80 border border-white/5 rounded-full overflow-hidden">
					<div
						ref={progressBarRef}
						className="h-full bg-gradient-to-r from-blue-500 to-primary rounded-full transition-all duration-300"
						style={{ width: "10%" }}
					/>
				</div>
				<div className="flex gap-3">
					<button
						type="button"
						onClick={() => scrollByAmount(-1)}
						className="grid size-11 place-items-center rounded-full bg-slate-900/90 border border-white/10 text-white hover:bg-primary hover:border-primary transition-all duration-200 shadow-md hover:-translate-y-0.5 cursor-pointer"
						aria-label="Նախորդ"
					>
						<ArrowLeft className="size-5" />
					</button>
					<button
						type="button"
						onClick={() => scrollByAmount(1)}
						className="grid size-11 place-items-center rounded-full bg-primary border border-primary text-white hover:bg-primary-hover transition-all duration-200 shadow-md shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-0.5 cursor-pointer"
						aria-label="Հաջորդ"
					>
						<ArrowRight className="size-5" />
					</button>
				</div>
			</div>
		</>
	);
}
