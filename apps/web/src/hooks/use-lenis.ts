import type Lenis from "lenis";
import { useEffect, useRef } from "react";

const EASING_UPPER_BOUND = 1.001;

export function useLenis({ skip = false }: { skip?: boolean } = {}) {
	const lenisRef = useRef<Lenis | null>(null);

	useEffect(() => {
		if (skip || typeof window === "undefined") return;

		let cancelled = false;
		let rafId = 0;

		const init = async () => {
			const { default: LenisCtor } = await import("lenis");
			if (cancelled) return;

			const lenis = new LenisCtor({
				duration: 1.1,
				easing: (t: number) => Math.min(1, EASING_UPPER_BOUND - 2 ** (-10 * t)),
				smoothWheel: true,
				wheelMultiplier: 0.95,
			});

			lenisRef.current = lenis;

			const raf = (time: number) => {
				lenis.raf(time);
				rafId = requestAnimationFrame(raf);
			};
			rafId = requestAnimationFrame(raf);
		};

		void init();

		return () => {
			cancelled = true;
			cancelAnimationFrame(rafId);
			lenisRef.current?.destroy();
			lenisRef.current = null;
		};
	}, [skip]);

	return lenisRef;
}
