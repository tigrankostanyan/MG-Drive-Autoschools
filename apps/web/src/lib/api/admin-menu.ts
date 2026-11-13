import { request } from "./client";
import type { AdminMenuItemData } from "./types";

export async function fetchMenuItems(): Promise<{ data: AdminMenuItemData[] }> {
	const res = await request<{ data: AdminMenuItemData[] }>("/admin-menu");
	return { data: res.data ?? [] };
}

export async function reorderMenuItems(ids: number[]) {
	return request<{ status: string }>(`/admin-menu/reorder`, {
		method: "PATCH",
		body: JSON.stringify({ ids }),
	});
}
