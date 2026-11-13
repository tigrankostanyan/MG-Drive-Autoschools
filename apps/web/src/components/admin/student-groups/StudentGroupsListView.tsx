import { AddGroupForm } from "@/components/admin/AddGroupForm";
import { GroupSearchHeader } from "@/components/admin/GroupSearchHeader";
import { GroupTable } from "@/components/admin/GroupTable";
import type { GroupStudentAssignmentState } from "./useGroupStudentAssignment";
import type { StudentGroupReorderState } from "./useStudentGroupReorder";
import type { StudentGroupsListState } from "./useStudentGroupsList";

export function StudentGroupsListView({
	list,
	reorder,
	assignment,
}: {
	list: StudentGroupsListState;
	reorder: StudentGroupReorderState;
	assignment: GroupStudentAssignmentState;
}) {
	return (
		<>
			<GroupSearchHeader
				search={list.search}
				onSearchChange={list.setSearch}
				onAdd={() => list.setAdding(true)}
			/>
			{list.adding && (
				<AddGroupForm
					form={list.form}
					saving={list.saving}
					error={list.titleError}
					onFormChange={list.handleFormChange}
					onGenerateName={list.generateUniqueGroupName}
					onCancel={() => list.setAdding(false)}
					onSave={list.handleCreate}
				/>
			)}
			<GroupTable
				items={reorder.displayItems}
				enabled={list.canReorder}
				onDragEnd={reorder.handleDragEnd}
				selectedIds={list.selectedIds}
				editingMode={list.editingMode}
				form={list.form}
				saving={list.saving}
				titleError={list.titleError}
				onSelectAll={(checked) => {
					if (checked) list.setSelectedIds(list.filteredGroups.map((g) => g.id));
					else list.setSelectedIds([]);
				}}
				onSelectOne={(id, checked) => {
					if (checked) list.setSelectedIds((prev) => [...prev, id]);
					else list.setSelectedIds((prev) => prev.filter((x) => x !== id));
				}}
				onStartEdit={list.handleStartEdit}
				onStartScheduleEdit={list.handleStartScheduleEdit}
				onCancelEdit={list.handleCancelEdit}
				onFormChange={list.handleFormChange}
				onUpdate={list.handleUpdate}
				onDelete={list.handleDelete}
				onStudents={assignment.loadGroupStudents}
			/>
		</>
	);
}
