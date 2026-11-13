import type { Dispatch, SetStateAction } from "react";
import type { StudentGroupData } from "@/lib/api/types";
import { StudentAssignmentPanel } from "./StudentAssignmentPanel";
import { StudentGroupsListView } from "./student-groups/StudentGroupsListView";
import { useGroupStudentAssignment } from "./student-groups/useGroupStudentAssignment";
import { useStudentGroupReorder } from "./student-groups/useStudentGroupReorder";
import { useStudentGroupsList } from "./student-groups/useStudentGroupsList";
import type { TabType } from "./types";

export function StudentGroupsManagerView({
	studentGroups,
	onChange,
	onSelectTab,
}: {
	studentGroups: StudentGroupData[];
	onChange: Dispatch<SetStateAction<StudentGroupData[]>>;
	onSelectTab?: ((tab: TabType) => void) | undefined;
}) {
	const list = useStudentGroupsList({ studentGroups, onChange });
	const reorder = useStudentGroupReorder({
		filteredGroups: list.filteredGroups,
		canReorder: list.canReorder,
		onChange,
	});
	const assignment = useGroupStudentAssignment({ studentGroups, onChange });
	return (
		<div className="space-y-6">
			{assignment.expandedGroupId ? (
				<StudentAssignmentPanel
					expandedGroupId={assignment.expandedGroupId}
					groupStudents={assignment.groupStudents}
					allStudents={assignment.allStudents}
					groupTitles={assignment.groupTitles}
					selectedStudentIds={assignment.selectedStudentIds}
					grantStudentAccess={assignment.currentGroup?.grantStudentAccess ?? false}
					activeFrom={assignment.currentGroup?.activeFrom ?? null}
					activeUntil={assignment.currentGroup?.activeUntil ?? null}
					sLoading={assignment.sLoading}
					isAssigning={assignment.isAssigning}
					saving={assignment.saving}
					onBack={() => assignment.setExpandedGroupId(null)}
					onToggleAssign={() => assignment.setIsAssigning(!assignment.isAssigning)}
					onToggleAccess={assignment.handleToggleAccess}
					onStudentToggle={assignment.handleStudentToggle}
					onCancelAssign={() => assignment.setIsAssigning(false)}
					onSaveStudents={assignment.handleSaveStudents}
					onViewAnalytics={
						onSelectTab ? (_groupId: number) => onSelectTab("student-analytics") : undefined
					}
				/>
			) : (
				<StudentGroupsListView list={list} reorder={reorder} assignment={assignment} />
			)}
		</div>
	);
}
