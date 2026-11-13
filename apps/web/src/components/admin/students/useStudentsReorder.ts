import type { Dispatch, SetStateAction } from "react";
import { toast } from "sonner";
import { useSortableGrid } from "@/hooks/use-sortable-grid";
import type { UserItem } from "@/lib/api/types";
import { reorderUsers } from "@/lib/api/users";

export function useStudentsReorder({
	students,
	paginatedStudents,
	currentPage,
	itemsPerPage,
	canReorder,
	onChange,
}: {
	students: UserItem[];
	paginatedStudents: UserItem[];
	currentPage: number;
	itemsPerPage: number;
	canReorder: boolean;
	onChange: Dispatch<SetStateAction<UserItem[]>>;
}) {
	const { localItems, handleDragEnd } = useSortableGrid<UserItem>({
		items: canReorder ? paginatedStudents : [],
		enabled: canReorder,
		onReorder: async (orderedIds) => {
			const startIndex = (currentPage - 1) * itemsPerPage;
			const pageStudentsMap = new Map(paginatedStudents.map((s) => [s.id, s]));
			const reorderedPage = orderedIds
				.map((id) => pageStudentsMap.get(id))
				.filter((s): s is UserItem => !!s);

			const newAllStudents = [...students];
			newAllStudents.splice(startIndex, reorderedPage.length, ...reorderedPage);

			const allIds = newAllStudents.map((s) => s.id);
			await reorderUsers(allIds);

			const sortById = new Map(allIds.map((id, index) => [id, index + 1]));
			onChange((prev) =>
				prev
					.map((item) => ({
						...item,
						sortControl: sortById.get(item.id) ?? item.sortControl ?? 0,
					}))
					.sort((a, b) => (a.sortControl ?? 0) - (b.sortControl ?? 0)),
			);
			toast.success("Հերթականությունը պահպանվեց");
		},
		onError: () => {
			toast.error("Հերթականության պահպանման սխալ");
		},
	});

	const displayItems = canReorder ? localItems : paginatedStudents;
	return { handleDragEnd, displayItems };
}

export type StudentsReorderState = ReturnType<typeof useStudentsReorder>;
