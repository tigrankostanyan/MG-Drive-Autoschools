import type { Paginated } from "./types";

/** The paged list endpoints cap `limit` at 50 server-side. */
export const PAGE_LIMIT_MAX = 50;

export type Pagination = { page: number; limit: number };

function clampInt(value: number, fallback: number, min: number, max: number): number {
	const n = Math.trunc(Number(value));
	if (!Number.isFinite(n)) return fallback;
	return Math.min(Math.max(n, min), max);
}

/** Clamp page/limit to values the API accepts instead of trusting callers. */
export function normalizePagination(page = 1, limit = PAGE_LIMIT_MAX): Pagination {
	return {
		page: clampInt(page, 1, 1, Number.MAX_SAFE_INTEGER),
		limit: clampInt(limit, PAGE_LIMIT_MAX, 1, PAGE_LIMIT_MAX),
	};
}

/** Serialize params into a query string, dropping empties and encoding values. */
export function buildQuery(params: Record<string, string | number | undefined | null>): string {
	const search = new URLSearchParams();
	for (const [key, value] of Object.entries(params)) {
		if (value === undefined || value === null || value === "") continue;
		search.set(key, String(value));
	}
	const qs = search.toString();
	return qs ? `?${qs}` : "";
}

/** Validated `?page=&limit=` string for the paged list endpoints. */
export function pageQuery(page: number, limit: number): string {
	const p = normalizePagination(page, limit);
	return buildQuery({ page: p.page, limit: p.limit });
}

/**
 * Walk every page of a metadata-paged endpoint until it reports the last page.
 * `maxPages` bounds a misbehaving API so aggregation cannot loop forever.
 */
export async function fetchAllPages<T>(
	fetchPage: (page: number, limit: number) => Promise<Paginated<T>>,
	maxPages = 20,
): Promise<T[]> {
	const items: T[] = [];
	for (let page = 1; page <= maxPages; page += 1) {
		const res = await fetchPage(page, PAGE_LIMIT_MAX);
		const batch = res.data ?? [];
		items.push(...batch);
		const lastPage = res.meta?.totalPages ?? 0;
		if (batch.length < PAGE_LIMIT_MAX || (lastPage > 0 && page >= lastPage)) {
			break;
		}
	}
	return items;
}
