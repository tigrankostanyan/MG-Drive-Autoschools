import { describeThrown, logger } from "./observability/logger";
import { reportError } from "./observability/sentry";

export type ErrorContext = {
	scope: string;
	meta?: Record<string, unknown>;
};

const FALLBACK_MESSAGE = "Unhandled application error";

export function logError(error: unknown, context: ErrorContext): void {
	const details = describeThrown(error);
	const message = String(details["message"] ?? FALLBACK_MESSAGE);
	logger.error(context.scope, message, { ...details, ...context.meta });
	reportError(error, context);
}
