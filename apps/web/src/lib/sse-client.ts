import { logger } from "@/lib/observability/logger";
import { clearSessionUser } from "./auth-session";

let eventSource: EventSource | null = null;
let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
let reconnectAttempts = 0;
const RECONNECT_BASE_DELAY_MS = 1_000;
const MAX_RECONNECT_DELAY_MS = 30_000;
const KICKED_OUT_REDIRECT_DELAY_MS = 3_000;

export function connectSessionSSE() {
	if (typeof window === "undefined") return;
	if (eventSource) return;

	eventSource = new EventSource("/api/v1/auth/sse/session", {
		withCredentials: true,
	});

	eventSource.onopen = () => {
		reconnectAttempts = 0;
	};

	eventSource.onmessage = (e: MessageEvent) => {
		try {
			const data: unknown = JSON.parse(e.data);
			const event =
				data && typeof data === "object" && "event" in data
					? (data as { event?: unknown }).event
					: undefined;
			if (event !== "kicked_out" && event !== "admin_force_logout") return;
			disconnectSessionSSE();
			clearSessionUser();
			window.dispatchEvent(
				new CustomEvent("auth-kick", {
					detail: { reason: event },
				}),
			);
			setTimeout(() => {
				window.location.href = "/";
			}, KICKED_OUT_REDIRECT_DELAY_MS);
		} catch (error) {
			logger.warn("sse.malformed_payload", "Ignoring malformed session SSE payload", { error });
		}
	};

	eventSource.onerror = () => {
		// Retry with bounded backoff when EventSource gives up, not just on reconnect.
		if (eventSource?.readyState !== EventSource.CLOSED) return;
		if (eventSource) {
			eventSource.close();
			eventSource = null;
		}
		if (reconnectTimer) return;
		const delay = Math.min(
			RECONNECT_BASE_DELAY_MS * 2 ** reconnectAttempts,
			MAX_RECONNECT_DELAY_MS,
		);
		reconnectAttempts += 1;
		reconnectTimer = setTimeout(() => {
			reconnectTimer = null;
			connectSessionSSE();
		}, delay);
	};
}

export function disconnectSessionSSE() {
	if (reconnectTimer) {
		clearTimeout(reconnectTimer);
		reconnectTimer = null;
	}
	reconnectAttempts = 0;
	if (eventSource) {
		eventSource.close();
		eventSource = null;
	}
}
