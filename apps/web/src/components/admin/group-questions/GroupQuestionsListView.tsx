import { Plus, SearchX } from "lucide-react";
import { InlineAddForm } from "@/components/ui/inline-add-form";
import { SearchInput } from "@/components/ui/search-input";
import { SortableGrid } from "@/components/ui/sortable-grid";
import { GroupCardContent } from "./GroupCardContent";
import { SortSelect } from "./SortSelect";
import type { GroupListState, SortField } from "./useGroupList";

const SORT_OPTIONS: { value: SortField; label: string }[] = [
	{ value: "title", label: "Դասավորել ըստ անվան" },
	{ value: "id", label: "Դասավորել ըստ ID-ի" },
] as const;

export function GroupQuestionsListView({
	list,
	loadGroupQuestions,
}: {
	list: GroupListState;
	loadGroupQuestions: (id: number, toggle?: boolean) => void;
}) {
	const {
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
	} = list;

	return (
		<>
			<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
				<SearchInput value={search} onChange={setSearch} placeholder="Որոնել խմբեր..." />
				{!canReorder && (
					<p className="text-xs font-semibold text-slate-400">
						* Քաշել-թողնելի հերթականությունը հասանելի է միայն որոնումն անջատելիս
					</p>
				)}
				<div className="flex items-center gap-3">
					<SortSelect options={SORT_OPTIONS} value={sortBy} onChange={handleSortChange} />
					<button
						type="button"
						onClick={() => setAdding(true)}
						className="flex items-center gap-2 rounded-2xl bg-[image:var(--gradient-accent)] px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-accent/25 hover:brightness-110"
					>
						<Plus className="size-4" /> Ավելացնել Թեմատիկ Խումբ
					</button>
				</div>
			</div>
			{adding && (
				<InlineAddForm
					title="Նոր Խմբի Ավելացում"
					placeholder="օրինակ՝ Ճանապարհային նշաններ"
					value={formTitle}
					onValueChange={setFormTitle}
					onCancel={() => setAdding(false)}
					onSave={handleCreate}
				/>
			)}
			{filteredGroups.length === 0 ? (
				<div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-white/50 py-16 text-center dark:border-slate-800 dark:bg-slate-900/30">
					<div className="grid size-14 place-items-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500 mb-3">
						<SearchX className="size-7" />
					</div>
					<h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
						Ոչ մի արդյունք չի գտնվել
					</h3>
					<p className="mt-1 text-xs font-semibold text-slate-400 max-w-sm">
						{search ? (
							<>
								«<span className="text-slate-600 dark:text-slate-300 font-bold">{search}</span>»
								հարցմամբ ոչ մի խումբ չգտնվեց: Փորձեք փնտրել այլ բառով:
							</>
						) : (
							"Խմբերի ցանկը դատարկ է"
						)}
					</p>
				</div>
			) : (
				<SortableGrid
					items={filteredGroups}
					enabled={canReorder}
					onDragEnd={handleDragEnd}
					renderItem={({ item, enabled, isOverlay, dragHandle }) => (
						<GroupCardContent
							grp={item}
							enabled={enabled}
							isOverlay={isOverlay}
							dragHandle={dragHandle}
							editingId={editingId}
							formTitle={formTitle}
							formText={formText}
							setEditingId={setEditingId}
							setFormTitle={setFormTitle}
							setFormText={setFormText}
							handleUpdate={handleUpdate}
							handleDelete={handleDelete}
							loadGroupQuestions={loadGroupQuestions}
						/>
					)}
				/>
			)}
		</>
	);
}
