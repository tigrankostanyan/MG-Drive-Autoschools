import { AnswerOption } from "@/components/quiz/AnswerOption";
import { QuestionImage } from "@/components/quiz/QuestionImage";
import type { CardQuestion } from "@/lib/quiz";

interface TestQuestionCardProps {
	question: CardQuestion;
	selected: number | null;
	locked: boolean;
	remainingChanges?: number;
	onSelect: (idx: number) => void;
}

export function TestQuestionCard({
	question,
	selected,
	locked,
	remainingChanges,
	onSelect,
}: TestQuestionCardProps) {
	const hasImage = Boolean(question.imageUrl);

	if (hasImage) {
		return (
			<article className="w-full">
				<div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-8 lg:gap-10 xl:gap-12 items-start">
					<div className="lg:col-span-5 w-full">
						<div className="relative w-full overflow-hidden rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-800/40 p-2 sm:p-3.5 flex items-center justify-center shadow-xs sm:shadow-inner">
							<QuestionImage
								src={question.imageUrl ?? ""}
								alt="Հարցի պատկեր"
								loading="eager"
								className="max-h-[220px] xs:max-h-[260px] sm:max-h-[340px] lg:max-h-[460px] xl:max-h-[500px]"
							/>
						</div>
					</div>

					<div className="lg:col-span-7 w-full flex flex-col space-y-4 sm:space-y-6">
						<h2 className="w-full text-[20px] sm:text-2xl md:text-[26px] font-bold tracking-tight text-slate-900 dark:text-slate-100 leading-[1.45] sm:leading-snug">
							{question.text}
						</h2>

						{selected !== null && remainingChanges !== undefined && (
							<div className="flex items-center gap-2 -mt-1 sm:-mt-2">
								{locked ? (
									<span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800/60">
										Պատասխանը հաստատված է (փոփոխման հնարավորություն չկա)
									</span>
								) : (
									<span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-blue-50 dark:bg-blue-950/40 text-primary dark:text-blue-400 border border-blue-200/60 dark:border-blue-900/40">
										Պատասխանը փոխելու հնարավորություն՝{" "}
										<strong className="font-bold text-primary dark:text-blue-300">
											{remainingChanges}
										</strong>
									</span>
								)}
							</div>
						)}

						<div className="grid gap-2.5 sm:gap-3.5 w-full">
							{question.options.map((opt, i) => (
								<AnswerOption
									key={opt}
									text={opt}
									index={i}
									isSelected={selected === i}
									locked={locked}
									onSelect={() => onSelect(i)}
								/>
							))}
						</div>
					</div>
				</div>
			</article>
		);
	}

	return (
		<article className="w-full lg:w-[82%] xl:w-[80%] lg:max-w-[1120px] mx-auto">
			<div className="flex flex-col space-y-5 sm:space-y-6 lg:space-y-8">
				<h2 className="w-full text-[20px] sm:text-2xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 leading-[1.45] sm:leading-relaxed">
					{question.text}
				</h2>

				{selected !== null && remainingChanges !== undefined && (
					<div className="flex items-center gap-2 -mt-2 sm:-mt-3">
						{locked ? (
							<span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800/60">
								Պատասխանը հաստատված է (փոփոխման հնարավորություն չկա)
							</span>
						) : (
							<span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-blue-50 dark:bg-blue-950/40 text-primary dark:text-blue-400 border border-blue-200/60 dark:border-blue-900/40">
								Պատասխանը փոխելու հնարավորություն՝{" "}
								<strong className="font-bold text-primary dark:text-blue-300">
									{remainingChanges}
								</strong>
							</span>
						)}
					</div>
				)}

				<div className="grid gap-2.5 sm:gap-3.5 lg:gap-4 w-full">
					{question.options.map((opt, i) => (
						<AnswerOption
							key={opt}
							text={opt}
							index={i}
							isSelected={selected === i}
							locked={locked}
							onSelect={() => onSelect(i)}
						/>
					))}
				</div>
			</div>
		</article>
	);
}
