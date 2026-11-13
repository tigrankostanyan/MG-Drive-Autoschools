import { type Dispatch, type SetStateAction, useMemo, useState } from "react";
import { toast } from "sonner";
import { useConfirm } from "@/components/ui/confirm-dialog";
import {
	createStudentGroup,
	deleteStudentGroup,
	updateStudentGroup,
} from "@/lib/api/student-groups";
import type { StudentGroupData } from "@/lib/api/types";
import { serverErrorText } from "@/lib/api-errors";
import { fromDateTimeLocalValue, toDateTimeLocalValue } from "@/lib/group-schedule";
import { makeGroupName } from "./makeGroupName";

export function useStudentGroupsList({
	studentGroups,
	onChange,
}: {
	studentGroups: StudentGroupData[];
	onChange: Dispatch<SetStateAction<StudentGroupData[]>>;
}) {
	const [search, setSearch] = useState("");
	const [adding, setAdding] = useState(false);
	const [editingMode, setEditingMode] = useState<{
		id: number;
		type: "title" | "schedule";
	} | null>(null);
	const [form, setForm] = useState({
		title: "",
		activeFrom: "",
		activeUntil: "",
	});
	const [selectedIds, setSelectedIds] = useState<number[]>([]);
	const [saving, setSaving] = useState(false);
	const [titleError, setTitleError] = useState<string | undefined>(undefined);
	const filteredGroups = useMemo(() => {
		return studentGroups.filter((g) => g.title.toLowerCase().includes(search.toLowerCase()));
	}, [studentGroups, search]);
	const canReorder = search.trim() === "";
	const generateUniqueGroupName = () => setForm((f) => ({ ...f, title: makeGroupName() }));
	const handleFormChange = (field: "title" | "activeFrom" | "activeUntil", value: string) => {
		setForm((f) => ({ ...f, [field]: value }));
		if (field === "title") setTitleError(undefined);
	};
	const handleCreate = async () => {
		if (saving) return;
		if (!form.title.trim()) {
			setTitleError("Մուտքագրեք խմբի անվանումը");
			return;
		}
		setSaving(true);
		try {
			const res = await createStudentGroup({ title: form.title });
			toast.success("Խումբը հաջողությամբ ստեղծվեց");
			setForm({ title: "", activeFrom: "", activeUntil: "" });
			setTitleError(undefined);
			setAdding(false);
			onChange((prev) => [res.data, ...prev]);
		} catch (err) {
			toast.error(serverErrorText(err, "Ստեղծման սխալ"));
		} finally {
			setSaving(false);
		}
	};
	const handleUpdate = async (id: number) => {
		if (saving) return;
		if (!form.title.trim()) {
			setTitleError("Մուտքագրեք խմբի անվանումը");
			return;
		}
		setSaving(true);
		try {
			const res = await updateStudentGroup(id, {
				title: form.title,
				activeFrom: fromDateTimeLocalValue(form.activeFrom),
				activeUntil: fromDateTimeLocalValue(form.activeUntil),
			});
			toast.success("Խումբը թարմացվեց");
			setEditingMode(null);
			setTitleError(undefined);
			onChange((prev) => prev.map((g) => (g.id === id ? res.data : g)));
		} catch (err) {
			toast.error(serverErrorText(err, "Թարմացման սխալ"));
		} finally {
			setSaving(false);
		}
	};
	const { confirm } = useConfirm();

	const handleDelete = async (id: number) => {
		if (saving) return;
		const isConfirmed = await confirm({
			title: "Ջնջե՞լ այս խումբը",
			description: "Համոզվա՞ծ եք, որ ցանկանում եք ջնջել այս խումբը:",
			type: "danger",
		});
		if (!isConfirmed) return;
		setSaving(true);
		try {
			await deleteStudentGroup(id);
			toast.success("Խումբը ջնջվեց");
			onChange((prev) => prev.filter((g) => g.id !== id));
		} catch (err) {
			toast.error(serverErrorText(err, "Ջնջման սխալ"));
		} finally {
			setSaving(false);
		}
	};
	const startEdit = (group: StudentGroupData, type: "title" | "schedule") => {
		setEditingMode({ id: group.id, type });
		setTitleError(undefined);
		setForm({
			title: group.title,
			activeFrom: toDateTimeLocalValue(group.activeFrom),
			activeUntil: toDateTimeLocalValue(group.activeUntil),
		});
	};

	return {
		search,
		setSearch,
		adding,
		setAdding,
		editingMode,
		form,
		selectedIds,
		setSelectedIds,
		saving,
		titleError,
		filteredGroups,
		canReorder,
		generateUniqueGroupName,
		handleFormChange,
		handleCreate,
		handleUpdate,
		handleDelete,
		handleStartEdit: (group: StudentGroupData) => startEdit(group, "title"),
		handleStartScheduleEdit: (group: StudentGroupData) => startEdit(group, "schedule"),
		handleCancelEdit: () => setEditingMode(null),
	};
}

export type StudentGroupsListState = ReturnType<typeof useStudentGroupsList>;
