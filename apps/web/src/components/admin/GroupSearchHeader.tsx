import { Plus } from "lucide-react";
import { SearchInput } from "@/components/ui/search-input";

interface GroupSearchHeaderProps {
	search: string;
	onSearchChange: (value: string) => void;
	onAdd: () => void;
}
export function GroupSearchHeader({ search, onSearchChange, onAdd }: GroupSearchHeaderProps) {
	return (
		<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
			<SearchInput
				value={search}
				onChange={onSearchChange}
				placeholder="Որոնել խմբեր ըստ վերնագրի..."
			/>
			<div className="flex items-center gap-2">
				<button
					type="button"
					onClick={onAdd}
					className="flex items-center gap-2 rounded-2xl bg-[image:var(--gradient-accent)] px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-accent/25 transition-all hover:brightness-110"
				>
					<Plus className="size-4" /> Ավելացնել Նոր Խումբ
				</button>
			</div>
		</div>
	);
}
