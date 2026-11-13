import { Search, X } from "lucide-react";
import { useState } from "react";

export function TopbarSearch() {
	const [searchQuery, setSearchQuery] = useState("");

	return (
		<div className="relative hidden sm:block">
			<Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
			<input
				type="text"
				placeholder="Search..."
				value={searchQuery}
				onChange={(e) => setSearchQuery(e.target.value)}
				className="w-48 sm:w-60 md:w-72 rounded-full border border-slate-200/80 bg-white py-2 pl-9.5 pr-8 text-xs font-medium text-slate-800 shadow-sm outline-none transition-all placeholder:text-slate-400 focus:border-accent focus:ring-2 focus:ring-accent/15 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
			/>
			{searchQuery && (
				<button
					type="button"
					onClick={() => setSearchQuery("")}
					className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
				>
					<X className="size-3.5" />
				</button>
			)}
		</div>
	);
}
