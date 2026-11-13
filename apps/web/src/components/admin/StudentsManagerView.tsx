import type { Dispatch, SetStateAction } from "react";
import type { UserItem } from "@/lib/api/types";
import { StudentsListView } from "./students/StudentsListView";
import { useStudentsList } from "./students/useStudentsList";
import { useStudentsReorder } from "./students/useStudentsReorder";

export function StudentsManagerView({
	students,
	onChange,
}: {
	students: UserItem[];
	onChange: Dispatch<SetStateAction<UserItem[]>>;
}) {
	const list = useStudentsList({ students, onChange });
	const reorder = useStudentsReorder({
		students,
		paginatedStudents: list.paginatedStudents,
		currentPage: list.currentPage,
		itemsPerPage: list.itemsPerPage,
		canReorder: list.canReorder,
		onChange,
	});
	return <StudentsListView list={list} reorder={reorder} />;
}
