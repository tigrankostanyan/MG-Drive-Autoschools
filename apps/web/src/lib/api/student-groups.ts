import { z } from "zod";
import { request } from "./client";
import { fetchAllPages, PAGE_LIMIT_MAX, pageQuery } from "./query";
import { paginatedResponseSchema } from "./resource-schemas";
import type { Paginated, StudentGroupAccess, StudentGroupData, StudentRecord } from "./types";

const studentGroupDataSchema = z
	.object({
		id: z.number(),
		title: z.string(),
		grantStudentAccess: z.boolean(),
		sortControl: z.number().optional(),
		date: z.string().optional(),
	})
	.passthrough();

export async function fetchStudentGroups(
	page = 1,
	limit = PAGE_LIMIT_MAX,
): Promise<Paginated<StudentGroupData>> {
	return request<Paginated<StudentGroupData>>(
		`/student-groups${pageQuery(page, limit)}`,
		undefined,
		paginatedResponseSchema(studentGroupDataSchema),
	);
}
/** Every student group across pages, for callers that need the complete set. */
export async function fetchAllStudentGroups(): Promise<{
	data: StudentGroupData[];
}> {
	return { data: await fetchAllPages(fetchStudentGroups) };
}
export async function createStudentGroup(body: {
	title: string;
}): Promise<{ data: StudentGroupData }> {
	const res = await request<{ status: string; group: StudentGroupData }>("/student-groups", {
		method: "POST",
		body: JSON.stringify(body),
	});
	return { data: res.group };
}
export async function updateStudentGroup(
	id: number | string,
	body: { title?: string } & StudentGroupAccess,
): Promise<{ data: StudentGroupData }> {
	const res = await request<{ status: string; group: StudentGroupData }>(`/student-groups/${id}`, {
		method: "PATCH",
		body: JSON.stringify(body),
	});
	return { data: res.group };
}
export async function deleteStudentGroup(id: number | string) {
	return request<{ status: string }>(`/student-groups/${id}`, {
		method: "DELETE",
	});
}
export async function reorderStudentGroups(groupIds: number[]) {
	return request<{ status: string }>("/student-groups/reorder", {
		method: "PATCH",
		body: JSON.stringify({ groupIds }),
	});
}
export async function fetchStudentGroupStudents(id: number | string): Promise<{
	students: StudentRecord[];
	allStudents: StudentRecord[];
}> {
	const res = await request<{
		status: string;
		students: StudentRecord[];
		allStudents: StudentRecord[];
	}>(`/student-groups/${id}/students`);
	return { students: res.students ?? [], allStudents: res.allStudents ?? [] };
}
export async function assignStudentGroupStudents(id: number | string, studentIds: number[]) {
	return request<{ status: string }>(`/student-groups/${id}/students`, {
		method: "POST",
		body: JSON.stringify({ studentIds }),
	});
}
