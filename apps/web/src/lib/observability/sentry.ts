/**
 * Thin adapter over the Sentry SDK so no other module imports it directly.
 * Sentry runs in "fallback" mode: with no DSN configured nothing is sent and
 * every call here stays a safe no-op, so supplying the DSN later is the only
 * change needed to start receiving events.
 */
import * as Sentry from "@sentry/tanstackstart-react";
import type { LogFields } from "./logger";

export type ErrorReportContext = {
	/** Origin of the failure, mirroring the logger's `scope`. */
	scope: string;
	/** Non-sensitive diagnostics only — never secrets or personal data. */
	meta?: LogFields;
};

function applyContext(scope: Sentry.Scope, context: ErrorReportContext): void {
	scope.setTag("scope", context.scope);
	if (context.meta) scope.setContext("meta", context.meta);
}

/** Forwards an error to Sentry; never throws and never blocks the caller. */
export function reportError(error: unknown, context: ErrorReportContext): void {
	try {
		Sentry.withScope((scope) => {
			applyContext(scope, context);
			Sentry.captureException(error);
		});
	} catch {
		// Error reporting must never break the error path it is observing.
	}
}

/** Records a non-exception signal, e.g. an availability transition. */
export function reportMessage(
	message: string,
	context: ErrorReportContext,
	level: Sentry.SeverityLevel = "error",
): void {
	try {
		Sentry.withScope((scope) => {
			applyContext(scope, context);
			Sentry.captureMessage(message, level);
		});
	} catch {
		// Same contract as `reportError`.
	}
}
