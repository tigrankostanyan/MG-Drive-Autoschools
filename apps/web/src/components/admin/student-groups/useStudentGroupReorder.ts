import type { Dispatch, SetStateAction } from "react";
import { useListReorder } from "@/hooks/use-list-reorder";
import { reorderStudentGroups } from "@/lib/api/student-groups";
import type { StudentGroupData } from "@/lib/api/types";

export function useStudentGroupReorder({
	filteredGroups,
	canReorder,
	onChange,
}: {
	filteredGroups: StudentGroupData[];
	canReorder: boolean;
	onChange: Dispatch<SetStateAction<StudentGroupData[]>>;
}) {
	const { localItems, handleDragEnd } = useListReorder<StudentGroupData>({
		items: canReorder ? filteredGroups : [],
		enabled: canReorder,
		reorder: reorderStudentGroups,
		onChange,
	});
	const displayItems = canReorder ? localItems : filteredGroups;
	return { handleDragEnd, displayItems };
}

export type StudentGroupReorderState = ReturnType<typeof useStudentGroupReorder>;
