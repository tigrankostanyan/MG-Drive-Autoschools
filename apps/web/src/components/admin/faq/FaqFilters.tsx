import { Plus, Search } from "lucide-react";

export function FaqFilters({
	search,
	onSearchChange,
	categories,
	categoryFilter,
	onCategoryChange,
	onAdd,
	onManageCategories,
}: {
	search: string;
	onSearchChange: (value: string) => void;
	categories: string[];
	categoryFilter: string;
	onCategoryChange: (category: string) => void;
	onAdd: () => void;
	onManageCategories: () => void;
}) {
	return (
		<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
			<div className="relative w-full max-w-sm">
				<Search className="absolute left-3.5 top-3 size-4 text-slate-400" />
				<input
					type="text"
					placeholder="Փնտրել հարցը կամ պատասխանը..."
					value={search}
					onChange={(e) => onSearchChange(e.target.value)}
					className="w-full rounded-2xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-xs shadow-sm outline-none focus:border-accent dark:border-slate-800 dark:bg-slate-900"
				/>
			</div>
			<div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 hide-scrollbar">
				{["Բոլորը", ...categories].map((cat) => (
					<button
						type="button"
						key={cat}
						onClick={() => onCategoryChange(cat)}
						className={`whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
							categoryFilter === cat
								? "bg-[image:var(--gradient-accent)] text-white"
								: "bg-white border border-slate-200 text-slate-500 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400"
						}`}
					>
						{cat}
					</button>
				))}
				<button
					type="button"
					onClick={onAdd}
					className="flex items-center gap-1.5 whitespace-nowrap rounded-lg bg-[image:var(--gradient-accent)] px-3 py-1.5 text-xs font-bold text-white shadow-md shadow-accent/25 hover:brightness-110 ml-2"
				>
					<Plus className="size-3.5" />
					Նոր Հարց
				</button>
				<button
					type="button"
					onClick={onManageCategories}
					className="flex items-center gap-1.5 whitespace-nowrap rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-600 shadow-sm hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
				>
					Կարգավորել բաժինները
				</button>
			</div>
		</div>
	);
}
