import { useEffect, useRef, useState } from "react";

const TICK_INTERVAL_MS = 1_000;

/**
 * Seconds countdown: ticks only while `active`, and fires `onExpire` once when
 * it reaches zero. The callback is read through a ref so the interval effect
 * stays stable across renders.
 */
export function useCountdown(totalSeconds: number, active: boolean, onExpire: () => void) {
	const [secondsLeft, setSecondsLeft] = useState(totalSeconds);
	const onExpireRef = useRef(onExpire);
	onExpireRef.current = onExpire;

	useEffect(() => {
		if (!active) return;
		const id = setInterval(() => {
			setSecondsLeft((s) => {
				if (s <= 1) {
					onExpireRef.current();
					return 0;
				}
				return s - 1;
			});
		}, TICK_INTERVAL_MS);
		return () => clearInterval(id);
	}, [active]);

	return { secondsLeft, setSecondsLeft };
}
