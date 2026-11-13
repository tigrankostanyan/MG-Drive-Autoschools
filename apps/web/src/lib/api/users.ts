import { request } from "./client";
import { usersResponseSchema } from "./resource-schemas";
import type { UserItem } from "./types";
export async function fetchUsers(): Promise<{ data: UserItem[] }> {
	const res = await request<{ users: UserItem[] }>("/user", undefined, usersResponseSchema);
	return { data: res.users ?? [] };
}
export async function updateUser(
	id: number | string,
	body: Partial<UserItem>,
): Promise<{ data: UserItem }> {
	const res = await request<{ status: string; user: UserItem }>(`/user/${id}`, {
		method: "PATCH",
		body: JSON.stringify(body),
	});
	return { data: res.user };
}
export async function deleteUser(id: number | string) {
	return request<unknown>(`/user/${id}`, { method: "DELETE" });
}
export async function reorderUsers(userIds: number[]) {
	return request<{ status: string }>(`/user/reorder`, {
		method: "PATCH",
		body: JSON.stringify({ userIds }),
	});
}
