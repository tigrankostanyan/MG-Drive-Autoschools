import { type Dispatch, type SetStateAction, useMemo, useState } from "react";
import { toast } from "sonner";
import { useConfirm } from "@/components/ui/confirm-dialog";
import { createTest, deleteTest, updateTest } from "@/lib/api/tests";
import type { TestData } from "@/lib/api/types";
import { serverErrorText } from "@/lib/api-errors";

const PAGE_SIZE_COMPACT = 12;
const PAGE_SIZE_COMFORTABLE = 24;
const PAGE_SIZE_ROOMY = 48;
const PAGE_SIZE_EXTRA_LARGE = 96;

/** Page-size choices offered in the tests list; the first one is the default. */
export const TESTS_ITEMS_PER_PAGE_OPTIONS = [
	PAGE_SIZE_COMPACT,
	PAGE_SIZE_COMFORTABLE,
	PAGE_SIZE_ROOMY,
	PAGE_SIZE_EXTRA_LARGE,
];

export function useTestsList({
	tests,
	onChange,
}: {
	tests: TestData[];
	onChange: Dispatch<SetStateAction<TestData[]>>;
}) {
	const [search, setSearch] = useState("");
	const [adding, setAdding] = useState(false);
	const [editingId, setEditingId] = useState<number | null>(null);
	const [formTitle, setFormTitle] = useState("");
	const [currentPage, setCurrentPage] = useState(1);
	const [itemsPerPage, setItemsPerPage] = useState(PAGE_SIZE_COMPACT);
	const filteredTests = useMemo(() => {
		return tests.filter((t) => t.title.toLowerCase().includes(search.toLowerCase()));
	}, [tests, search]);
	const paginatedTests = useMemo(() => {
		const startIndex = (currentPage - 1) * itemsPerPage;
		return filteredTests.slice(startIndex, startIndex + itemsPerPage);
	}, [filteredTests, currentPage, itemsPerPage]);
	const totalPages = Math.ceil(filteredTests.length / itemsPerPage);
	// Reset page when search changes via the input handler
	const handleSearchChange = (value: string) => {
		setSearch(value);
		setCurrentPage(1);
	};
	const handleCreate = async () => {
		if (!formTitle.trim()) {
			toast.error("Մուտքագրեք թեստի անվանումը");
			return;
		}
		try {
			const res = await createTest({ title: formTitle });
			toast.success("Թեստը հաջողությամբ ստեղծվեց");
			setFormTitle("");
			setAdding(false);
			onChange((prev) => [res.data, ...prev]);
		} catch (err) {
			toast.error(serverErrorText(err, "Ստեղծման սխալ"));
		}
	};
	const handleUpdate = async (id: number) => {
		try {
			const res = await updateTest(id, { title: formTitle });
			toast.success("Թեստը թարմացվեց");
			setEditingId(null);
			onChange((prev) => prev.map((t) => (t.id === id ? res.data : t)));
		} catch (err) {
			toast.error(serverErrorText(err, "Թարմացման սխալ"));
		}
	};
	const { confirm } = useConfirm();

	const handleDelete = async (id: number) => {
		const isConfirmed = await confirm({
			title: "Ջնջե՞լ այս թեստը",
			description: "Համոզվա՞ծ եք, որ ցանկանում եք ջնջել այս թեստը:",
			type: "danger",
		});
		if (!isConfirmed) return;
		try {
			await deleteTest(id);
			toast.success("Թեստը ջնջվեց");
			onChange((prev) => prev.filter((t) => t.id !== id));
		} catch (err) {
			toast.error(serverErrorText(err, "Ջնջման սխալ"));
		}
	};

	return {
		search,
		adding,
		setAdding,
		editingId,
		setEditingId,
		formTitle,
		setFormTitle,
		currentPage,
		setCurrentPage,
		itemsPerPage,
		setItemsPerPage,
		filteredTests,
		paginatedTests,
		totalPages,
		handleSearchChange,
		handleCreate,
		handleUpdate,
		handleDelete,
	};
}

export type TestsListState = ReturnType<typeof useTestsList>;
