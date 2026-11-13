import { Pagination } from "@/components/ui/pagination";
import { SearchInput } from "@/components/ui/search-input";
import { SortableGrid } from "@/components/ui/sortable-grid";
import { StudentCard } from "./StudentCard";
import type { StudentsListState } from "./useStudentsList";
import type { StudentsReorderState } from "./useStudentsReorder";

export function StudentsListView({
	list,
	reorder,
}: {
	list: StudentsListState;
	reorder: StudentsReorderState;
}) {
	return (
		<div className="space-y-6">
			<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
				<SearchInput
					value={list.search}
					onChange={list.handleSearchChange}
					placeholder="Որոնել ըստ անվան, էլ․ փոստի կամ հեռախոսի..."
					inputClassName="w-full rounded-2xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-xs shadow-xs outline-none focus:border-accent dark:border-slate-800 dark:bg-slate-900"
				/>
				<div className="flex flex-col items-start sm:items-end gap-1">
					<span className="text-xs font-bold text-slate-400">
						{list.filtered.length} Գրանցված Ուսանող
					</span>
					{!list.canReorder && (
						<p className="text-[11px] font-semibold text-slate-400">
							* Քաշել-թողնելի հերթականությունը հասանելի է որոնումն անջատելիս
						</p>
					)}
				</div>
			</div>
			<SortableGrid
				items={reorder.displayItems}
				enabled={list.canReorder}
				onDragEnd={reorder.handleDragEnd}
				renderItem={({ item, enabled, isOverlay, dragHandle }) => (
					<StudentCard
						user={item}
						enabled={enabled}
						isOverlay={isOverlay}
						dragHandle={dragHandle}
						onToggleAnalytics={list.handleToggleAnalytics}
						onTogglePaid={list.handleTogglePaid}
						onChangeRole={list.handleChangeRole}
						onDelete={list.handleDelete}
					/>
				)}
			/>
			<Pagination
				currentPage={list.currentPage}
				totalPages={list.totalPages}
				onPageChange={list.setCurrentPage}
				itemsPerPage={list.itemsPerPage}
				onItemsPerPageChange={(size) => {
					list.setItemsPerPage(size);
					list.setCurrentPage(1);
				}}
			/>
		</div>
	);
}
