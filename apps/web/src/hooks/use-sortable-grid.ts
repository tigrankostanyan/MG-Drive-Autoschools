import type { DragEndEvent } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { useCallback, useEffect, useState } from "react";

export type SortableItem = {
	id: number;
	sortControl?: number;
};

type UseSortableGridOptions<T extends SortableItem> = {
	items: T[];
	enabled?: boolean;
	onReorder?: (orderedIds: number[]) => Promise<void> | void;
	onLocalChange?: (items: T[]) => void;
	onError?: (err?: unknown) => void;
};

export function useSortableGrid<T extends SortableItem>({
	items,
	enabled = true,
	onReorder,
	onLocalChange,
	onError,
}: UseSortableGridOptions<T>) {
	const [localItems, setLocalItems] = useState<T[]>([]);

	useEffect(() => {
		setLocalItems([...items].sort((a, b) => (a.sortControl || 0) - (b.sortControl || 0)));
	}, [items]);

	const handleDragEnd = useCallback(
		async (event: DragEndEvent) => {
			const { active, over } = event;
			if (!enabled || !over || active.id === over.id) return;

			const oldIndex = localItems.findIndex((item) => item.id === active.id);
			const newIndex = localItems.findIndex((item) => item.id === over.id);
			if (oldIndex === -1 || newIndex === -1) return;

			const previous = localItems;
			const reordered = arrayMove(localItems, oldIndex, newIndex).map((item, index) => ({
				...item,
				sortControl: index + 1,
			}));

			setLocalItems(reordered);
			onLocalChange?.(reordered);

			try {
				await onReorder?.(reordered.map((item) => item.id));
			} catch (err) {
				setLocalItems(previous);
				onError?.(err);
			}
		},
		[enabled, localItems, onReorder, onLocalChange, onError],
	);

	return { localItems, setLocalItems, handleDragEnd };
}
