import { Link } from "@tanstack/react-router";
import { ArrowLeft, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TestRunnerToolbarProps {
	current: number;
	total: number;
	left: number;
	mm: string;
	ss: string;
}

/** Remaining seconds below which the timer turns urgent (three minutes). */
const URGENT_TIME_SECONDS = 180;

export function TestRunnerToolbar({ current, total, left, mm, ss }: TestRunnerToolbarProps) {
	return (
		<div className="flex items-center justify-between gap-2 sm:gap-4">
			{/* Back Button */}
			<Button
				asChild
				variant="outline"
				size="sm"
				className="h-9 px-3 rounded-xl border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shadow-xs text-xs sm:text-sm shrink-0 bg-white dark:bg-slate-900"
			>
				<Link to="/tests">
					<ArrowLeft className="size-3.5 sm:size-4 mr-1 sm:mr-1.5" />
					<span>Թեստեր</span>
				</Link>
			</Button>

			{/* Question Counter */}
			<div className="flex items-center gap-1.5 sm:gap-2">
				<span className="hidden xs:inline text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
					Հարց
				</span>
				<span className="inline-flex items-center px-2.5 sm:px-3 py-1 rounded-full bg-primary/10 text-primary font-bold text-xs sm:text-sm whitespace-nowrap">
					{current + 1} / {total}
				</span>
			</div>

			{/* Timer: Compact, visible, non-dominant */}
			<div
				role="status"
				aria-label={`Time remaining: ${mm} minutes ${ss} seconds`}
				className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-1.5 rounded-full font-mono text-xs sm:text-sm font-bold border shadow-xs transition-colors shrink-0 ${
					left < URGENT_TIME_SECONDS
						? "bg-rose-50 text-rose-700 border-rose-200 animate-pulse"
						: "bg-slate-900 text-white dark:bg-slate-800 border-slate-700"
				}`}
			>
				<Clock className="size-3.5 sm:size-4" aria-hidden="true" />
				<span className="sr-only">Time remaining: </span>
				{mm}:{ss}
			</div>
		</div>
	);
}
