import { Search, X } from "lucide-react";
import type { GroupTabOption } from "@/features/groups/hooks/use-groups-search";
import { cn } from "@/lib/utils";

interface GroupsFiltersProps {
	tabs: GroupTabOption[];
	activeTab: string;
	searchQuery: string;
	onTabChange: (tabId: string) => void;
	onSearchChange: (query: string) => void;
}

export function GroupsFilters({
	tabs,
	activeTab,
	searchQuery,
	onTabChange,
	onSearchChange,
}: GroupsFiltersProps) {
	return (
		<div className="w-full flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white/70 dark:bg-slate-900/70 p-3 sm:p-4 rounded-2xl sm:rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs backdrop-blur-sm">
			<div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
				{tabs.map((tab) => (
					<button
						key={tab.id}
						type="button"
						onClick={() => {
							onTabChange(tab.id);
							onSearchChange("");
						}}
						className={cn(
							"px-4 py-2 rounded-full text-xs sm:text-[13px] font-bold tracking-wide transition-all whitespace-nowrap cursor-pointer",
							activeTab === tab.id && !searchQuery
								? "bg-primary text-white shadow-xs"
								: "bg-slate-100 hover:bg-slate-200/80 text-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700",
						)}
					>
						{tab.label}
					</button>
				))}
			</div>

			<div className="relative min-w-[200px] sm:w-72">
				<Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
				<input
					type="text"
					value={searchQuery}
					onChange={(e) => onSearchChange(e.target.value)}
					placeholder="Որոնել թեմա կամ № (օր.՝ 4, նշաններ)..."
					className="w-full pl-9.5 pr-8 py-2 text-xs sm:text-sm rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary transition-all"
				/>
				{searchQuery && (
					<button
						type="button"
						onClick={() => onSearchChange("")}
						className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
						title="Մաքրել որոնումը"
					>
						<X className="size-3.5" />
					</button>
				)}
			</div>
		</div>
	);
}
