import { clearSessionUser } from "../auth-session";
import { BASE, type ErrorBody, fetchCsrfToken, invalidateCsrfCache } from "./client";
import { parseErrorBody } from "./schemas";

const HTTP_FORBIDDEN = 403;

export async function logout(): Promise<void> {
	try {
		const csrfToken = await fetchCsrfToken();
		const doLogout = async (token: string): Promise<void> => {
			const res = await fetch(`${BASE}/user/logout`, {
				method: "POST",
				credentials: "include",
				headers: {
					"Content-Type": "application/json",
					"x-csrf-token": token,
				},
				body: JSON.stringify({ _csrf: token }),
			});
			if (!res.ok) {
				const text = await res.text();
				let json: ErrorBody = {};
				try {
					json = parseErrorBody(JSON.parse(text)) ?? {};
				} catch {
					// ignore malformed error body
				}
				if (res.status === HTTP_FORBIDDEN && json.code?.startsWith?.("CSRF") && json.csrfToken) {
					invalidateCsrfCache(json.csrfToken);
					throw Object.assign(new Error(json.message ?? "CSRF error"), {
						isCsrf: true,
						csrfToken: json.csrfToken,
					});
				}
				throw new Error(json.message ?? text ?? `${res.status} ${res.statusText}`);
			}
		};
		try {
			await doLogout(csrfToken);
		} catch (err: unknown) {
			if (
				err &&
				typeof err === "object" &&
				"isCsrf" in err &&
				(err as { isCsrf: boolean }).isCsrf &&
				"csrfToken" in err
			) {
				const retryToken = (err as { csrfToken: string }).csrfToken;
				await doLogout(retryToken);
			} else {
				throw err;
			}
		}
	} finally {
		clearSessionUser();
	}
}
