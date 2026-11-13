export interface PageItem {
	/** Unique React key; ellipses get an ordinal suffix so both stay distinct. */
	key: string;
	/** Page number, or an ellipsis marker. */
	value: number | "...";
}

export const ELLIPSIS = "..." as const;

/** Up to this many pages, every page fits without ellipses. */
const MAX_PAGES_WITHOUT_ELLIPSIS = 5;
/** Distance from the first page that pins the window to the leading edge. */
const LEADING_EDGE_DISTANCE = 3;
/** Distance from the last page that pins the window to the trailing edge. */
const TRAILING_EDGE_DISTANCE = 2;
/** Page buttons rendered together inside an edge window. */
const EDGE_WINDOW_SIZE = 4;
/** Pages kept on each side of the active page inside the sliding window. */
const SIBLING_OFFSET = 1;

function pageRange(start: number, count: number): number[] {
	return Array.from({ length: count }, (_, index) => start + index);
}

function withKeys(values: (number | typeof ELLIPSIS)[]): PageItem[] {
	let ellipsisOrdinal = 0;
	return values.map((value) => {
		if (value !== ELLIPSIS) {
			return { key: `page-${value}`, value };
		}
		ellipsisOrdinal += 1;
		return { key: `ellipsis-${ellipsisOrdinal}`, value };
	});
}

/** Visible page list with ellipses for long ranges, e.g. 1 "..." 4 5 6 "..." 20. */
export function getPageItems(currentPage: number, totalPages: number): PageItem[] {
	if (totalPages <= MAX_PAGES_WITHOUT_ELLIPSIS) {
		return withKeys(pageRange(1, totalPages));
	}
	if (currentPage <= LEADING_EDGE_DISTANCE) {
		return withKeys([...pageRange(1, EDGE_WINDOW_SIZE), ELLIPSIS, totalPages]);
	}
	if (currentPage >= totalPages - TRAILING_EDGE_DISTANCE) {
		return withKeys([
			1,
			ELLIPSIS,
			...pageRange(totalPages - EDGE_WINDOW_SIZE + 1, EDGE_WINDOW_SIZE),
		]);
	}
	return withKeys([
		1,
		ELLIPSIS,
		currentPage - SIBLING_OFFSET,
		currentPage,
		currentPage + SIBLING_OFFSET,
		ELLIPSIS,
		totalPages,
	]);
}
