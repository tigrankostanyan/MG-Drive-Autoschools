import { CheckCircle2, HelpCircle, Lightbulb, XCircle } from "lucide-react";
import { AnswerOption } from "@/components/quiz/AnswerOption";
import { QuestionImage } from "@/components/quiz/QuestionImage";
import type { CardQuestion } from "@/lib/quiz";

interface QuestionReviewCardProps {
	question: CardQuestion;
	number: number;
	selectedAnswer: number | null;
}

export function QuestionReviewCard({ question, number, selectedAnswer }: QuestionReviewCardProps) {
	const isAnswered = selectedAnswer !== null && selectedAnswer !== undefined;
	const isCorrect = isAnswered && selectedAnswer === question.correct;
	const hasImage = Boolean(question.imageUrl);

	return (
		<article className="w-full bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-xs sm:shadow-sm p-4 sm:p-7 md:p-8 transition-shadow hover:shadow-md">
			{/* Card Header: Question Number & Result Status Badge */}
			<div className="flex flex-wrap items-center justify-between gap-3 pb-4 sm:pb-5 border-b border-slate-100 dark:border-slate-800">
				<div className="flex items-center gap-2.5">
					<span className="flex items-center justify-center size-7 sm:size-8 rounded-full bg-slate-100 dark:bg-slate-800 font-bold text-xs sm:text-sm text-slate-700 dark:text-slate-300">
						{number}
					</span>
					<span className="text-sm font-semibold text-slate-500 dark:text-slate-400">
						Հարց {number}
					</span>
				</div>

				<div>
					{isCorrect ? (
						<span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs sm:text-sm font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/80">
							<CheckCircle2 className="size-4 text-emerald-600 dark:text-emerald-400" />
							Ճիշտ պատասխան
						</span>
					) : isAnswered ? (
						<span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs sm:text-sm font-bold bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200/80 dark:border-rose-800/80">
							<XCircle className="size-4 text-rose-600 dark:text-rose-400" />
							Սխալ պատասխան
						</span>
					) : (
						<span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs sm:text-sm font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
							<HelpCircle className="size-4 text-slate-400" />
							Բաց թողնված
						</span>
					)}
				</div>
			</div>

			{/* Card Body */}
			<div className="pt-5 sm:pt-6">
				{hasImage ? (
					// 2-Column layout for questions with image
					<div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
						<div className="lg:col-span-5 w-full">
							<div className="relative overflow-hidden rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/50 shadow-sm flex items-center justify-center p-2 sm:p-3">
								<QuestionImage
									src={question.imageUrl ?? ""}
									alt={`Հարց ${number} պատկեր`}
									className="max-h-[280px] sm:max-h-[320px] lg:max-h-[360px]"
								/>
							</div>
						</div>

						{/* Right: Question Text, Options & Explanation (approx 62%) */}
						<div className="lg:col-span-7 w-full flex flex-col space-y-5">
							<h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 leading-snug">
								{question.text}
							</h3>

							<div className="grid gap-2.5 sm:gap-3 w-full">
								{question.options.map((opt, i) => (
									<AnswerOption
										key={opt}
										text={opt}
										index={i}
										isSelected={selectedAnswer === i}
										isCorrect={i === question.correct}
										reveal={true}
									/>
								))}
							</div>

							{/* Explanation block */}
							{question.explanation && question.explanation.trim() !== "" && (
								<div className="rounded-2xl border border-blue-100 dark:border-blue-900/40 bg-blue-50/60 dark:bg-blue-950/20 p-4 sm:p-5">
									<div className="flex items-center gap-2 mb-1.5 text-xs font-bold uppercase tracking-wider text-blue-700 dark:text-blue-400">
										<Lightbulb className="size-4" />
										<span>Բացատրություն</span>
									</div>
									<p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
										{question.explanation}
									</p>
								</div>
							)}
						</div>
					</div>
				) : (
					// 1-Column layout for questions without image
					<div className="flex flex-col space-y-5 w-full max-w-[1120px]">
						<h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100 leading-normal sm:leading-relaxed">
							{question.text}
						</h3>

						<div className="grid gap-2.5 sm:gap-3 w-full">
							{question.options.map((opt, i) => (
								<AnswerOption
									key={opt}
									text={opt}
									index={i}
									isSelected={selectedAnswer === i}
									isCorrect={i === question.correct}
									reveal={true}
								/>
							))}
						</div>

						{/* Explanation block */}
						{question.explanation && question.explanation.trim() !== "" && (
							<div className="rounded-2xl border border-blue-100 dark:border-blue-900/40 bg-blue-50/60 dark:bg-blue-950/20 p-4 sm:p-5">
								<div className="flex items-center gap-2 mb-1.5 text-xs font-bold uppercase tracking-wider text-blue-700 dark:text-blue-400">
									<Lightbulb className="size-4" />
									<span>Բացատրություն</span>
								</div>
								<p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
									{question.explanation}
								</p>
							</div>
						)}
					</div>
				)}
			</div>
		</article>
	);
}
