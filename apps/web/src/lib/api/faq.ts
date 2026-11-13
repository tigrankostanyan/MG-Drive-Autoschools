import { request } from "./client";
import { faqCategoriesResponseSchema, faqsResponseSchema } from "./resource-schemas";
import type { FaqItemData } from "./types";
export async function fetchFaqs(): Promise<{ data: FaqItemData[] }> {
	const res = await request<{ faqs: FaqItemData[] }>("/faq", undefined, faqsResponseSchema);
	return { data: res.faqs ?? [] };
}
export async function createFaq(body: {
	question: string;
	answer: string;
	category?: string;
}): Promise<{ data: FaqItemData }> {
	const res = await request<{ status: string; faq: FaqItemData }>("/faq", {
		method: "POST",
		body: JSON.stringify(body),
	});
	return { data: res.faq };
}
export async function updateFaq(
	id: number,
	body: { question?: string; answer?: string; category?: string },
): Promise<{ data: FaqItemData }> {
	const res = await request<{ status: string; faq: FaqItemData }>(`/faq/${id}`, {
		method: "PATCH",
		body: JSON.stringify(body),
	});
	return { data: res.faq };
}
export async function deleteFaq(id: number) {
	return request<unknown>(`/faq/${id}`, { method: "DELETE" });
}
/**
 * Category list comes from the API only. Callers degrade to an empty list on
 * failure, so a hardcoded fallback here would mask real errors as valid data.
 */
export async function fetchFaqCategories(): Promise<{ data: string[] }> {
	const res = await request<{ categories: string[] }>(
		"/faq/categories",
		undefined,
		faqCategoriesResponseSchema,
	);
	return { data: res.categories ?? [] };
}
export async function updateFaqCategories(categories: string[]): Promise<{ status: string }> {
	return request<{ status: string }>("/faq/categories", {
		method: "PUT",
		body: JSON.stringify({ categories }),
	});
}
