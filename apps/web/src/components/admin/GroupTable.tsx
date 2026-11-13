import type { DragEndEvent } from "@dnd-kit/core";
import { SortableGrid } from "@/components/ui/sortable-grid";
import type { StudentGroupData } from "@/lib/api/types";
import { StudentGroupCard } from "./student-groups/StudentGroupCard";

interface GroupTableProps {
	items: StudentGroupData[];
	enabled: boolean;
	onDragEnd: (event: DragEndEvent) => void;
	selectedIds: number[];
	editingMode: { id: number; type: "title" | "schedule" } | null;
	form: { title: string; activeFrom: string; activeUntil: string };
	saving: boolean;
	titleError?: string | undefined;
	onSelectAll: (checked: boolean) => void;
	onSelectOne: (id: number, checked: boolean) => void;
	onStartEdit: (group: StudentGroupData) => void;
	onStartScheduleEdit: (group: StudentGroupData) => void;
	onCancelEdit: () => void;
	onFormChange: (field: "title" | "activeFrom" | "activeUntil", value: string) => void;
	onUpdate: (id: number) => void;
	onDelete: (id: number) => void;
	onStudents: (id: number) => void;
}
export function GroupTable({
	items,
	enabled,
	onDragEnd,
	selectedIds,
	editingMode,
	form,
	saving,
	titleError,
	onSelectAll,
	onSelectOne,
	onStartEdit,
	onStartScheduleEdit,
	onCancelEdit,
	onFormChange,
	onUpdate,
	onDelete,
	onStudents,
}: GroupTableProps) {
	return (
		<div className="space-y-4">
			{!enabled && (
				<p className="pl-2 text-[11px] font-semibold text-slate-400">
					* Քաշել-թողնելի հերթականությունը հասանելի է որոնումն անջատելիս
				</p>
			)}
			{items.length > 0 && (
				<div className="flex items-center gap-2 pl-2">
					<input
						type="checkbox"
						checked={selectedIds.length === items.length && items.length > 0}
						onChange={(e) => onSelectAll(e.target.checked)}
						className="rounded text-accent focus:ring-0"
						id="selectAll"
					/>
					<label htmlFor="selectAll" className="text-xs font-bold text-slate-500 cursor-pointer">
						Ընտրել բոլորը
					</label>
				</div>
			)}
			<SortableGrid
				items={items}
				enabled={enabled}
				onDragEnd={onDragEnd}
				renderItem={({ item, enabled: itemEnabled, isOverlay, dragHandle }) => (
					<StudentGroupCard
						group={item}
						enabled={itemEnabled}
						isOverlay={isOverlay}
						dragHandle={dragHandle}
						selectedIds={selectedIds}
						editingMode={editingMode}
						form={form}
						saving={saving}
						titleError={titleError}
						onSelectOne={onSelectOne}
						onStartEdit={onStartEdit}
						onStartScheduleEdit={onStartScheduleEdit}
						onCancelEdit={onCancelEdit}
						onFormChange={onFormChange}
						onUpdate={onUpdate}
						onDelete={onDelete}
						onStudents={onStudents}
					/>
				)}
			/>
		</div>
	);
}
