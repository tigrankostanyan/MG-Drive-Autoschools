import { Clock, Edit2, Loader2, Save, Trash2, Users, X } from "lucide-react";
import type { StudentGroupData } from "@/lib/api/types";

export function StudentGroupCardFooter({
	group,
	isEditing,
	saving,
	onUpdate,
	onCancelEdit,
	onStudents,
	onStartScheduleEdit,
	onStartEdit,
	onDelete,
}: {
	group: StudentGroupData;
	isEditing: boolean;
	saving: boolean;
	onUpdate: (id: number) => void;
	onCancelEdit: () => void;
	onStudents: (id: number) => void;
	onStartScheduleEdit: (group: StudentGroupData) => void;
	onStartEdit: (group: StudentGroupData) => void;
	onDelete: (id: number) => void;
}) {
	return (
		<div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between">
			{isEditing ? (
				<div className="flex items-center gap-2 w-full justify-end">
					<button
						type="button"
						onClick={() => onUpdate(group.id)}
						disabled={saving}
						aria-busy={saving ? true : undefined}
						className="flex items-center gap-1.5 rounded-xl bg-[image:var(--gradient-accent)] px-3 py-1.5 text-xs font-bold text-white hover:brightness-110 disabled:pointer-events-none disabled:opacity-70"
					>
						{saving ? <Loader2 className="size-3.5 animate-spin" /> : <Save className="size-3.5" />}{" "}
						Պահպանել
					</button>
					<button
						type="button"
						onClick={onCancelEdit}
						disabled={saving}
						aria-label="Չեղարկել"
						className="rounded-xl border p-1.5 text-slate-400 hover:bg-slate-100 disabled:opacity-50 dark:hover:bg-slate-800"
					>
						<X className="size-3.5" />
					</button>
				</div>
			) : (
				<>
					<button
						type="button"
						onClick={() => onStudents(group.id)}
						className="flex items-center gap-1.5 rounded-xl bg-accent/10 px-3 py-1.5 text-xs font-bold text-accent transition-colors hover:bg-accent/15 dark:bg-accent/20 dark:hover:bg-accent/30"
					>
						<Users className="size-3.5" /> Ուսանողներ
					</button>
					<div className="flex items-center gap-1.5">
						<button
							type="button"
							onClick={() => onStartScheduleEdit(group)}
							disabled={saving}
							title="Ժամանակացույց"
							aria-label="Խմբագրել ժամանակացույցը"
							className="grid size-7 place-items-center rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 disabled:opacity-50 dark:bg-slate-800 dark:text-slate-300 transition-colors"
						>
							<Clock className="size-3.5" />
						</button>
						<button
							type="button"
							onClick={() => onStartEdit(group)}
							disabled={saving}
							title="Խմբագրել"
							aria-label="Խմբագրել խմբի անվանումը"
							className="grid size-7 place-items-center rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 disabled:opacity-50 dark:bg-slate-800 dark:text-slate-300 transition-colors"
						>
							<Edit2 className="size-3.5" />
						</button>
						<button
							type="button"
							onClick={() => onDelete(group.id)}
							disabled={saving}
							title="Ջնջել"
							aria-label="Ջնջել խումբը"
							className="grid size-7 place-items-center rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 disabled:opacity-50 dark:bg-rose-950/40 dark:text-rose-400 transition-colors"
						>
							<Trash2 className="size-3.5" />
						</button>
					</div>
				</>
			)}
		</div>
	);
}
