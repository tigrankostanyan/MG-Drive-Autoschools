import { Maximize2, Minus, Plus, RotateCcw, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";

const MIN_SCALE = 1;
const MAX_SCALE = 5;
const ZOOM_STEP = 0.5;

/**
 * Question image with a click-to-zoom lightbox. Quiz images are often dense
 * (diagrams, road signs), so tapping opens a full-screen viewer that supports
 * zoom buttons, wheel zoom, drag-to-pan and double-click reset.
 */
export function QuestionImage({
	src,
	alt,
	loading = "lazy",
	className,
}: {
	src: string;
	alt: string;
	loading?: "lazy" | "eager";
	className?: string;
}) {
	const [open, setOpen] = useState(false);

	return (
		<>
			<button
				type="button"
				onClick={() => setOpen(true)}
				aria-label={`${alt} — բացել մեծացված`}
				className="group relative block w-full cursor-zoom-in rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2"
			>
				<img
					src={src}
					alt={alt}
					loading={loading}
					decoding="async"
					className={cn("w-full h-auto object-contain rounded-xl", className)}
				/>
				<span className="pointer-events-none absolute right-2 bottom-2 flex items-center gap-1 rounded-full bg-black/60 px-2 py-1 text-[11px] font-semibold text-white opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
					<Maximize2 className="size-3" />
					Մեծացնել
				</span>
			</button>

			{open && <ImageLightbox src={src} alt={alt} onClose={() => setOpen(false)} />}
		</>
	);
}

function ImageLightbox({ src, alt, onClose }: { src: string; alt: string; onClose: () => void }) {
	const [scale, setScale] = useState(MIN_SCALE);
	const [offset, setOffset] = useState({ x: 0, y: 0 });
	const dragRef = useRef<{ x: number; y: number; ox: number; oy: number } | null>(null);

	const reset = useCallback(() => {
		setScale(MIN_SCALE);
		setOffset({ x: 0, y: 0 });
	}, []);

	const zoomBy = useCallback((delta: number) => {
		setScale((prev) => {
			const next = Math.min(MAX_SCALE, Math.max(MIN_SCALE, prev + delta));
			if (next === MIN_SCALE) setOffset({ x: 0, y: 0 });
			return next;
		});
	}, []);

	useEffect(() => {
		const onKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Escape") onClose();
			else if (e.key === "+" || e.key === "=") zoomBy(ZOOM_STEP);
			else if (e.key === "-") zoomBy(-ZOOM_STEP);
			else if (e.key === "0") reset();
		};
		window.addEventListener("keydown", onKeyDown);
		const previousOverflow = document.body.style.overflow;
		document.body.style.overflow = "hidden";
		return () => {
			window.removeEventListener("keydown", onKeyDown);
			document.body.style.overflow = previousOverflow;
		};
	}, [onClose, reset, zoomBy]);

	const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
		if (scale <= MIN_SCALE) return;
		dragRef.current = { x: e.clientX, y: e.clientY, ox: offset.x, oy: offset.y };
		e.currentTarget.setPointerCapture(e.pointerId);
	};

	const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
		const drag = dragRef.current;
		if (!drag) return;
		setOffset({ x: drag.ox + (e.clientX - drag.x), y: drag.oy + (e.clientY - drag.y) });
	};

	const endDrag = (e: React.PointerEvent<HTMLDivElement>) => {
		if (dragRef.current) {
			dragRef.current = null;
			e.currentTarget.releasePointerCapture(e.pointerId);
		}
	};

	return createPortal(
		<div
			role="dialog"
			aria-modal="true"
			aria-label={`${alt} — մեծացված պատկեր`}
			className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm animate-in fade-in duration-200"
		>
			{/* Backdrop: closes on click, but is not focusable or a control. */}
			<button
				type="button"
				tabIndex={-1}
				aria-hidden="true"
				onClick={onClose}
				className="absolute inset-0 cursor-zoom-out"
			/>
			<div
				className={cn(
					"relative flex h-full w-full items-center justify-center overflow-hidden",
					scale > MIN_SCALE ? "cursor-grab active:cursor-grabbing" : "cursor-zoom-in",
				)}
				onPointerDown={onPointerDown}
				onPointerMove={onPointerMove}
				onPointerUp={endDrag}
				onPointerCancel={endDrag}
				onDoubleClick={() => (scale > MIN_SCALE ? reset() : zoomBy(1))}
				onWheel={(e) => zoomBy(e.deltaY < 0 ? ZOOM_STEP : -ZOOM_STEP)}
			>
				<img
					src={src}
					alt={alt}
					draggable={false}
					className="max-h-[92vh] max-w-[94vw] select-none object-contain transition-transform duration-150 ease-out"
					style={{
						transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
					}}
				/>
			</div>

			<div className="absolute top-4 right-4 flex items-center gap-2">
				<LightboxButton
					label="Փոքրացնել"
					onClick={() => zoomBy(-ZOOM_STEP)}
					disabled={scale <= MIN_SCALE}
				>
					<Minus className="size-5" />
				</LightboxButton>
				<LightboxButton
					label="Մեծացնել"
					onClick={() => zoomBy(ZOOM_STEP)}
					disabled={scale >= MAX_SCALE}
				>
					<Plus className="size-5" />
				</LightboxButton>
				<LightboxButton label="Վերականգնել" onClick={reset} disabled={scale <= MIN_SCALE}>
					<RotateCcw className="size-5" />
				</LightboxButton>
				<LightboxButton label="Փակել" onClick={onClose}>
					<X className="size-5" />
				</LightboxButton>
			</div>

			<span className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white/80 backdrop-blur-sm">
				{Math.round(scale * 100)}%
			</span>
		</div>,
		document.body,
	);
}

function LightboxButton({
	label,
	onClick,
	disabled,
	children,
}: {
	label: string;
	onClick: () => void;
	disabled?: boolean;
	children: React.ReactNode;
}) {
	return (
		<button
			type="button"
			aria-label={label}
			onClick={onClick}
			disabled={disabled}
			className="flex size-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-colors hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-40"
		>
			{children}
		</button>
	);
}
