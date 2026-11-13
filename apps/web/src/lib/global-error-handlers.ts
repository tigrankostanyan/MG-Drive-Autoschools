import { logError } from "./error-logger";

type WindowWithErrorHandlers = Window & {
	__errorHandlersInstalled?: boolean;
};

/**
 * Registers window-level handlers so runtime errors and unhandled promise
 * rejections that no component caught are still logged instead of becoming
 * unhandled console noise. No-op during SSR.
 */
export function installGlobalErrorHandlers(): void {
	if (typeof window === "undefined") return;
	const target = window as WindowWithErrorHandlers;
	if (target.__errorHandlersInstalled) return;
	target.__errorHandlersInstalled = true;

	// Bubble-phase listener: JS runtime errors only (resource load failures are
	// dispatched in the capture phase and stay out of this handler).
	window.addEventListener("error", (event) => {
		logError((event as ErrorEvent).error ?? event, { scope: "window.error" });
	});

	window.addEventListener("unhandledrejection", (event) => {
		// We log it here, so stop the runtime from reporting it as unhandled.
		event.preventDefault();
		const reason = event.reason;
		if (
			(reason instanceof Error && reason.name === "AbortError") ||
			(typeof DOMException !== "undefined" &&
				reason instanceof DOMException &&
				reason.name === "AbortError")
		) {
			return;
		}
		logError(event.reason, { scope: "window.unhandledrejection" });
	});
}
