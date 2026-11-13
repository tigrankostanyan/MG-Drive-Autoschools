import { clearSessionUser, setSessionUser } from "../auth-session";
import {
	ApiError,
	BASE,
	type ErrorBody,
	fetchCsrfToken,
	invalidateCsrfCache,
	request,
} from "./client";
import {
	parseErrorBody,
	parseJson,
	sessionResponseSchema,
	updateMeResponseSchema,
} from "./schemas";
import type { UserItem } from "./types";

const HTTP_UNAUTHORIZED = 401;
const HTTP_FORBIDDEN = 403;

export async function fetchMe(): Promise<{ data: UserItem | null }> {
	try {
		const res = await request<{ status: string; user?: UserItem }>(
			"/user/me",
			undefined,
			sessionResponseSchema,
		);
		if (res.user) {
			setSessionUser(res.user);
			return { data: res.user };
		}
		return { data: null };
	} catch {
		return { data: null };
	}
}

export async function updateMe(body: Partial<UserItem>): Promise<{ data: UserItem }> {
	const csrfToken = await fetchCsrfToken();
	const doRequest = async (token: string): Promise<{ data: UserItem }> => {
		const res = await fetch(`${BASE}/user/updateme`, {
			method: "PATCH",
			credentials: "include",
			headers: {
				"Content-Type": "application/json",
				"x-csrf-token": token,
			},
			body: JSON.stringify({ ...body, _csrf: token }),
		});
		if (!res.ok) {
			const text = await res.text();
			let json: ErrorBody = {};
			try {
				json = parseErrorBody(JSON.parse(text)) ?? {};
			} catch {
				// ignore malformed error body
			}
			if (res.status === HTTP_UNAUTHORIZED) {
				// No refresh token exists; the server session is simply gone.
				clearSessionUser();
			}
			if (res.status === HTTP_FORBIDDEN && json.code?.startsWith?.("CSRF") && json.csrfToken) {
				invalidateCsrfCache(json.csrfToken);
				throw Object.assign(new ApiError(json.message ?? "CSRF error", res.status), {
					isCsrf: true,
					csrfToken: json.csrfToken,
				});
			}
			// Throw a typed ApiError so callers can surface the server message.
			throw new ApiError((json.message ?? text) || `${res.status} ${res.statusText}`, res.status);
		}
		const resJson = await parseJson<{ user: UserItem }>(res, updateMeResponseSchema);
		return { data: resJson.user };
	};
	try {
		const result = await doRequest(csrfToken);
		setSessionUser(result.data);
		return result;
	} catch (err: unknown) {
		if (
			err &&
			typeof err === "object" &&
			"isCsrf" in err &&
			(err as { isCsrf: boolean }).isCsrf &&
			"csrfToken" in err
		) {
			const retryToken = (err as { csrfToken: string }).csrfToken;
			const result = await doRequest(retryToken);
			setSessionUser(result.data);
			return result;
		}
		throw err;
	}
}
