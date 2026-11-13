import { type Dispatch, type SetStateAction, useMemo, useState } from "react";
import { toast } from "sonner";
import { useConfirm } from "@/components/ui/confirm-dialog";
import { useListReorder } from "@/hooks/use-list-reorder";
import { createGroup, deleteGroup, reorderGroups, updateGroup } from "@/lib/api/groups";
import type { GroupData } from "@/lib/api/types";

export type SortField = "title" | "id";

export function useGroupList({
	groups,
	onChange,
	onReload,
	expandedGroupId,
}: {
	groups: GroupData[];
	onChange: Dispatch<SetStateAction<GroupData[]>>;
	onReload: () => void;
	expandedGroupId: number | null;
}) {
	const [search, setSearch] = useState("");
	const [adding, setAdding] = useState(false);
	const [editingId, setEditingId] = useState<number | null>(null);
	const [formTitle, setFormTitle] = useState("");
	const [formText, setFormText] = useState("");
	const [sortBy, setSortBy] = useState<SortField>("id");
	const { confirm } = useConfirm();

	const canReorder = search.trim() === "" && expandedGroupId === null;

	const { localItems, setLocalItems, handleDragEnd } = useListReorder<GroupData>({
		items: groups,
		enabled: canReorder,
		reorder: reorderGroups,
		onChange,
		onError: () => onReload(),
	});

	const handleSortChange = async (field: SortField) => {
		setSortBy(field);
		const sorted = [...localItems].sort((a, b) => {
			if (field === "title") {
				return a.title.localeCompare(b.title, "hy");
			}
			return a.id - b.id;
		});
		const renumbered = sorted.map((g, i) => ({ ...g, sortControl: i + 1 }));
		setLocalItems(renumbered);
		try {
			await reorderGroups(renumbered.map((g) => g.id));
			onChange(renumbered);
			toast.success("Խմբերը դասավորվեցին");
		} catch {
			toast.error("Դասավորման պահպանման սխալ");
			onReload();
		}
	};

	const filteredGroups = useMemo(() => {
		return localItems.filter((g) => g.title.toLowerCase().includes(search.toLowerCase()));
	}, [localItems, search]);

	const handleCreate = async () => {
		if (!formTitle.trim()) {
			toast.error("Մուտքագրեք խմբի անվանումը");
			return;
		}
		try {
			const res = await createGroup({ title: formTitle, text: formText });
			toast.success("Խումբը հաջողությամբ ստեղծվեց");
			setFormTitle("");
			setFormText("");
			setAdding(false);
			onChange((prev) => [res.data, ...prev]);
		} catch {
			toast.error("Ստեղծման սխալ");
		}
	};
	const handleUpdate = async (id: number) => {
		try {
			const res = await updateGroup(id, { title: formTitle, text: formText });
			toast.success("Խումբը թարմացվեց");
			setEditingId(null);
			setFormTitle("");
			setFormText("");
			onChange((prev) => prev.map((g) => (g.id === id ? res.data : g)));
		} catch {
			toast.error("Թարմացման սխալ");
		}
	};
	const handleDelete = async (id: number) => {
		const isConfirmed = await confirm({
			title: "Ջնջե՞լ այս խումբը",
			description:
				"Համոզվա՞ծ եք, որ ցանկանում եք ջնջել այս խումբը: Այս գործողությունը անդառնալի է:",
			type: "danger",
		});
		if (!isConfirmed) return;
		try {
			await deleteGroup(id);
			toast.success("Խումբը ջնջվեց");
			onChange((prev) => prev.filter((g) => g.id !== id));
		} catch {
			toast.error("Ջնջման սխալ");
		}
	};

	return {
		search,
		setSearch,
		adding,
		setAdding,
		editingId,
		setEditingId,
		formTitle,
		setFormTitle,
		formText,
		setFormText,
		sortBy,
		canReorder,
		filteredGroups,
		handleDragEnd,
		handleSortChange,
		handleCreate,
		handleUpdate,
		handleDelete,
	};
}

export type GroupListState = ReturnType<typeof useGroupList>;
