import {
	closestCenter,
	DndContext,
	type DragEndEvent,
	type DraggableAttributes,
	type DraggableSyntheticListeners,
	KeyboardSensor,
	PointerSensor,
	useSensor,
	useSensors,
} from "@dnd-kit/core";
import {
	rectSortingStrategy,
	SortableContext,
	sortableKeyboardCoordinates,
	useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { type ReactNode, useEffect, useState } from "react";
import type { SortableItem } from "@/hooks/use-sortable-grid";

export type SortableDragHandle = {
	attributes: DraggableAttributes;
	listeners: DraggableSyntheticListeners;
};

export type SortableGridRenderProps<T extends SortableItem> = {
	item: T;
	enabled: boolean;
	isOverlay: boolean;
	dragHandle: SortableDragHandle | null;
};

type SortableGridProps<T extends SortableItem> = {
	items: T[];
	enabled?: boolean;
	gridClassName?: string;
	onDragEnd?: (event: DragEndEvent) => void | Promise<void>;
	renderItem: (props: SortableGridRenderProps<T>) => ReactNode;
};

export function SortableGrid<T extends SortableItem>({
	items,
	enabled = true,
	gridClassName = "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3",
	onDragEnd,
	renderItem,
}: SortableGridProps<T>) {
	const sensors = useSensors(
		useSensor(PointerSensor, {
			activationConstraint: { distance: 5 },
		}),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		}),
	);

	const [isMounted, setIsMounted] = useState(false);
	useEffect(() => {
		setIsMounted(true);
	}, []);

	if (!enabled || !isMounted) {
		return (
			<div className={gridClassName}>
				{items.map((item) => (
					<div key={item.id} className="relative z-0 hover:z-40 focus-within:z-40">
						{renderItem({
							item,
							enabled: false,
							isOverlay: false,
							dragHandle: null,
						})}
					</div>
				))}
			</div>
		);
	}

	return (
		<DndContext
			id="dnd-sortable-grid"
			sensors={sensors}
			collisionDetection={closestCenter}
			{...(onDragEnd ? { onDragEnd } : {})}
		>
			<SortableContext items={items.map((item) => item.id)} strategy={rectSortingStrategy}>
				<div className={gridClassName}>
					{items.map((item) => (
						<SortableCard key={item.id} item={item} renderItem={renderItem} />
					))}
				</div>
			</SortableContext>
		</DndContext>
	);
}

function SortableCard<T extends SortableItem>({
	item,
	renderItem,
}: {
	item: T;
	renderItem: (props: SortableGridRenderProps<T>) => ReactNode;
}) {
	const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
		id: item.id,
	});

	const style = {
		transform: CSS.Translate.toString(transform),
		transition,
		position: "relative" as const,
	};

	return (
		<div
			ref={setNodeRef}
			style={style}
			className={isDragging ? "z-50" : "z-0 hover:z-40 focus-within:z-40"}
		>
			{renderItem({
				item,
				enabled: true,
				isOverlay: isDragging,
				dragHandle: { attributes, listeners },
			})}
		</div>
	);
}
