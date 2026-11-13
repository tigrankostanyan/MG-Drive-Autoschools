import { type Dispatch, type SetStateAction, useMemo, useState } from "react";
import { toast } from "sonner";
import { useConfirm } from "@/components/ui/confirm-dialog";
import { createFaq, deleteFaq, updateFaq } from "@/lib/api/faq";
import type { FaqItemData } from "@/lib/api/types";
import { serverErrorText } from "@/lib/api-errors";
export type FaqFormValues = {
	question: string;
	answer: string;
	category: string;
};
export function useFaqManager({
	faqs,
	onChange,
}: {
	faqs: FaqItemData[];
	onChange: Dispatch<SetStateAction<FaqItemData[]>>;
}) {
	const [search, setSearch] = useState("");
	const [categoryFilter, setCategoryFilter] = useState("Բոլորը");
	const [adding, setAdding] = useState(false);
	const [editingId, setEditingId] = useState<number | null>(null);
	const [saving, setSaving] = useState(false);
	const [form, setForm] = useState<FaqFormValues>({
		question: "",
		answer: "",
		category: "Ընդհանուր",
	});
	const [showCategoriesModal, setShowCategoriesModal] = useState(false);
	const filteredFaqs = useMemo(() => {
		return faqs.filter((faq) => {
			const matchSearch =
				faq.question.toLowerCase().includes(search.toLowerCase()) ||
				faq.answer.toLowerCase().includes(search.toLowerCase());
			const matchCategory =
				categoryFilter === "Բոլորը" || (faq.category || "Ընդհանուր") === categoryFilter;
			return matchSearch && matchCategory;
		});
	}, [faqs, search, categoryFilter]);
	const handleCreate = async () => {
		if (saving) return;
		if (!form.question.trim() || !form.answer.trim()) {
			toast.error("Մուտքագրեք հարցը և պատասխանը");
			return;
		}
		setSaving(true);
		try {
			const res = await createFaq({
				question: form.question,
				answer: form.answer,
				category: form.category,
			});
			toast.success("Հարցը հաջողությամբ ստեղծվեց");
			setForm({ question: "", answer: "", category: "Ընդհանուր" });
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
		if (!form.question.trim() || !form.answer.trim()) {
			toast.error("Մուտքագրեք հարցը և պատասխանը");
			return;
		}
		setSaving(true);
		try {
			const res = await updateFaq(id, {
				question: form.question,
				answer: form.answer,
				category: form.category,
			});
			toast.success("Հարցը թարմացվեց");
			setEditingId(null);
			onChange((prev) => prev.map((f) => (f.id === id ? res.data : f)));
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
			title: "Ջնջե՞լ այս հարցը",
			description: "Համոզվա՞ծ եք, որ ցանկանում եք ջնջել այս հարցը:",
			type: "danger",
		});
		if (!isConfirmed) return;
		setSaving(true);
		try {
			await deleteFaq(id);
			toast.success("Հարցը ջնջվեց");
			onChange((prev) => prev.filter((f) => f.id !== id));
		} catch (err) {
			toast.error(serverErrorText(err, "Ջնջման սխալ"));
		} finally {
			setSaving(false);
		}
	};
	const startEdit = (faq: FaqItemData) => {
		setEditingId(faq.id);
		setForm({
			question: faq.question,
			answer: faq.answer,
			category: faq.category || "Ընդհանուր",
		});
		setAdding(false);
	};
	const openAddForm = () => {
		setAdding(true);
		setEditingId(null);
		setForm({
			question: "",
			answer: "",
			category: categoryFilter !== "Բոլորը" ? categoryFilter : "Ընդհանուր",
		});
	};
	const closeForm = () => {
		setAdding(false);
		setEditingId(null);
	};
	return {
		search,
		setSearch,
		categoryFilter,
		setCategoryFilter,
		adding,
		editingId,
		saving,
		form,
		setForm,
		showCategoriesModal,
		setShowCategoriesModal,
		filteredFaqs,
		handleCreate,
		handleUpdate,
		handleDelete,
		startEdit,
		openAddForm,
		closeForm,
	};
}
