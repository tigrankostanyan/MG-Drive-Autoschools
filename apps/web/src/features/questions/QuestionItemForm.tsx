import { Save } from "lucide-react";
import type { Dispatch, SetStateAction } from "react";
import { useEffect, useRef } from "react";
import type { OptionsLayout, QuestionForm } from "./types";

const OPTIONS_CLASS: Record<OptionsLayout, string> = {
	grid: "mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2",
	stack: "mt-3 grid grid-cols-1 gap-3",
};

export function QuestionItemForm({
	qEditingId,
	qForm,
	setQForm,
	radioName,
	optionsLayout,
	onSave,
	onCancel,
}: {
	qEditingId: number | null;
	qForm: QuestionForm;
	setQForm: Dispatch<SetStateAction<QuestionForm>>;
	radioName: string;
	optionsLayout: OptionsLayout;
	onSave: () => void;
	onCancel: () => void;
}) {
	const formRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		formRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
	}, []);

	const formRadioName = `${radioName}-${qEditingId ?? "new"}`;
	const optionRows = qForm.options.map((opt, idx) => ({
		opt,
		idx,
		optionKey: `option-${idx}`,
	}));
	return (
		<div
			ref={formRef}
			className="rounded-3xl border-2 border-accent bg-white p-6 shadow-xl dark:bg-slate-900"
		>
			<p className="text-sm font-extrabold text-accent dark:text-accent">
				{qEditingId === -1
					? "Նոր Հարցի Ավելացում"
					: qForm.number
						? `Հարց #${qForm.number}-ի Խմբագրում`
						: "Հարցի Խմբագրում"}
			</p>
			<input
				type="text"
				placeholder="Մուտքագրեք հարցի բովանդակությունը..."
				value={qForm.question}
				onChange={(e) => setQForm((f) => ({ ...f, question: e.target.value }))}
				className="mt-4 w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 py-3 text-sm font-semibold outline-none focus:border-accent focus:bg-white dark:border-slate-800 dark:bg-slate-800"
			/>
			<div className="mt-6">
				<p className="text-xs font-bold text-slate-400">
					Պատասխանի Տարբերակներ (Ընտրեք ճիշտ պատասխանը ռադիո կոճակով)
				</p>
				<div className={OPTIONS_CLASS[optionsLayout]}>
					{optionRows.map(({ opt, idx, optionKey }) => (
						<div
							key={optionKey}
							className={`flex items-center gap-3 rounded-2xl border p-3 ${
								qForm.correctAnswerIndex === idx
									? "border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20"
									: "border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-800"
							}`}
						>
							<input
								type="radio"
								name={formRadioName}
								checked={qForm.correctAnswerIndex === idx}
								onChange={() =>
									setQForm((f) => ({
										...f,
										correctAnswerIndex: idx,
									}))
								}
								className="size-5 text-emerald-600 focus:ring-0"
							/>
							<input
								type="text"
								placeholder={`Տարբերակ ${idx + 1}`}
								value={opt}
								onChange={(e) => {
									const newOpts = [...qForm.options];
									newOpts[idx] = e.target.value;
									setQForm((f) => ({ ...f, options: newOpts }));
								}}
								className="w-full bg-transparent text-sm font-medium outline-none"
							/>
						</div>
					))}
				</div>
			</div>
			<div className="mt-6 flex justify-end gap-3">
				<button
					type="button"
					onClick={onCancel}
					className="rounded-xl border px-5 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-100 dark:text-slate-300"
				>
					Չեղարկել
				</button>
				<button
					type="button"
					onClick={onSave}
					className="flex items-center gap-2 rounded-xl bg-[image:var(--gradient-accent)] px-6 py-2.5 text-sm font-bold text-white shadow-md shadow-accent/25 hover:brightness-110"
				>
					<Save className="size-4" /> Պահպանել
				</button>
			</div>
		</div>
	);
}
