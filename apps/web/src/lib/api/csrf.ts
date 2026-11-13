import { BASE } from "./client-base";
import { csrfResponseSchema, parseJson } from "./schemas";

const MINUTE_MS = 60_000;
const CSRF_CACHE_MAX_AGE_MINUTES = 50;
const CSRF_CACHE_MAX_AGE_MS = CSRF_CACHE_MAX_AGE_MINUTES * MINUTE_MS;

let _csrfCache: { token: string; fetchedAt: number } | null = null;
let _csrfFetchPromise: Promise<string> | null = null;

function getCsrfCookie(): string | null {
	if (typeof document === "undefined") return null;
	const match = document.cookie.match(/(?:^|;\s*)_csrf=([^;]*)/);
	return match?.[1] ? decodeURIComponent(match[1]) : null;
}

export async function fetchCsrfToken(force = false): Promise<string> {
	const cookieToken = getCsrfCookie();

	// If we have an existing valid cookie and our in-memory cache matches it, use it
	if (
		!force &&
		cookieToken &&
		_csrfCache &&
		_csrfCache.token === cookieToken &&
		Date.now() - _csrfCache.fetchedAt < CSRF_CACHE_MAX_AGE_MS
	) {
		return _csrfCache.token;
	}

	// If there's an existing cookie in the browser but no cache, adopt it
	if (!force && cookieToken && !_csrfCache) {
		_csrfCache = { token: cookieToken, fetchedAt: Date.now() };
		return cookieToken;
	}

	if (_csrfFetchPromise) return _csrfFetchPromise;
	_csrfFetchPromise = (async () => {
		try {
			const res = await fetch(`${BASE}/user/csrf-token`, {
				method: "GET",
				credentials: "include",
			});
			if (!res.ok) throw new Error(`CSRF fetch failed: ${res.status}`);
			const data = await parseJson<{ csrfToken?: string }>(res, csrfResponseSchema);
			const token = data.csrfToken ?? getCsrfCookie() ?? "";
			_csrfCache = { token, fetchedAt: Date.now() };
			return token;
		} finally {
			_csrfFetchPromise = null;
		}
	})();
	return _csrfFetchPromise;
}

export function invalidateCsrfCache(newToken?: string) {
	if (newToken) {
		_csrfCache = { token: newToken, fetchedAt: Date.now() };
	} else {
		_csrfCache = null;
	}
}
