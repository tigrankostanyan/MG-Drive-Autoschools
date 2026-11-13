import { CheckCircle2, Circle, XCircle } from "lucide-react";

interface AnswerOptionProps {
	text: string;
	index: number;
	isSelected: boolean;
	isCorrect?: boolean;
	reveal?: boolean;
	locked?: boolean;
	onSelect?: () => void;
	disabled?: boolean;
}

export function AnswerOption({
	text,
	index: _index,
	isSelected,
	isCorrect = false,
	reveal = false,
	locked = false,
	onSelect,
	disabled = false,
}: AnswerOptionProps) {
	let containerStyles =
		"border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-primary/50 hover:bg-primary/[0.03] cursor-pointer text-foreground/90 shadow-sm";
	let IconComponent = Circle;
	let iconStyles = "text-slate-300 dark:text-slate-600 group-hover:text-primary/50";
	let badge: { text: string; className: string } | null = null;

	if (reveal) {
		if (isCorrect && isSelected) {
			containerStyles =
				"border-emerald-500/80 bg-emerald-50/90 dark:bg-emerald-950/30 ring-1 ring-emerald-500/30 cursor-default text-emerald-950 dark:text-emerald-100 shadow-sm";
			IconComponent = CheckCircle2;
			iconStyles = "text-emerald-600 dark:text-emerald-400";
			badge = {
				text: "Ձեր պատասխանը (Ճիշտ)",
				className:
					"bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-300 border-emerald-300/50",
			};
		} else if (isCorrect && !isSelected) {
			// Correct option, but user did not choose it
			containerStyles =
				"border-emerald-500/70 bg-emerald-50/60 dark:bg-emerald-950/20 ring-1 ring-emerald-500/20 cursor-default text-emerald-950 dark:text-emerald-100 shadow-sm";
			IconComponent = CheckCircle2;
			iconStyles = "text-emerald-600 dark:text-emerald-400";
			badge = {
				text: "Ճիշտ պատասխան",
				className:
					"bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-300 border-emerald-300/50",
			};
		} else if (!isCorrect && isSelected) {
			// User selected this wrong option
			containerStyles =
				"border-rose-500/80 bg-rose-50/90 dark:bg-rose-950/30 ring-1 ring-rose-500/30 cursor-default text-rose-950 dark:text-rose-100 shadow-sm";
			IconComponent = XCircle;
			iconStyles = "text-rose-600 dark:text-rose-400";
			badge = {
				text: "Ձեր պատասխանը",
				className:
					"bg-rose-100 dark:bg-rose-900/50 text-rose-800 dark:text-rose-300 border-rose-300/50",
			};
		} else {
			// Neutral option
			containerStyles =
				"border-slate-200/50 dark:border-slate-800/50 bg-slate-50/40 dark:bg-slate-900/30 opacity-55 cursor-default text-slate-500 dark:text-slate-400";
			IconComponent = Circle;
			iconStyles = "text-slate-300 dark:text-slate-700";
		}
	} else if (isSelected) {
		// Active quiz - selected
		containerStyles =
			"border-primary bg-primary/[0.08] dark:bg-primary/20 ring-1 ring-primary/30 text-foreground font-semibold shadow-sm " +
			(locked ? "cursor-default" : "cursor-pointer");
		IconComponent = CheckCircle2;
		iconStyles = "text-primary";
	} else if (locked || disabled) {
		// Active quiz - other options after selection
		containerStyles =
			"border-slate-200/60 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-900/40 opacity-50 cursor-default text-slate-600 dark:text-slate-400";
		IconComponent = Circle;
		iconStyles = "text-slate-300 dark:text-slate-700";
	}

	return (
		<button
			type="button"
			onClick={onSelect}
			disabled={reveal || locked || disabled}
			className={`group relative flex w-full items-start gap-3 sm:gap-4 rounded-xl sm:rounded-2xl border px-3.5 py-3 sm:px-4.5 sm:py-4 text-left transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/80 focus-visible:ring-offset-2 active:scale-[0.995] ${containerStyles}`}
		>
			<IconComponent
				className={`size-5 shrink-0 mt-0.5 transition-colors duration-200 ${iconStyles}`}
			/>
			<div className="flex-1 min-w-0 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
				<span className="leading-snug sm:leading-relaxed break-words font-medium text-[15px] sm:text-base">
					{text}
				</span>
				{badge && (
					<span
						className={`inline-flex items-center shrink-0 self-start sm:self-center px-2.5 py-1 rounded-full text-xs font-bold border tracking-wide uppercase ${badge.className}`}
					>
						{badge.text}
					</span>
				)}
			</div>
		</button>
	);
}
