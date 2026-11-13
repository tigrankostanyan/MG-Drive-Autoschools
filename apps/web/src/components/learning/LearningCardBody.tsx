import type { ReactNode } from "react";
import { ResultSummary } from "@/components/shared/ResultSummary";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { IconBox } from "@/components/ui/icon-box";
import { CardMeta, type CardMetaItem } from "./CardMeta";
import type {
	LearningCardProgress,
	LearningCardResult,
	LearningCardState,
} from "./LearningCard.types";
import { ProgressIndicator } from "./ProgressIndicator";

interface LearningCardBodyProps {
	effectiveState: LearningCardState;
	defaultIcon: ReactNode;
	defaultBadge: string;
	title: string;
	metadata: CardMetaItem[] | undefined;
	description: string | null | undefined;
	progress: LearningCardProgress | undefined;
	result: LearningCardResult | undefined;
}

export function LearningCardBody({
	effectiveState,
	defaultIcon,
	defaultBadge,
	title,
	metadata,
	description,
	progress,
	result,
}: LearningCardBodyProps) {
	return (
		<div className="flex flex-col flex-1">
			{/* Top: Icon + Status/Number Badge */}
			<div className="flex items-center justify-between">
				<IconBox variant="primary" size="md">
					{defaultIcon}
				</IconBox>
				<StatusBadge state={effectiveState} text={defaultBadge} />
			</div>

			{/* Heading */}
			<h2 className="mt-4 text-[16.5px] sm:text-[17.5px] font-bold text-slate-950 dark:text-white tracking-tight leading-snug">
				{title}
			</h2>

			{/* Secondary Metadata or Description */}
			{metadata && metadata.length > 0 && (
				<div className="mt-2.5">
					<CardMeta items={metadata} />
				</div>
			)}

			{description && (
				<p className="mt-2 text-[13.5px] leading-relaxed text-slate-600 dark:text-slate-400 line-clamp-3 min-h-[46px]">
					{description}
				</p>
			)}

			{/* State Slots: In-Progress Progress Bar or Completed Result Summary */}
			<div className="mt-3 flex-1 flex flex-col justify-end">
				{effectiveState === "in_progress" && progress && (
					<div className="pt-1">
						<ProgressIndicator
							current={progress.current}
							total={progress.total}
							{...(progress.remainingTime ? { remainingTime: progress.remainingTime } : {})}
						/>
					</div>
				)}

				{effectiveState === "completed" && result && (
					<div className="pt-1">
						<ResultSummary
							score={result.score}
							total={result.total}
							{...(result.percentage !== undefined ? { percentage: result.percentage } : {})}
							{...(result.passed !== undefined ? { passed: result.passed } : {})}
							{...(result.label !== undefined ? { label: result.label } : {})}
						/>
					</div>
				)}
			</div>
		</div>
	);
}
