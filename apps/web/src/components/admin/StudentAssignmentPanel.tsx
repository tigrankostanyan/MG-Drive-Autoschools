import { Loader2 } from "lucide-react";
import { getGroupScheduleInfo } from "@/lib/group-schedule";
import { AccessToggleCard } from "./student-assignment/AccessToggleCard";
import { AssignedStudentsGrid } from "./student-assignment/AssignedStudentsGrid";
import { AssignmentHeader } from "./student-assignment/AssignmentHeader";
import { AssignStudentsForm } from "./student-assignment/AssignStudentsForm";
import type { UserData } from "./types";

interface StudentAssignmentPanelProps {
	expandedGroupId: number;
	groupStudents: UserData[];
	allStudents: UserData[];
	groupTitles: Record<number, string>;
	selectedStudentIds: number[];
	grantStudentAccess: boolean;
	activeFrom: string | null;
	activeUntil: string | null;
	sLoading: boolean;
	isAssigning: boolean;
	saving: boolean;
	onBack: () => void;
	onToggleAssign: () => void;
	onToggleAccess: (value: boolean) => void;
	onStudentToggle: (studentId: number, checked: boolean) => void;
	onCancelAssign: () => void;
	onSaveStudents: () => void;
	onViewAnalytics?: ((groupId: number) => void) | undefined;
}
export function StudentAssignmentPanel({
	expandedGroupId,
	groupStudents,
	allStudents,
	groupTitles,
	selectedStudentIds,
	grantStudentAccess,
	activeFrom,
	activeUntil,
	sLoading,
	isAssigning,
	saving,
	onBack,
	onToggleAssign,
	onToggleAccess,
	onStudentToggle,
	onCancelAssign,
	onSaveStudents,
	onViewAnalytics,
}: StudentAssignmentPanelProps) {
	const schedule = getGroupScheduleInfo({ activeFrom, activeUntil });
	return (
		<div className="space-y-6">
			<AssignmentHeader
				expandedGroupId={expandedGroupId}
				studentCount={groupStudents.length}
				onBack={onBack}
				onToggleAssign={onToggleAssign}
				onViewAnalytics={onViewAnalytics ? () => onViewAnalytics(expandedGroupId) : undefined}
			/>
			<AccessToggleCard
				grantStudentAccess={grantStudentAccess}
				schedule={schedule}
				onToggleAccess={onToggleAccess}
			/>
			{sLoading ? (
				<div className="py-20 text-center">
					<Loader2 className="mx-auto size-8 animate-spin text-accent" />
				</div>
			) : (
				<div className="space-y-4">
					{isAssigning && (
						<AssignStudentsForm
							expandedGroupId={expandedGroupId}
							allStudents={allStudents}
							groupTitles={groupTitles}
							selectedStudentIds={selectedStudentIds}
							saving={saving}
							onStudentToggle={onStudentToggle}
							onCancelAssign={onCancelAssign}
							onSaveStudents={onSaveStudents}
						/>
					)}
					{!isAssigning && <AssignedStudentsGrid groupStudents={groupStudents} />}
				</div>
			)}
		</div>
	);
}
