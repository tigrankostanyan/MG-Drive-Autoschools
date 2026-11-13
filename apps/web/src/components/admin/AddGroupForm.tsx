import { Loader2, RefreshCw, Save, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface AddGroupFormProps {
	form: { title: string };
	saving: boolean;
	error?: string | undefined;
	onFormChange: (field: "title", value: string) => void;
	onGenerateName: () => void;
	onCancel: () => void;
	onSave: () => void;
}
export function AddGroupForm({
	form,
	saving,
	error,
	onFormChange,
	onGenerateName,
	onCancel,
	onSave,
}: AddGroupFormProps) {
	return (
		<div className="rounded-3xl border border-accent/30 bg-white p-6 shadow-xl dark:border-accent/30 dark:bg-slate-900">
			<div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
				<h3 className="font-extrabold text-slate-900 dark:text-white">
					Նոր Ուսանողական Խմբի Ստեղծում
				</h3>
				<button
					type="button"
					onClick={onCancel}
					disabled={saving}
					aria-label="Փակել"
					className="text-slate-400 hover:text-slate-600 disabled:opacity-50"
				>
					<X className="size-5" />
				</button>
			</div>
			<div className="mt-4 space-y-4">
				<div>
					<div className="flex items-center justify-between mb-1">
						<label
							htmlFor="add-group-title"
							className="text-xs font-bold text-slate-600 dark:text-slate-300"
						>
							Խմբի Անվանում
						</label>
					</div>
					<div className="relative">
						<input
							id="add-group-title"
							type="text"
							placeholder="օրինակ՝ N23B4"
							value={form.title}
							disabled={saving}
							onChange={(e) => onFormChange("title", e.target.value)}
							aria-invalid={error ? true : undefined}
							aria-describedby={error ? "add-group-title-error" : undefined}
							className={cn(
								"w-full rounded-xl border bg-slate-50 py-2.5 pl-4 pr-10 text-sm outline-none focus:bg-white dark:bg-slate-800/60",
								error
									? "border-red-300 focus:border-red-500 dark:border-red-800"
									: "border-slate-200 focus:border-accent dark:border-slate-800",
							)}
						/>
						<button
							type="button"
							onClick={onGenerateName}
							disabled={saving}
							title="Գեներացնել անուն"
							aria-label="Գեներացնել անուն"
							className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-slate-400 hover:bg-slate-200 hover:text-accent transition-colors disabled:opacity-50 dark:hover:bg-slate-700"
						>
							<RefreshCw className="size-4" />
						</button>
					</div>
					{error && (
						<p
							id="add-group-title-error"
							role="alert"
							className="mt-1 text-xs font-medium text-red-500"
						>
							{error}
						</p>
					)}
				</div>
				<div className="flex justify-end gap-2 pt-2">
					<button
						type="button"
						onClick={onCancel}
						disabled={saving}
						className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 disabled:opacity-50 dark:border-slate-800 dark:text-slate-300"
					>
						Չեղարկել
					</button>
					<button
						type="button"
						onClick={onSave}
						disabled={saving}
						aria-busy={saving ? true : undefined}
						className="flex items-center gap-2 rounded-xl bg-[image:var(--gradient-accent)] px-5 py-2 text-xs font-bold text-white hover:brightness-110 disabled:pointer-events-none disabled:opacity-70"
					>
						{saving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}{" "}
						Պահպանել
					</button>
				</div>
			</div>
		</div>
	);
}
