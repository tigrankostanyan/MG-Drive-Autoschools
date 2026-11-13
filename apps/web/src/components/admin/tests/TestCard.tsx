import { Edit2, HelpCircle, Save, Trash2 } from "lucide-react";
import type { TestData } from "@/lib/api/types";

export function TestCard({
	tst,
	editingId,
	formTitle,
	setEditingId,
	setFormTitle,
	handleUpdate,
	handleDelete,
	loadTestQuestions,
}: {
	tst: TestData;
	editingId: number | null;
	formTitle: string;
	setEditingId: (id: number) => void;
	setFormTitle: (value: string) => void;
	handleUpdate: (id: number) => void;
	handleDelete: (id: number) => void;
	loadTestQuestions: (tid: number, toggle?: boolean) => void;
}) {
	return (
		<div className="group rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm transition-all hover:border-accent/50 hover:shadow-md dark:border-slate-800 dark:bg-slate-900/60">
			<div className="flex items-center justify-between">
				<span className="rounded-xl bg-accent/10 px-2.5 py-1 font-mono text-xs font-black text-accent dark:bg-accent/20 dark:text-accent">
					#{tst.number || tst.id}
				</span>
				<div className="flex gap-1">
					<button
						type="button"
						onClick={() => loadTestQuestions(tst.id, true)}
						title="Հարցերի ցանկ"
						className="flex items-center gap-1 rounded-xl bg-accent/10 px-2.5 py-1.5 font-bold text-accent transition-colors hover:bg-accent/15 dark:bg-accent/20 dark:text-accent dark:hover:bg-accent/30"
					>
						<HelpCircle className="size-3.5" /> Հարցեր
					</button>
					<button
						type="button"
						onClick={() => {
							setEditingId(tst.id);
							setFormTitle(tst.title);
						}}
						className="grid size-8 place-items-center rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
					>
						<Edit2 className="size-3.5" />
					</button>
					<button
						type="button"
						onClick={() => handleDelete(tst.id)}
						className="grid size-8 place-items-center rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 dark:bg-rose-950/40 dark:text-rose-400"
					>
						<Trash2 className="size-3.5" />
					</button>
				</div>
			</div>
			{editingId === tst.id ? (
				<div className="mt-3 flex gap-2">
					<input
						type="text"
						value={formTitle}
						onChange={(e) => setFormTitle(e.target.value)}
						className="w-full rounded-lg border px-3 py-1 text-xs font-bold"
					/>
					<button
						type="button"
						onClick={() => handleUpdate(tst.id)}
						className="rounded-lg bg-[image:var(--gradient-accent)] px-3 py-1 text-xs text-white"
					>
						<Save className="size-3.5" />
					</button>
				</div>
			) : (
				<h3 className="mt-3 text-base font-black text-slate-900 dark:text-white">{tst.title}</h3>
			)}
			<div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-slate-400 dark:border-slate-800">
				<span>Քննական Հարցեր</span>
				<span className="font-semibold text-emerald-600 dark:text-emerald-400">90% Շեմ</span>
			</div>
		</div>
	);
}
