import { Link, TextCursorInput, Trash } from "lucide-react";
import type { MenuItemRow } from "@/hooks/use-menu-items";

export function MenuItemRowView({
	index,
	item,
	onUpdate,
	onRemove,
}: {
	index: number;
	item: MenuItemRow;
	onUpdate: (field: "label" | "path", value: string) => void;
	onRemove: () => void;
}) {
	return (
		<div className="group flex flex-col gap-3 rounded-2xl border border-slate-200/80 bg-slate-50/50 p-3.5 transition-colors hover:border-slate-300 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900/50 dark:hover:border-slate-700 sm:flex-row sm:items-center sm:p-4">
			<div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm dark:bg-slate-800">
				<span className="font-mono text-sm font-bold text-slate-400">{index}</span>
			</div>

			<div className="flex flex-1 flex-col gap-3 sm:flex-row">
				<div className="relative flex flex-1 items-center">
					<TextCursorInput className="pointer-events-none absolute left-3.5 size-4 text-slate-400" />
					<input
						type="text"
						value={item.label}
						onChange={(e) => onUpdate("label", e.target.value)}
						placeholder="Անվանում (օր․՝ Գլխավոր)"
						className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm font-medium outline-none transition-all focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 dark:border-slate-700 dark:bg-slate-900 dark:focus:border-emerald-500"
					/>
				</div>
				<div className="relative flex flex-1 items-center">
					<Link className="pointer-events-none absolute left-3.5 size-4 text-slate-400" />
					<input
						type="text"
						value={item.path}
						onChange={(e) => onUpdate("path", e.target.value)}
						placeholder="Հղում (օր․՝ /courses)"
						className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm font-medium outline-none transition-all focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 dark:border-slate-700 dark:bg-slate-900 dark:focus:border-emerald-500"
					/>
				</div>
			</div>

			<button
				type="button"
				onClick={onRemove}
				className="grid size-10 shrink-0 place-items-center rounded-xl text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-500 dark:hover:bg-rose-500/10"
				aria-label="Ջնջել"
			>
				<Trash className="size-4" />
			</button>
		</div>
	);
}
