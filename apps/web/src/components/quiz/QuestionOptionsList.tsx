import type { CardQuestion } from "@/lib/quiz";
import { AnswerOption } from "./AnswerOption";

interface QuestionOptionsListProps {
	question: CardQuestion;
	selected: number | null;
	reveal: boolean;
	locked: boolean;
	onSelect: (i: number) => void;
}

export function QuestionOptionsList({
	question,
	selected,
	reveal,
	locked,
	onSelect,
}: QuestionOptionsListProps) {
	return (
		<div className="grid gap-2.5 sm:gap-3 w-full">
			{question.options.map((opt, i) => (
				<AnswerOption
					key={opt}
					text={opt}
					index={i}
					isSelected={selected === i}
					isCorrect={i === question.correct}
					reveal={reveal}
					locked={locked}
					onSelect={() => onSelect(i)}
				/>
			))}
		</div>
	);
}
