import { BASE, type ErrorBody, fetchCsrfToken, invalidateCsrfCache } from "./client";
import { googleAuthResponseSchema, parseErrorBody, parseJson } from "./schemas";
import type { AuthResponse } from "./types";

const HTTP_FORBIDDEN = 403;

export async function googleLogin(credential: string): Promise<AuthResponse> {
	const csrfToken = await fetchCsrfToken();
	const doRequest = async (token: string): Promise<AuthResponse> => {
		const res = await fetch(`${BASE}/user/auth/google`, {
			method: "POST",
			credentials: "include",
			headers: {
				"Content-Type": "application/json",
				"x-csrf-token": token,
			},
			body: JSON.stringify({ credential, _csrf: token }),
		});
		if (!res.ok) {
			const errorBody: ErrorBody = parseErrorBody(await res.json().catch(() => null)) ?? {};
			if (res.status === HTTP_FORBIDDEN && errorBody.code?.startsWith?.("CSRF")) {
				invalidateCsrfCache();
				throw Object.assign(new Error(errorBody.message ?? "CSRF error"), {
					isCsrf: true,
				});
			}
			throw new Error(errorBody.message ?? `${res.status} ${res.statusText}`);
		}
		return parseJson<AuthResponse>(res, googleAuthResponseSchema);
	};
	try {
		return await doRequest(csrfToken);
	} catch (err: unknown) {
		if (err && typeof err === "object" && "isCsrf" in err && (err as { isCsrf: boolean }).isCsrf) {
			// Force-fetch a fresh CSRF token from the server via GET to ensure the cookie is committed
			invalidateCsrfCache();
			const freshToken = await fetchCsrfToken(true);
			return await doRequest(freshToken);
		}
		throw err;
	}
}
