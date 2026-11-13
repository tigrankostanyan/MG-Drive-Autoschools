/** Inline "create new row" form shown above the admin list views. */
export function InlineAddForm({
	title,
	placeholder,
	value,
	onValueChange,
	onCancel,
	onSave,
}: {
	title: string;
	placeholder: string;
	value: string;
	onValueChange: (value: string) => void;
	onCancel: () => void;
	onSave: () => void;
}) {
	return (
		<div className="rounded-3xl border border-accent/30 bg-white p-6 shadow-xl dark:border-indigo-900/40 dark:bg-slate-900">
			<h3 className="font-extrabold text-slate-900 dark:text-white">{title}</h3>
			<input
				type="text"
				placeholder={placeholder}
				value={value}
				onChange={(e) => onValueChange(e.target.value)}
				className="mt-3 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:border-accent focus:bg-white dark:border-slate-800 dark:bg-slate-800"
			/>
			<div className="mt-4 flex justify-end gap-2">
				<button
					type="button"
					onClick={onCancel}
					className="rounded-xl border px-4 py-2 text-xs font-semibold"
				>
					Չեղարկել
				</button>
				<button
					type="button"
					onClick={onSave}
					className="rounded-xl bg-[image:var(--gradient-accent)] px-5 py-2 text-xs font-bold text-white"
				>
					Պահպանել
				</button>
			</div>
		</div>
	);
}
