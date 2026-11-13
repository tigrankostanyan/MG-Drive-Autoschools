import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

const PERCENT_MAX = 100;

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

/** Whole-number percentage of `value` out of `total`, clamped to 0–100. */
export function toPercent(value: number, total: number): number {
	if (total <= 0) return 0;
	return Math.min(PERCENT_MAX, Math.max(0, Math.round((value / total) * PERCENT_MAX)));
}
