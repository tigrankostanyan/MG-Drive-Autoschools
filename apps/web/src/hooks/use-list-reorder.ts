import type { Dispatch, SetStateAction } from "react";
import { toast } from "sonner";
import { type SortableItem, useSortableGrid } from "./use-sortable-grid";

type UseListReorderOptions<T extends SortableItem, S extends SortableItem = T> = {
	items: T[];
	enabled?: boolean;
	reorder: (orderedIds: number[]) => Promise<unknown>;
	onChange?: Dispatch<SetStateAction<S[]>>;
	successMessage?: string;
	errorMessage?: string;
	onError?: (error: unknown) => void;
};

/**
 * Drag-and-drop reordering for a persisted list: delegates the local move to
 * useSortableGrid, persists the new order, then mirrors it back into the
 * owner's state with renumbered sortControl values.
 */
export function useListReorder<T extends SortableItem, S extends SortableItem = T>({
	items,
	enabled = true,
	reorder,
	onChange,
	successMessage = "Հերթականությունը պահպանվեց",
	errorMessage = "Հերթականության պահպանման սխալ",
	onError,
}: UseListReorderOptions<T, S>) {
	return useSortableGrid<T>({
		items,
		enabled,
		onReorder: async (orderedIds) => {
			await reorder(orderedIds);
			if (onChange) {
				const sortById = new Map(orderedIds.map((id, index) => [id, index + 1]));
				onChange((prev) =>
					prev
						.map((item) => ({
							...item,
							sortControl: sortById.get(item.id) ?? item.sortControl ?? 0,
						}))
						.sort((a, b) => (a.sortControl ?? 0) - (b.sortControl ?? 0)),
				);
			}
			toast.success(successMessage);
		},
		onError: (error) => {
			toast.error(errorMessage);
			onError?.(error);
		},
	});
}
