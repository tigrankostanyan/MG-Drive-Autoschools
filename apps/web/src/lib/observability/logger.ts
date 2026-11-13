/**
 * Structured logger. Every record is a single JSON line with a stable envelope
 * (`timestamp`, `level`, `scope`, `source`, `message`) so production logs stay
 * searchable and machine-parseable. Fields are redacted here as a first line of
 * defence; the ingest route redacts browser-supplied records a second time.
 */
import { redactFields, truncate } from "./redaction";
import { type LogLevel, type LogRecord, sendRecord } from "./transport";

export type LogFields = Record<string, unknown>;

const IS_SERVER = typeof window === "undefined";

function emit(level: LogLevel, scope: string, message: string, fields?: LogFields): void {
	try {
		const record: LogRecord = {
			timestamp: new Date().toISOString(),
			level,
			scope,
			source: IS_SERVER ? "server" : "client",
			message: truncate(message),
		};
		if (fields) Object.assign(record, redactFields(fields));
		sendRecord(record);
	} catch {
		// Logging must never throw and hide the failure it was reporting.
	}
}

/** Normalises anything throwable into redactable, serialisable fields. */
export function describeThrown(error: unknown): LogFields {
	if (error instanceof Error) {
		return { name: error.name, message: truncate(error.message) };
	}
	if (typeof error === "string") return { message: truncate(error) };
	try {
		return { message: truncate(JSON.stringify(error) ?? "Unserialisable") };
	} catch {
		return { message: "Unserialisable" };
	}
}

export const logger = {
	debug(scope: string, message: string, fields?: LogFields): void {
		emit("debug", scope, message, fields);
	},
	info(scope: string, message: string, fields?: LogFields): void {
		emit("info", scope, message, fields);
	},
	warn(scope: string, message: string, fields?: LogFields): void {
		emit("warn", scope, message, fields);
	},
	error(scope: string, message: string, fields?: LogFields): void {
		emit("error", scope, message, fields);
	},
};
