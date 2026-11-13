import type { Dispatch, SetStateAction } from "react";
import { useFaqManager } from "@/hooks/use-faq-manager";
import type { FaqItemData } from "@/lib/api/types";
import { FaqCategoriesModal } from "./faq/FaqCategoriesModal";
import { FaqFilters } from "./faq/FaqFilters";
import { FaqFormCard } from "./faq/FaqFormCard";
import { FaqList } from "./faq/FaqList";

export function FaqManagerView({
	faqs,
	categories,
	onChange,
	onCategoriesChange,
}: {
	faqs: FaqItemData[];
	categories: string[];
	onChange: Dispatch<SetStateAction<FaqItemData[]>>;
	onCategoriesChange: Dispatch<SetStateAction<string[]>>;
}) {
	const {
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
	} = useFaqManager({ faqs, onChange });

	return (
		<div className="space-y-6">
			{/* Header and Filters */}
			<FaqFilters
				search={search}
				onSearchChange={setSearch}
				categories={categories}
				categoryFilter={categoryFilter}
				onCategoryChange={setCategoryFilter}
				onAdd={openAddForm}
				onManageCategories={() => setShowCategoriesModal(true)}
			/>
			{/* Adding/Editing Form */}
			{(adding || editingId !== null) && (
				<FaqFormCard
					adding={adding}
					categories={categories}
					form={form}
					saving={saving}
					onFormChange={setForm}
					onCancel={closeForm}
					onSubmit={adding || editingId === null ? handleCreate : () => handleUpdate(editingId)}
				/>
			)}
			{/* Categories Modal */}
			{showCategoriesModal && (
				<FaqCategoriesModal
					categories={categories}
					onClose={() => setShowCategoriesModal(false)}
					onSaved={(nextCategories) => {
						onCategoriesChange(nextCategories);
						setShowCategoriesModal(false);
					}}
				/>
			)}
			{/* FAQ List */}
			<FaqList
				faqs={filteredFaqs}
				editingId={editingId}
				saving={saving}
				onEdit={startEdit}
				onDelete={handleDelete}
			/>
		</div>
	);
}
