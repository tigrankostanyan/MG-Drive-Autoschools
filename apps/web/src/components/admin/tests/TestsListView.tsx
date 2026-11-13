import { Plus, SearchX } from "lucide-react";
import { InlineAddForm } from "@/components/ui/inline-add-form";
import { Pagination } from "@/components/ui/pagination";
import { SearchInput } from "@/components/ui/search-input";
import { TestCard } from "./TestCard";
import { TESTS_ITEMS_PER_PAGE_OPTIONS, type TestsListState } from "./useTestsList";

export function TestsListView({
	list,
	loadTestQuestions,
}: {
	list: TestsListState;
	loadTestQuestions: (tid: number, toggle?: boolean) => void;
}) {
	return (
		<>
			<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
				<SearchInput
					value={list.search}
					onChange={list.handleSearchChange}
					placeholder="Որոնել թեստեր..."
				/>
				<button
					type="button"
					onClick={() => list.setAdding(true)}
					className="flex items-center gap-2 rounded-2xl bg-[image:var(--gradient-accent)] px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-accent/25 hover:brightness-110"
				>
					<Plus className="size-4" /> Ավելացնել Քննական Թեստ
				</button>
			</div>
			{list.adding && (
				<InlineAddForm
					title="Նոր Թեստի Ավելացում"
					placeholder="օրինակ՝ Թեստ 1 (20 հարց)"
					value={list.formTitle}
					onValueChange={list.setFormTitle}
					onCancel={() => list.setAdding(false)}
					onSave={list.handleCreate}
				/>
			)}
			{list.filteredTests.length === 0 ? (
				<div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-white/50 py-16 text-center dark:border-slate-800 dark:bg-slate-900/30">
					<div className="grid size-14 place-items-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500 mb-3">
						<SearchX className="size-7" />
					</div>
					<h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
						Ոչ մի արդյունք չի գտնվել
					</h3>
					<p className="mt-1 text-xs font-semibold text-slate-400 max-w-sm">
						{list.search ? (
							<>
								«<span className="text-slate-600 dark:text-slate-300 font-bold">{list.search}</span>
								» հարցմամբ ոչ մի թեստ չգտնվեց: Փորձեք փնտրել այլ բառով:
							</>
						) : (
							"Թեստերի ցանկը դատարկ է"
						)}
					</p>
				</div>
			) : (
				<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
					{list.paginatedTests.map((tst) => (
						<TestCard
							key={tst.id}
							tst={tst}
							editingId={list.editingId}
							formTitle={list.formTitle}
							setEditingId={list.setEditingId}
							setFormTitle={list.setFormTitle}
							handleUpdate={list.handleUpdate}
							handleDelete={list.handleDelete}
							loadTestQuestions={loadTestQuestions}
						/>
					))}
				</div>
			)}
			<Pagination
				currentPage={list.currentPage}
				totalPages={list.totalPages}
				onPageChange={list.setCurrentPage}
				itemsPerPage={list.itemsPerPage}
				onItemsPerPageChange={(size) => {
					list.setItemsPerPage(size);
					list.setCurrentPage(1);
				}}
				itemsPerPageOptions={TESTS_ITEMS_PER_PAGE_OPTIONS}
			/>
		</>
	);
}
