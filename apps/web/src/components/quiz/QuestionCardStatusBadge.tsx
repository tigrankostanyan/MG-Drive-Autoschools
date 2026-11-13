import { CheckCircle2, HelpCircle } from "lucide-react";

interface QuestionCardStatusBadgeProps {
	reveal: boolean;
	isCorrect: boolean;
	isAnswered: boolean;
}

export function QuestionCardStatusBadge({
	reveal,
	isCorrect,
	isAnswered,
}: QuestionCardStatusBadgeProps) {
	if (reveal) {
		if (isCorrect) {
			return (
				<span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/80">
					<CheckCircle2 className="size-3.5 text-emerald-600 dark:text-emerald-400" />
					Ճիշտ է
				</span>
			);
		}
		if (isAnswered) {
			return (
				<span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200/80 dark:border-rose-800/80">
					Սխալ է
				</span>
			);
		}
		return (
			<span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-500">
				<HelpCircle className="size-3.5 text-slate-400" />
				Բաց թողնված
			</span>
		);
	}

	if (isAnswered) {
		return (
			<span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-primary/5 text-primary border border-primary/20">
				Ընտրված է
			</span>
		);
	}

	return null;
}
