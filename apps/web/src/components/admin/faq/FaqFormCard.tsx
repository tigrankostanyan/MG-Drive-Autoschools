import { Loader2, Save, X } from "lucide-react";
import type { FaqFormValues } from "@/hooks/use-faq-manager";

export function FaqFormCard({
	adding,
	categories,
	form,
	saving,
	onFormChange,
	onCancel,
	onSubmit,
}: {
	adding: boolean;
	categories: string[];
	form: FaqFormValues;
	saving: boolean;
	onFormChange: (form: FaqFormValues) => void;
	onCancel: () => void;
	onSubmit: () => void;
}) {
	return (
		<div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/60 animate-in fade-in slide-in-from-top-4">
			<div className="flex items-center justify-between mb-4">
				<h3 className="font-extrabold text-slate-900 dark:text-white">
					{adding ? "Ավելացնել Նոր Հարց" : "Խմբագրել Հարցը"}
				</h3>
				<button
					type="button"
					onClick={onCancel}
					disabled={saving}
					aria-label="Փակել"
					className="rounded-xl border p-1.5 text-slate-400 hover:bg-slate-100 disabled:opacity-50 dark:hover:bg-slate-800"
				>
					<X className="size-4" />
				</button>
			</div>
			<div className="space-y-4">
				<div>
					<label
						htmlFor="faq-category"
						className="text-xs font-bold text-slate-600 dark:text-slate-300"
					>
						Բաժին
					</label>
					<select
						id="faq-category"
						value={form.category}
						onChange={(e) => onFormChange({ ...form, category: e.target.value })}
						className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:border-accent dark:border-slate-800 dark:bg-slate-800"
					>
						{categories.map((c) => (
							<option key={c} value={c}>
								{c}
							</option>
						))}
					</select>
				</div>
				<div>
					<label
						htmlFor="faq-question"
						className="text-xs font-bold text-slate-600 dark:text-slate-300"
					>
						Հարց
					</label>
					<input
						id="faq-question"
						type="text"
						value={form.question}
						onChange={(e) => onFormChange({ ...form, question: e.target.value })}
						className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:border-accent dark:border-slate-800 dark:bg-slate-800"
						placeholder="Օրինակ՝ Որքա՞ն է տևում ուսումը:"
					/>
				</div>
				<div>
					<label
						htmlFor="faq-answer"
						className="text-xs font-bold text-slate-600 dark:text-slate-300"
					>
						Պատասխան
					</label>
					<textarea
						id="faq-answer"
						value={form.answer}
						onChange={(e) => onFormChange({ ...form, answer: e.target.value })}
						className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:border-accent dark:border-slate-800 dark:bg-slate-800 min-h-[100px]"
						placeholder="Գրեք հարցի պատասխանը..."
					/>
				</div>
				<div className="pt-2 flex justify-end">
					<button
						type="button"
						onClick={onSubmit}
						disabled={saving}
						aria-busy={saving ? true : undefined}
						className="flex items-center gap-2 rounded-xl bg-[image:var(--gradient-accent)] px-5 py-2 text-xs font-bold text-white shadow-md shadow-accent/25 hover:brightness-110 disabled:pointer-events-none disabled:opacity-70"
					>
						{saving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
						Պահպանել
					</button>
				</div>
			</div>
		</div>
	);
}
