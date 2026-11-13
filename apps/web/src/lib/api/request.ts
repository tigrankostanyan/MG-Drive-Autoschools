import type { z } from "zod";
import { clearSessionUser } from "../auth-session";
import { notify } from "../notify";
import { ApiError, BASE, type ErrorBody } from "./client-base";
import { fetchCsrfToken, invalidateCsrfCache } from "./csrf";
import { parseErrorBody, parseJson } from "./schemas";
import { getSsrContext } from "./ssr-context";

const HTTP_UNAUTHORIZED = 401;
const HTTP_NO_CONTENT = 204;
const KICKED_OUT_REDIRECT_DELAY_MS = 3_000;
const REQUEST_TIMEOUT_MS = 30_000;
/** Non-HTTP status used for timeouts and lost connections. */
const NETWORK_ERROR_STATUS = 0;

function connectionErrorMessage(timedOut: boolean): string {
	if (typeof navigator !== "undefined" && navigator.onLine === false) {
		return "Ինտերնետ կապ չկա։ Ստուգեք կապը և փորձեք կրկին։";
	}
	return timedOut
		? "Սպասման ժամկետը լրացավ։ Խնդրում ենք փորձել կրկին։"
		: "Չհաջողվեց կապվել սերվերի հետ։ Խնդրում ենք փորձել կրկին։";
}

function tryParseErrorBody(raw: string): ErrorBody | null {
	try {
		return parseErrorBody(JSON.parse(raw));
	} catch {
		return null;
	}
}

function extractServerMessage(raw: string): string | undefined {
	const msg = tryParseErrorBody(raw)?.message;
	return msg?.trim() ? msg : undefined;
}

function isAbortError(err: unknown): boolean {
	if (err instanceof Error && err.name === "AbortError") return true;
	if (err instanceof DOMException && err.name === "AbortError") return true;
	return false;
}

export function request<T>(url: string, opts?: RequestInit, schema?: z.ZodType): Promise<T> {
	return send<T>(url, opts, schema, false);
}

async function send<T>(
	url: string,
	opts: RequestInit | undefined,
	schema: z.ZodType | undefined,
	isRetry: boolean,
): Promise<T> {
	const method = (opts?.method ?? "GET").toUpperCase();
	const isMutating = !["GET", "HEAD", "OPTIONS"].includes(method);
	const isClient = typeof window !== "undefined";
	const authHeaders: Record<string, string> = {};
	let fetchUrl = `${BASE}${url}`;
	if (!isClient) {
		const ssr = await getSsrContext();
		if (ssr.cookie) authHeaders["Cookie"] = ssr.cookie;
		if (ssr.userAgent) authHeaders["User-Agent"] = ssr.userAgent;
		if (ssr.forwardedFor) authHeaders["X-Forwarded-For"] = ssr.forwardedFor;
		if (ssr.realIp) authHeaders["X-Real-IP"] = ssr.realIp;
		if (ssr.apiBase) fetchUrl = `${ssr.apiBase}${fetchUrl}`;
	}
	if (isMutating && isClient) {
		try {
			const csrf = await fetchCsrfToken();
			if (csrf) authHeaders["x-csrf-token"] = csrf;
		} catch {
			// Ignore csrf fetch errors, rely on server validation
		}
	}
	// Bound every request so a stalled connection cannot hang a form forever,
	// while still honouring a caller-provided signal.
	const controller = new AbortController();
	let timedOut = false;
	const timeoutId = setTimeout(() => {
		timedOut = true;
		controller.abort();
	}, REQUEST_TIMEOUT_MS);
	const forwardAbort = () => controller.abort();
	opts?.signal?.addEventListener("abort", forwardAbort, { once: true });

	let res: Response;
	try {
		res = await fetch(fetchUrl, {
			...opts,
			signal: controller.signal,
			credentials: "include",
			headers: {
				"Content-Type": "application/json",
				...authHeaders,
				...opts?.headers,
			},
		});
	} catch (err) {
		if (isAbortError(err)) {
			if (timedOut) {
				throw new ApiError(connectionErrorMessage(true), NETWORK_ERROR_STATUS);
			}
			// Caller-driven cancellation (e.g. route change / navigation): propagate
			// native AbortError so TanStack Router and React Query can cleanly recognize
			// intentional cancellation and ignore it without rendering error boundaries.
			throw err;
		}
		throw new ApiError(connectionErrorMessage(timedOut), NETWORK_ERROR_STATUS);
	} finally {
		clearTimeout(timeoutId);
		opts?.signal?.removeEventListener("abort", forwardAbort);
	}
	if (!res.ok) {
		const text = await res.text();
		const serverMessage = extractServerMessage(text);
		// Handle kicked_out (another device logged in)
		if (res.status === HTTP_UNAUTHORIZED && text.includes("kicked_out")) {
			if (typeof window !== "undefined") {
				clearSessionUser();
				notify.error(
					"\u0534\u0578\u0582\u0584 \u0574\u0578\u0582\u0580\u057D \u0565\u0584 \u0563\u0581\u057E\u0565\u056C \u0561\u0575\u056C \u057D\u0561\u0580\u0584\u056B\u058B\u0589",
				);
				setTimeout(() => {
					window.location.href = "/";
				}, KICKED_OUT_REDIRECT_DELAY_MS);
			}
			throw new ApiError("kicked_out", HTTP_UNAUTHORIZED);
		}
		// Sessions are server-side httpOnly cookies that slide automatically;
		// there is no refresh token, so a 401 means the session is gone and
		// retrying through /user/token only burns the rate limit.
		if (res.status === HTTP_UNAUTHORIZED) {
			const failure = tryParseErrorBody(text);
			const sessionIsGone =
				failure?.code === "TOKEN_EXPIRED" ||
				failure?.error === "kicked_out" ||
				failure?.error === "session_invalidated" ||
				failure?.error === "session_not_found";
			if (sessionIsGone) {
				clearSessionUser();
			}
		}
		// CSRF token expired/tampered → server sent a fresh one; retry once
		if (!isRetry && isMutating && isClient) {
			const body = tryParseErrorBody(text);
			if (body?.code?.startsWith?.("CSRF") && body.csrfToken) {
				invalidateCsrfCache(body.csrfToken);
				return send<T>(url, opts, schema, true);
			}
		}
		// Never surface the raw body: it may be an HTML error page carrying an
		// internal stack trace. Only a parsed server message is safe to display.
		const statusFallback = `${res.status} ${res.statusText}`.trim();
		throw new ApiError(serverMessage || statusFallback, res.status);
	}
	// 204 means "no body": return the honest empty value instead of faking a `T`.
	if (res.status === HTTP_NO_CONTENT) return undefined as T;
	return parseJson<T>(res, schema);
}
