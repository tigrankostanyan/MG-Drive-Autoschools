import { Lightbulb } from "lucide-react";

export function QuestionExplanationPanel({ explanation }: { explanation: string }) {
	return (
		<div className="w-full rounded-2xl border border-blue-100 dark:border-blue-900/40 bg-blue-50/60 dark:bg-blue-950/20 p-4 sm:p-5">
			<div className="flex items-center gap-2 mb-1.5 text-xs font-bold uppercase tracking-wider text-blue-700 dark:text-blue-400">
				<Lightbulb className="size-4" />
				<span>Բացատրություն</span>
			</div>
			<p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">{explanation}</p>
		</div>
	);
}
