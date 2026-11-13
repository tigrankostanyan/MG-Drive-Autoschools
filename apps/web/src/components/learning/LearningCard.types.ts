import type { ReactNode } from "react";
import type { CardMetaItem } from "./CardMeta";

export type LearningCardType = "test" | "group" | "course";
export type LearningCardState = "available" | "in_progress" | "completed" | "locked";

export interface LearningCardAction {
	label?: string | undefined;
	to?: string | undefined;
	params?: Record<string, string> | undefined;
	onClick?: (() => void) | undefined;
	variant?: ("primary" | "secondary" | "locked") | undefined;
	lockedTitle?: string | undefined;
}

export interface LearningCardProgress {
	current: number;
	total: number;
	remainingTime?: string | undefined;
}

export interface LearningCardResult {
	score: number;
	total: number;
	percentage?: number | undefined;
	passed?: boolean | undefined;
	label?: string | undefined;
}

export interface LearningCardProps {
	type?: LearningCardType | undefined;
	number: number | string;
	title: string;
	badgeText?: string | undefined;
	icon?: ReactNode | undefined;
	metadata?: CardMetaItem[] | undefined;
	description?: string | null | undefined;
	state?: LearningCardState | undefined;
	progress?: LearningCardProgress | undefined;
	result?: LearningCardResult | undefined;
	action?: LearningCardAction | undefined;
	isLocked?: boolean | undefined;
	animationIndex?: number | undefined;
	className?: string | undefined;
}
