import { request } from "./client";
import type { ContactItem } from "./types";
export async function fetchContactInfo(): Promise<{
	data: ContactItem | null;
}> {
	const res = await request<{ status: string; contact?: ContactItem }>("/contact");
	return { data: res.contact ?? null };
}
export async function updateContactInfo(
	body: Partial<ContactItem>,
): Promise<{ data: ContactItem }> {
	const res = await request<{ status: string; contact: ContactItem }>("/contact", {
		method: "PATCH",
		body: JSON.stringify(body),
	});
	return { data: res.contact };
}
export type ContactMessagePayload = {
	name: string;
	company: string;
	phone: string;
	email: string;
	subject: string;
	message: string;
};
export async function sendContactMessage(body: ContactMessagePayload): Promise<void> {
	await request<{ status: string }>("/contact/message", {
		method: "POST",
		body: JSON.stringify(body),
	});
}
