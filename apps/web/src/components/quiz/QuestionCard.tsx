import type { CardQuestion } from "@/lib/quiz";
import { QuestionCardStatusBadge } from "./QuestionCardStatusBadge";
import { QuestionExplanationPanel } from "./QuestionExplanationPanel";
import { QuestionImage } from "./QuestionImage";
import { QuestionOptionsList } from "./QuestionOptionsList";

export function QuestionCard({
	question,
	number,
	selected,
	onSelect,
	reveal,
	locked = false,
}: {
	question: CardQuestion;
	number: number;
	selected: number | null;
	onSelect: (i: number) => void;
	reveal: boolean;
	locked?: boolean;
}) {
	const hasImage = Boolean(question.imageUrl);
	const isAnswered = selected !== null && selected !== undefined;
	const isCorrect = isAnswered && selected === question.correct;

	return (
		<article className="w-full bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-xs sm:shadow-sm p-6 sm:p-7 lg:p-8 transition-shadow hover:shadow-md">
			{/* Card Header: Question Number Badge & Status */}
			<div className="w-full flex items-center justify-between gap-3 pb-3 sm:pb-3.5 border-b border-slate-100 dark:border-slate-800">
				<div className="flex items-center gap-2.5">
					<span className="flex items-center justify-center size-7 sm:size-8 rounded-full bg-primary/10 font-bold text-xs sm:text-sm text-primary">
						{number}
					</span>
					<span className="text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400">
						Հարց {number}
					</span>
				</div>

				<QuestionCardStatusBadge reveal={reveal} isCorrect={isCorrect} isAnswered={isAnswered} />
			</div>

			{/* Card Body */}
			<div className="w-full pt-3.5 sm:pt-4">
				{hasImage ? (
					<div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
						{/* Left: Image Container */}
						<div className="lg:col-span-5 w-full">
							<div className="relative w-full overflow-hidden rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/50 p-2 sm:p-3 flex items-center justify-center shadow-xs">
								<QuestionImage
									src={question.imageUrl ?? ""}
									alt={`Հարց ${number} պատկեր`}
									className="max-h-[260px] xs:max-h-[300px] sm:max-h-[360px] lg:max-h-[440px]"
								/>
							</div>
						</div>

						{/* Right: Question & Answers */}
						<div className="lg:col-span-7 w-full flex flex-col space-y-5 sm:space-y-6">
							<h3 className="w-full text-lg sm:text-xl lg:text-[22px] font-bold text-slate-900 dark:text-slate-100 leading-snug sm:leading-normal lg:leading-relaxed">
								{question.text}
							</h3>

							<QuestionOptionsList
								question={question}
								selected={selected}
								reveal={reveal}
								locked={locked}
								onSelect={onSelect}
							/>

							{reveal && question.explanation && question.explanation.trim() !== "" && (
								<QuestionExplanationPanel explanation={question.explanation} />
							)}
						</div>
					</div>
				) : (
					<div className="w-full flex flex-col space-y-5 sm:space-y-6">
						<h3 className="w-full text-lg sm:text-xl lg:text-[22px] font-bold text-slate-900 dark:text-slate-100 leading-snug sm:leading-normal lg:leading-relaxed">
							{question.text}
						</h3>

						<QuestionOptionsList
							question={question}
							selected={selected}
							reveal={reveal}
							locked={locked}
							onSelect={onSelect}
						/>

						{reveal && question.explanation && question.explanation.trim() !== "" && (
							<QuestionExplanationPanel explanation={question.explanation} />
						)}
					</div>
				)}
			</div>
		</article>
	);
}
