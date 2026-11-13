import { Folder } from "lucide-react";
import type { GroupData } from "@/lib/api/types";
import { LearningCard } from "./LearningCard";

export interface GroupCardProps {
	group: GroupData;
	index?: number;
	isLocked?: boolean;
	className?: string;
}

export function GroupCard({ group, index, isLocked = false, className }: GroupCardProps) {
	return (
		<LearningCard
			type="group"
			number={group.number}
			title={`${group.title} #${group.number}`}
			badgeText={`Խումբ ${group.number}`}
			icon={<Folder className="size-5 stroke-[2.2]" />}
			description={group.text || "—"}
			state="available"
			isLocked={isLocked}
			action={{
				to: "/groups/$groupId",
				params: { groupId: String(group.id) },
				lockedTitle: "Անհրաժեշտ է մուտք գործել",
			}}
			animationIndex={index}
			className={className}
		/>
	);
}
