import type { QuestionData } from "@/lib/api/types";
import { MAX_ANSWER_CHANGES, toCardQuestion } from "@/lib/quiz";
import { toPercent } from "@/lib/utils";
import { TestQuestionCard } from "./TestQuestionCard";
import { TestRunnerNavigation } from "./TestRunnerNavigation";
import { TestRunnerToolbar } from "./TestRunnerToolbar";

interface TestRunnerActiveViewProps {
	questions: QuestionData[];
	current: number;
	setCurrent: React.Dispatch<React.SetStateAction<number>>;
	answers: Record<number, number>;
	answerChanges: Record<number, number>;
	left: number;
	mm: string;
	ss: string;
	onSelectAnswer: (questionId: number, idx: number) => void;
	onFinish: () => void;
}

export function TestRunnerActiveView({
	questions,
	current,
	setCurrent,
	answers,
	answerChanges,
	left,
	mm,
	ss,
	onSelectAnswer,
	onFinish,
}: TestRunnerActiveViewProps) {
	const question = questions[current];
	const cardQuestion = question ? toCardQuestion(question, current) : null;
	const isAnswered = question ? answers[question.id] !== undefined : false;
	const changesUsed = question ? (answerChanges[question.id] ?? 0) : 0;
	const remainingChanges = Math.max(0, MAX_ANSWER_CHANGES - changesUsed);
	const isLocked = isAnswered && changesUsed >= MAX_ANSWER_CHANGES;

	return (
		<div className="w-full min-h-[calc(100dvh-4.5rem)] sm:min-h-[calc(100dvh-5rem)] bg-[#F8FAFC] dark:bg-[#0B0F19] pt-4 pb-8 sm:py-8 lg:py-10 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
			{/* Main Test Workspace: Seamless full-width on mobile, Clean Card on desktop */}
			<div className="w-full max-w-[1400px] bg-transparent sm:bg-white sm:dark:bg-slate-900 rounded-none sm:rounded-3xl border-0 sm:border sm:border-slate-200/90 sm:dark:border-slate-800 shadow-none sm:shadow-sm p-0 sm:p-8 lg:p-10 xl:p-12 flex flex-col">
				{/* 1. Test Toolbar: row [Back] Question 1/20 [Timer] */}
				<TestRunnerToolbar current={current} total={questions.length} left={left} mm={mm} ss={ss} />

				{/* 2. Progress Bar: Spaced 12px (mt-3) on mobile, 24px (sm:mt-6) on desktop */}
				<div className="mt-3 sm:mt-6">
					<div
						role="progressbar"
						aria-valuenow={current + 1}
						aria-valuemin={1}
						aria-valuemax={questions.length}
						aria-valuetext={`${current + 1} of ${questions.length} questions`}
						aria-label="Quiz progress"
						className="h-2 sm:h-2.5 w-full overflow-hidden rounded-full bg-slate-200/80 dark:bg-slate-800"
					>
						<div
							className="h-full bg-primary transition-all duration-300 ease-out rounded-full"
							style={{
								width: `${toPercent(current + 1, questions.length)}%`,
							}}
						/>
					</div>
				</div>

				{/* 3. Question Area: Spaced 24px (mt-6) on mobile, 40-48px (sm:mt-10 lg:mt-12) on desktop */}
				<div className="mt-6 sm:mt-10 lg:mt-12 flex-1">
					{question && cardQuestion ? (
						<div className="w-full">
							<TestQuestionCard
								question={cardQuestion}
								selected={answers[question.id] ?? null}
								locked={isLocked}
								remainingChanges={remainingChanges}
								onSelect={(idx) => onSelectAnswer(question.id, idx)}
							/>

							{/* 4. Previous / Next Navigation Row: Spaced 24px (mt-6) on mobile, 32-40px on desktop */}
							<TestRunnerNavigation
								hasImage={Boolean(cardQuestion.imageUrl)}
								isFirst={current === 0}
								isLast={current === questions.length - 1}
								isAnswered={answers[question.id] !== undefined}
								onPrev={() => setCurrent((c) => c - 1)}
								onNext={() => setCurrent((c) => c + 1)}
								onFinish={onFinish}
							/>
						</div>
					) : (
						<div className="rounded-2xl border border-slate-200 dark:border-slate-800 p-8 sm:p-12 text-center text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900">
							Հարցեր չկան
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
