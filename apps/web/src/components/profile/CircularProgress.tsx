const PERCENT_MAX = 100;

export function CircularProgress({
	percent,
	size = 100,
	strokeWidth = 8,
}: {
	percent: number;
	size?: number;
	strokeWidth?: number;
}) {
	const r = (size - strokeWidth) / 2;
	const circ = 2 * Math.PI * r;
	const offset = circ - (percent / PERCENT_MAX) * circ;
	return (
		<div
			className="relative inline-flex items-center justify-center"
			style={{ width: size, height: size }}
		>
			<svg width={size} height={size} className="-rotate-90" aria-hidden="true">
				<circle
					cx={size / 2}
					cy={size / 2}
					r={r}
					fill="none"
					stroke="rgba(255, 255, 255, 0.15)"
					strokeWidth={strokeWidth}
				/>
				<circle
					cx={size / 2}
					cy={size / 2}
					r={r}
					fill="none"
					stroke="var(--primary)"
					strokeWidth={strokeWidth}
					strokeLinecap="round"
					strokeDasharray={circ}
					strokeDashoffset={offset}
					style={{
						transition: "stroke-dashoffset 1.2s cubic-bezier(0.34, 1.56, 0.64, 1)",
					}}
				/>
			</svg>
			<div className="absolute inset-0 flex flex-col items-center justify-center">
				<span className="font-display text-lg font-extrabold text-white">{percent}%</span>
			</div>
		</div>
	);
}
