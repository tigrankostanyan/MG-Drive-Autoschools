import { setSessionUser } from "../auth-session";
import { BASE } from "./client-base";
import { fetchCsrfToken, invalidateCsrfCache } from "./csrf";
import { parseErrorBody, parseJson, refreshResponseSchema } from "./schemas";
import type { UserItem } from "./types";

const HTTP_FORBIDDEN = 403;

let _refreshPromise: Promise<string | null> | null = null;

export async function refreshAccessToken(): Promise<string | null> {
	if (_refreshPromise) return _refreshPromise;
	_refreshPromise = (async () => {
		try {
			// Session rotation is mutating, so it needs the double-submit CSRF token.
			const sendRefresh = (csrfToken: string) => {
				const headers: Record<string, string> = {
					"Content-Type": "application/json",
				};
				if (csrfToken) headers["x-csrf-token"] = csrfToken;
				return fetch(`${BASE}/user/token`, {
					method: "POST",
					credentials: "include",
					headers,
				});
			};
			let csrfToken = await fetchCsrfToken().catch(() => "");
			let res = await sendRefresh(csrfToken);
			if (res.status === HTTP_FORBIDDEN) {
				// Cached CSRF token went stale — the server issues a fresh one.
				const body = parseErrorBody(await res.json().catch(() => null));
				csrfToken = body?.csrfToken || (await fetchCsrfToken().catch(() => ""));
				invalidateCsrfCache(csrfToken || undefined);
				res = await sendRefresh(csrfToken);
			}
			if (!res.ok) throw new Error("Refresh failed");
			const json = await parseJson<{
				user?: UserItem | null;
				token?: string;
			}>(res, refreshResponseSchema);
			// Token is now handled via HttpOnly cookies, no need to store in localStorage
			if (json.user) {
				setSessionUser(json.user);
			}
			return json.token || "refreshed";
		} catch {
			return null;
		} finally {
			_refreshPromise = null;
		}
	})();
	return _refreshPromise;
}
