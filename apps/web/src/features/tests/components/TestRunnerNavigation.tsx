import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TestRunnerNavigationProps {
	hasImage: boolean;
	isFirst: boolean;
	isLast: boolean;
	isAnswered: boolean;
	onPrev: () => void;
	onNext: () => void;
	onFinish: () => void;
}

export function TestRunnerNavigation({
	hasImage,
	isFirst,
	isLast,
	isAnswered,
	onPrev,
	onNext,
	onFinish,
}: TestRunnerNavigationProps) {
	return (
		<div
			className={`mt-6 sm:mt-10 pt-4 sm:pt-8 border-t border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between gap-3 sm:gap-4 ${
				!hasImage ? "w-full lg:w-[82%] xl:w-[80%] lg:max-w-[1120px] mx-auto" : "w-full"
			}`}
		>
			<Button
				variant="outline"
				size="lg"
				className="flex-1 sm:flex-initial rounded-xl h-11 sm:h-12 px-4 sm:px-6 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 text-sm sm:text-base bg-white dark:bg-slate-900 shadow-xs"
				disabled={isFirst}
				onClick={onPrev}
			>
				<ArrowLeft className="size-4 mr-1.5 sm:mr-2" />
				<span>Նախորդ</span>
			</Button>

			{isLast ? (
				<Button
					size="lg"
					className="flex-1 sm:flex-initial rounded-xl h-11 sm:h-12 px-5 sm:px-8 bg-primary text-white hover:bg-primary/90 shadow-md shadow-primary/20 text-sm sm:text-base font-semibold"
					disabled={!isAnswered}
					onClick={onFinish}
				>
					<span>Ավարտել</span>
					<CheckCircle2 className="size-4 ml-1.5 sm:ml-2" />
				</Button>
			) : (
				<Button
					size="lg"
					className="flex-1 sm:flex-initial rounded-xl h-11 sm:h-12 px-5 sm:px-8 bg-primary text-white hover:bg-primary/90 shadow-md shadow-primary/20 text-sm sm:text-base font-semibold"
					disabled={!isAnswered}
					onClick={onNext}
				>
					<span>Հաջորդ</span>
					<ArrowRight className="size-4 ml-1.5 sm:ml-2" />
				</Button>
			)}
		</div>
	);
}
