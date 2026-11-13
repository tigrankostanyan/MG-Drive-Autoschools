import { type ReactNode, useEffect, useRef, useState } from "react";

export function RevealOnScroll({
	children,
	className = "",
	delay = 0,
}: {
	children: ReactNode;
	className?: string;
	delay?: number;
}) {
	const ref = useRef<HTMLDivElement | null>(null);
	const [inView, setInView] = useState(false);

	useEffect(() => {
		const el = ref.current;
		if (!el || typeof IntersectionObserver === "undefined") {
			setInView(true);
			return;
		}

		const observer = new IntersectionObserver(
			(entries) => {
				const entry = entries[0];
				if (entry) {
					setInView(entry.isIntersecting);
				}
			},
			{
				threshold: 0.1,
				rootMargin: "0px 0px -40px 0px",
			},
		);

		observer.observe(el);
		return () => observer.disconnect();
	}, []);

	return (
		<div
			ref={ref}
			className={`transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
				inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-7 pointer-events-none"
			} ${className}`}
			style={{ transitionDelay: inView ? `${delay}ms` : "0ms" }}
		>
			{children}
		</div>
	);
}
