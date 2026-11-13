import { Edit2, GripVertical, HelpCircle, Save, Trash2 } from "lucide-react";
import type { SortableDragHandle } from "@/components/ui/sortable-grid";
import type { GroupData } from "@/lib/api/types";

type GroupCardContentProps = {
	grp: GroupData;
	enabled: boolean;
	isOverlay: boolean;
	dragHandle: SortableDragHandle | null;
	editingId: number | null;
	formTitle: string;
	formText: string;
	setEditingId: (value: number | null) => void;
	setFormTitle: (value: string) => void;
	setFormText: (value: string) => void;
	handleUpdate: (id: number) => void;
	handleDelete: (id: number) => void;
	loadGroupQuestions: (id: number, toggle?: boolean) => void;
};

export function GroupCardContent({
	grp,
	enabled,
	isOverlay,
	dragHandle,
	editingId,
	formTitle,
	formText,
	setEditingId,
	setFormTitle,
	setFormText,
	handleUpdate,
	handleDelete,
	loadGroupQuestions,
}: GroupCardContentProps) {
	return (
		<div
			className={`group rounded-3xl border p-5 transition-colors ${
				isOverlay
					? "border-accent/60 bg-accent/10 shadow-2xl scale-105 cursor-grabbing dark:bg-primary/20"
					: "border-slate-200/80 bg-white hover:border-accent/50 hover:shadow-md dark:border-slate-800 dark:bg-slate-900/60"
			}`}
		>
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-2">
					{enabled && dragHandle && (
						<span
							{...dragHandle.attributes}
							{...dragHandle.listeners}
							className="cursor-grab active:cursor-grabbing text-slate-300 hover:text-slate-500 dark:text-slate-600 dark:hover:text-slate-400 transition-colors touch-none"
						>
							<GripVertical className="size-4" />
						</span>
					)}
					<span className="rounded-xl bg-accent/10 px-2.5 py-1 font-mono text-xs font-black text-accent dark:bg-accent/20 dark:text-accent">
						{grp.number > 0 ? `Խումբ - ${grp.number}` : "Խումբ"}
					</span>
				</div>
				<div className="flex gap-1">
					<button
						type="button"
						onClick={() => loadGroupQuestions(grp.id, true)}
						title="Հարցերի ցանկ"
						className="flex items-center gap-1 rounded-xl bg-accent/10 px-2.5 py-1.5 font-bold text-accent transition-colors hover:bg-accent/15 dark:bg-accent/20 dark:text-accent dark:hover:bg-accent/30"
					>
						<HelpCircle className="size-3.5" /> Հարցեր
					</button>
					<button
						type="button"
						onClick={() => {
							setEditingId(grp.id);
							setFormTitle(grp.title);
							setFormText(grp.text || "");
						}}
						className="grid size-8 place-items-center rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
					>
						<Edit2 className="size-3.5" />
					</button>
					<button
						type="button"
						onClick={() => handleDelete(grp.id)}
						className="grid size-8 place-items-center rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 dark:bg-rose-950/40 dark:text-rose-400"
					>
						<Trash2 className="size-3.5" />
					</button>
				</div>
			</div>
			{editingId === grp.id && !isOverlay ? (
				<div className="mt-3 flex flex-col gap-2">
					<input
						type="text"
						value={formTitle}
						onChange={(e) => setFormTitle(e.target.value)}
						className="w-full rounded-lg border px-3 py-2 text-sm font-bold dark:bg-slate-800 dark:border-slate-700"
					/>
					<textarea
						value={formText}
						onChange={(e) => setFormText(e.target.value)}
						className="w-full rounded-lg border px-3 py-2 text-sm dark:bg-slate-800 dark:border-slate-700 min-h-[60px]"
						placeholder="Նկարագրություն..."
					/>
					<div className="flex justify-end gap-2 mt-1">
						<button
							type="button"
							onClick={() => {
								setEditingId(null);
								setFormTitle("");
								setFormText("");
							}}
							className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
						>
							Չեղարկել
						</button>
						<button
							type="button"
							onClick={() => handleUpdate(grp.id)}
							className="flex items-center gap-1.5 rounded-lg bg-[image:var(--gradient-accent)] px-3 py-1.5 text-xs font-bold text-white shadow-md shadow-accent/20 hover:opacity-90"
						>
							<Save className="size-3.5" />
							Պահպանել
						</button>
					</div>
				</div>
			) : (
				<>
					<h3 className="mt-3 text-base font-black text-slate-900 dark:text-white">
						{grp.title}-{grp.number}
					</h3>
					{grp.text && (
						<p
							className="mt-1.5 text-sm leading-snug text-slate-500 line-clamp-2 dark:text-slate-400"
							title={grp.text}
						>
							{grp.text}
						</p>
					)}
				</>
			)}
			<div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-slate-400 dark:border-slate-800">
				<span className="flex items-center gap-1.5">
					<span>Թեմատիկ Հարցեր</span>
					<span className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] font-bold text-slate-500 dark:bg-slate-800 dark:text-slate-400">
						{grp.questionCount ?? grp.questions?.length ?? 0} հարց
					</span>
				</span>
			</div>
		</div>
	);
}
