import { ClipboardList, Clock, HelpCircle } from "lucide-react";
import type { TestData } from "@/lib/api/types";
import { LearningCard, type LearningCardState } from "./LearningCard";

export interface TestCardProps {
	test: TestData;
	index?: number;
	state?: LearningCardState;
	isLocked?: boolean;
	progress?:
		| {
				current: number;
				total: number;
				remainingTime?: string;
		  }
		| undefined;
	result?:
		| {
				score: number;
				total: number;
				percentage?: number;
				passed?: boolean;
		  }
		| undefined;
	actionLabel?: string;
	className?: string;
}

export function TestCard({
	test,
	index,
	state = "available",
	isLocked = false,
	progress,
	result,
	actionLabel,
	className,
}: TestCardProps) {
	const displayTitle =
		test.title && test.title.trim() !== "Թեստ" ? test.title : `Թեստ № ${test.number}`;

	return (
		<LearningCard
			type="test"
			number={test.number}
			title={displayTitle}
			badgeText={`Թեստ ${test.number}`}
			icon={<ClipboardList className="size-5 stroke-[2.2]" />}
			description="ՃՈ պաշտոնական քննական տոմս՝ 20 հարց, 90% անցողիկ շեմով։"
			metadata={[
				{
					icon: <HelpCircle className="size-3.5" />,
					label: "հարց",
					value: "20",
				},
				{
					icon: <Clock className="size-3.5" />,
					label: "րոպե",
					value: "20",
				},
			]}
			state={isLocked ? "locked" : state}
			progress={progress}
			result={result}
			isLocked={isLocked}
			action={{
				to: "/tests/$testId",
				params: { testId: String(test.id) },
				label: actionLabel,
				lockedTitle: "Անհրաժեշտ է մուտք գործել",
			}}
			animationIndex={index}
			className={className}
		/>
	);
}
