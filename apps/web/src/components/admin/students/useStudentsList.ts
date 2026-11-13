import { type Dispatch, type SetStateAction, useMemo, useState } from "react";
import { toast } from "sonner";
import { useConfirm } from "@/components/ui/confirm-dialog";
import type { UserItem } from "@/lib/api/types";
import { deleteUser, updateUser } from "@/lib/api/users";
import { serverErrorText } from "@/lib/api-errors";

export function useStudentsList({
	students,
	onChange,
}: {
	students: UserItem[];
	onChange: Dispatch<SetStateAction<UserItem[]>>;
}) {
	const [search, setSearch] = useState("");
	const [currentPage, setCurrentPage] = useState(1);
	const [itemsPerPage, setItemsPerPage] = useState(10);
	const canReorder = search.trim() === "";
	const handleSearchChange = (value: string) => {
		setSearch(value);
		setCurrentPage(1);
	};
	const filtered = useMemo(() => {
		return students.filter(
			(s) =>
				s.name.toLowerCase().includes(search.toLowerCase()) ||
				s.email.toLowerCase().includes(search.toLowerCase()) ||
				s.phone?.includes(search),
		);
	}, [students, search]);
	const paginatedStudents = useMemo(() => {
		const startIndex = (currentPage - 1) * itemsPerPage;
		return filtered.slice(startIndex, startIndex + itemsPerPage);
	}, [filtered, currentPage, itemsPerPage]);
	const totalPages = Math.ceil(filtered.length / itemsPerPage);
	const handleToggleAnalytics = async (user: UserItem) => {
		try {
			const res = await updateUser(user.id, {
				include_in_analytics: !user.include_in_analytics,
			});
			toast.success("Կարգավիճակը փոփոխվեց");
			onChange((prev) => prev.map((u) => (u.id === user.id ? res.data : u)));
		} catch (err) {
			toast.error(serverErrorText(err, "Փոփոխման սխալ"));
		}
	};
	const handleTogglePaid = async (user: UserItem) => {
		try {
			const res = await updateUser(user.id, {
				has_paid: !user.has_paid,
			});
			toast.success("Վճարման կարգավիճակը փոփոխվեց");
			onChange((prev) => prev.map((u) => (u.id === user.id ? res.data : u)));
		} catch (err) {
			toast.error(serverErrorText(err, "Փոփոխման սխալ"));
		}
	};
	const handleChangeRole = async (user: UserItem, newRole: string) => {
		try {
			const res = await updateUser(user.id, {
				role: newRole,
			});
			toast.success("Դերը փոփոխվեց");
			onChange((prev) => prev.map((u) => (u.id === user.id ? res.data : u)));
		} catch (err) {
			toast.error(serverErrorText(err, "Դերի փոփոխման սխալ"));
		}
	};
	const { confirm } = useConfirm();
	const handleDelete = async (id: number) => {
		const isConfirmed = await confirm({
			title: "Հեռացնե՞լ ուսանողին",
			description: "Համոզվա՞ծ եք, որ ցանկանում եք հեռացնել այս ուսանողին:",
			type: "danger",
		});
		if (!isConfirmed) return;
		try {
			await deleteUser(id);
			toast.success("Ուսանողը հեռացվեց");
			onChange((prev) => prev.filter((u) => u.id !== id));
		} catch (err) {
			toast.error(serverErrorText(err, "Հեռացման սխալ"));
		}
	};

	return {
		search,
		handleSearchChange,
		currentPage,
		setCurrentPage,
		itemsPerPage,
		setItemsPerPage,
		filtered,
		paginatedStudents,
		totalPages,
		canReorder,
		handleToggleAnalytics,
		handleTogglePaid,
		handleChangeRole,
		handleDelete,
	};
}

export type StudentsListState = ReturnType<typeof useStudentsList>;
