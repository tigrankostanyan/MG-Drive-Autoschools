import { useRouterState } from "@tanstack/react-router";

/** Loading bar shown while any route loader runs, on every page. */
export function RouteProgress() {
	const isLoading = useRouterState({
		select: (s) => s.isLoading,
	});
	return (
		<div
			aria-hidden="true"
			className={`pointer-events-none fixed inset-x-0 top-0 z-[120] h-[3px] overflow-hidden transition-opacity duration-300 ${
				isLoading ? "opacity-100" : "opacity-0"
			}`}
		>
			<div className="route-progress-bar h-full w-1/3 rounded-r-full bg-[image:var(--gradient-accent)] shadow-[0_0_12px_rgba(4,77,218,0.5)]" />
		</div>
	);
}
