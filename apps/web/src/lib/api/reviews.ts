import { request } from "./client";

export interface ReviewItem {
	id: number;
	rating: number;
	name: string;
	type?: string | null;
	user_id?: number | null;
	comment: string;
	date: string;
}

export async function fetchReviews(): Promise<{ data: ReviewItem[] }> {
	const res = await request<{
		status: string;
		data?: { reviews?: ReviewItem[] };
	}>("/review");
	return { data: res.data?.reviews ?? [] };
}

export async function addReview(body: {
	rating: number;
	comment: string;
	type?: string;
}): Promise<{ data: ReviewItem }> {
	const res = await request<{ status: string; data: { review: ReviewItem } }>("/review", {
		method: "POST",
		body: JSON.stringify(body),
	});
	return { data: res.data.review };
}
