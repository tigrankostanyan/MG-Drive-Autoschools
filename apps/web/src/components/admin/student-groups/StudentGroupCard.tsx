import { GripVertical } from "lucide-react";
import type { SortableDragHandle } from "@/components/ui/sortable-grid";
import type { StudentGroupData } from "@/lib/api/types";
import { getGroupScheduleInfo } from "@/lib/group-schedule";
import { GroupCardBadges } from "./GroupCardBadges";
import { GroupCardEditor } from "./GroupCardEditor";
import { StudentGroupCardFooter } from "./StudentGroupCardFooter";

export function StudentGroupCard({
	group,
	enabled,
	isOverlay,
	dragHandle,
	selectedIds,
	editingMode,
	form,
	saving,
	titleError,
	onSelectOne,
	onStartEdit,
	onStartScheduleEdit,
	onCancelEdit,
	onFormChange,
	onUpdate,
	onDelete,
	onStudents,
}: {
	group: StudentGroupData;
	enabled: boolean;
	isOverlay: boolean;
	dragHandle: SortableDragHandle | null;
	selectedIds: number[];
	editingMode: { id: number; type: "title" | "schedule" } | null;
	form: { title: string; activeFrom: string; activeUntil: string };
	saving: boolean;
	titleError?: string | undefined;
	onSelectOne: (id: number, checked: boolean) => void;
	onStartEdit: (group: StudentGroupData) => void;
	onStartScheduleEdit: (group: StudentGroupData) => void;
	onCancelEdit: () => void;
	onFormChange: (field: "title" | "activeFrom" | "activeUntil", value: string) => void;
	onUpdate: (id: number) => void;
	onDelete: (id: number) => void;
	onStudents: (id: number) => void;
}) {
	const isSelected = selectedIds.includes(group.id);
	const isEditingTitle = editingMode?.id === group.id && editingMode.type === "title";
	const isEditingSchedule = editingMode?.id === group.id && editingMode.type === "schedule";
	const isEditing = isEditingTitle || isEditingSchedule;
	const schedule = getGroupScheduleInfo(group);
	return (
		<div
			className={`relative flex flex-col justify-between rounded-3xl border p-5 shadow-sm transition-colors ${
				isOverlay ? "opacity-40" : ""
			} ${
				isSelected
					? "border-accent/40 bg-accent/5 dark:bg-primary/10"
					: "border-slate-200/80 bg-white hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900/60"
			}`}
		>
			{enabled && dragHandle && (
				<button
					type="button"
					{...dragHandle.attributes}
					{...dragHandle.listeners}
					title="Քաշել՝ հերթականությունը փոխելու համար"
					className="absolute left-3 top-5 grid size-7 cursor-grab place-items-center rounded-lg bg-slate-100 text-slate-500 transition-colors hover:bg-slate-200 hover:text-slate-700 active:cursor-grabbing dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700"
				>
					<GripVertical className="size-4" />
				</button>
			)}
			<div className="absolute top-5 right-5">
				<input
					type="checkbox"
					checked={isSelected}
					onChange={(e) => onSelectOne(group.id, e.target.checked)}
					className="rounded text-accent focus:ring-0"
				/>
			</div>
			<div className={`mb-4 ${enabled ? "pr-8 pl-8" : "pr-8"}`}>
				<GroupCardBadges group={group} schedule={schedule} />
				<GroupCardEditor
					isEditingTitle={isEditingTitle}
					isEditingSchedule={isEditingSchedule}
					form={form}
					titleError={titleError}
					onFormChange={onFormChange}
				/>
				{!isEditing && (
					<div className="mt-2">
						<h3 className="font-extrabold text-slate-900 dark:text-white text-lg leading-tight">
							{group.title}
						</h3>
						<p className="mt-1.5 text-xs font-semibold text-slate-400">
							{group.studentCount ?? 0} ուսանող
						</p>
						<p
							className={`mt-1 text-[11px] font-semibold ${
								schedule.state === "pending"
									? "text-amber-600 dark:text-amber-400"
									: schedule.state === "active"
										? "text-emerald-600 dark:text-emerald-400"
										: "text-slate-400 dark:text-slate-500"
							}`}
						>
							{schedule.detail}
						</p>
					</div>
				)}
			</div>
			<StudentGroupCardFooter
				group={group}
				isEditing={isEditing}
				saving={saving}
				onUpdate={onUpdate}
				onCancelEdit={onCancelEdit}
				onStudents={onStudents}
				onStartScheduleEdit={onStartScheduleEdit}
				onStartEdit={onStartEdit}
				onDelete={onDelete}
			/>
		</div>
	);
}
