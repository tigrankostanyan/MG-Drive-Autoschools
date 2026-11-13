import { Edit2, GripVertical, Trash2 } from "lucide-react";
import type { SortableDragHandle } from "@/components/ui/sortable-grid";
import type { QuestionData } from "@/lib/api/types";
import { normalizeQuestionOptions } from "@/lib/quiz";
import type { OptionsLayout } from "./types";

const OPTIONS_CLASS: Record<OptionsLayout, string> = {
	grid: "mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2 pl-10",
	stack: "mt-4 flex flex-col gap-2 pl-10",
};

export function QuestionItemCard({
	q,
	rowId,
	optionsLayout,
	enabled,
	isOverlay,
	dragHandle,
	onEdit,
	onDelete,
	onManualSort,
}: {
	q: QuestionData;
	rowId: number;
	optionsLayout: OptionsLayout;
	enabled?: boolean;
	isOverlay?: boolean;
	dragHandle?: SortableDragHandle | null;
	onEdit: (q: QuestionData) => void;
	onDelete: (qid: number, rowId: number) => void;
	onManualSort?: (qid: number, newNumber: number) => void;
}) {
	const options = normalizeQuestionOptions(q.options);
	return (
		<div
			className={`relative flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition-all dark:border-slate-800 dark:bg-slate-900 ${isOverlay ? "z-50 scale-[1.01] shadow-xl ring-2 ring-accent" : ""}`}
		>
			<div className="flex-1">
				<div className="flex items-center gap-3">
					{enabled && dragHandle && (
						<span
							{...dragHandle.attributes}
							{...dragHandle.listeners}
							className="grid cursor-grab touch-none place-items-center rounded-lg p-1 text-slate-300 transition-all hover:text-slate-500 hover:opacity-100 active:cursor-grabbing dark:text-slate-600 dark:hover:text-slate-300 shrink-0"
						>
							<GripVertical className="size-5" />
						</span>
					)}
					<input
						key={q.number}
						type="number"
						defaultValue={q.number}
						onBlur={(e) => {
							const val = parseInt(e.target.value, 10);
							if (!Number.isNaN(val) && val !== q.number && onManualSort) {
								onManualSort(q.id, val);
							}
						}}
						onKeyDown={(e) => {
							if (e.key === "Enter") {
								e.currentTarget.blur();
							}
						}}
						className="flex h-8 w-12 items-center justify-center rounded-lg border border-accent/20 bg-accent/5 px-1 text-center text-sm font-bold text-accent transition-colors hover:bg-accent/10 focus:border-accent focus:bg-white focus:outline-none focus:ring-2 focus:ring-accent/20 dark:bg-accent/10 dark:text-accent dark:focus:bg-slate-900 shrink-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
						min={1}
					/>
					<p className="font-extrabold text-slate-900 dark:text-white text-sm sm:text-base leading-snug">
						{q.question}
					</p>
				</div>
				<div className={OPTIONS_CLASS[optionsLayout]}>
					{options.map((opt, i) => (
						<div
							key={opt}
							className={`rounded-xl px-3.5 py-2 text-xs font-semibold ${
								i === q.correctAnswerIndex
									? "bg-emerald-100 font-bold text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300/50"
									: "bg-slate-50 text-slate-600 border border-slate-100 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-400"
							}`}
						>
							{opt}
						</div>
					))}
				</div>
			</div>
			<div className="flex items-center gap-2 shrink-0 sm:pl-4">
				<button
					type="button"
					onClick={() => onEdit(q)}
					className="grid size-9 place-items-center rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
				>
					<Edit2 className="size-4" />
				</button>
				<button
					type="button"
					onClick={() => onDelete(q.id, rowId)}
					className="grid size-9 place-items-center rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 dark:bg-rose-950/40 dark:text-rose-400"
				>
					<Trash2 className="size-4" />
				</button>
			</div>
		</div>
	);
}
