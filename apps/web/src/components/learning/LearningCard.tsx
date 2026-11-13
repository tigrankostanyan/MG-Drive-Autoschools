import { ClipboardList, Folder } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { LearningCardProps, LearningCardState } from "./LearningCard.types";
import { LearningCardActionButton } from "./LearningCardActionButton";
import { LearningCardBody } from "./LearningCardBody";

const ANIMATION_STEP_MS = 35;

export type {
	LearningCardAction,
	LearningCardProps,
	LearningCardState,
	LearningCardType,
} from "./LearningCard.types";

export function LearningCard({
	type = "test",
	number,
	title,
	badgeText,
	icon,
	metadata,
	description,
	state = "available",
	progress,
	result,
	action,
	isLocked = false,
	animationIndex,
	className = "",
}: LearningCardProps) {
	// Determine effective
	const effectiveState: LearningCardState = isLocked ? "locked" : state;

	// Default badge text
	const defaultBadge = badgeText || (type === "group" ? `Խումբ ${number}` : `Թեստ ${number}`);

	// Default icon
	const defaultIcon =
		icon ||
		(type === "group" ? (
			<Folder className="size-5 stroke-[2.2]" />
		) : (
			<ClipboardList className="size-5 stroke-[2.2]" />
		));

	// Determine
	let actionLabel = action?.label;
	if (!actionLabel) {
		if (effectiveState === "completed") {
			actionLabel = "Դիտել արդյունքը";
		} else if (effectiveState === "in_progress") {
			actionLabel = "Շարունակել";
		} else {
			actionLabel = "Սկսել";
		}
	}

	return (
		<Card
			variant="interactive"
			className={cn("card-animate flex flex-col justify-between", className)}
			style={
				animationIndex !== undefined
					? { animationDelay: `${animationIndex * ANIMATION_STEP_MS}ms` }
					: undefined
			}
		>
			<LearningCardBody
				effectiveState={effectiveState}
				defaultIcon={defaultIcon}
				defaultBadge={defaultBadge}
				title={title}
				metadata={metadata}
				description={description}
				progress={progress}
				result={result}
			/>

			{/* Bottom CTA / Action */}
			<LearningCardActionButton
				effectiveState={effectiveState}
				actionLabel={actionLabel}
				action={action}
			/>
		</Card>
	);
}
