import { request } from "./client";
import { registrationsResponseSchema } from "./resource-schemas";
import type { RegistrationItem } from "./types";

/** Payload accepted by POST /api/v1/registration. */
export type RegistrationPayload = {
	name: string;
	phone: string;
	packageType: string;
};

export async function fetchRegistrations(): Promise<{
	data: RegistrationItem[];
}> {
	const res = await request<{
		status: string;
		registrations: RegistrationItem[];
	}>("/registration", undefined, registrationsResponseSchema);
	return { data: res.registrations ?? [] };
}

export async function createRegistration(
	payload: RegistrationPayload,
): Promise<{ data: RegistrationItem }> {
	const res = await request<{
		status: string;
		registerCourse: RegistrationItem;
	}>("/registration", {
		method: "POST",
		body: JSON.stringify(payload),
	});
	return { data: res.registerCourse };
}

export async function deleteRegistration(id: number | string) {
	return request<{ message?: string }>(`/registration/${id}`, {
		method: "DELETE",
	});
}
