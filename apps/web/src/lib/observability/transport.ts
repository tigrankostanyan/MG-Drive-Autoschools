/**
 * Isomorphic sink for structured log records. Records reach this module already
 * redacted and serialised; it only decides where they go. The server writes one
 * JSON line per record so the platform can index them, while the browser keeps
 * everything in the console and forwards warnings, errors and audit records to
 * the same-origin `/telemetry` ingest route (CSP stays `connect-src 'self'`).
 */
import { createIsomorphicFn } from "@tanstack/react-start";

const TELEMETRY_ENDPOINT = "/telemetry";
/** Shipping low-severity browser noise would only burn ingest quota. */
const REMOTE_LEVELS = new Set(["warn", "error"]);
/** Audit records are low volume but must survive, so level must not gate them. */
const REMOTE_SCOPES = new Set(["audit"]);

export type LogLevel = "debug" | "info" | "warn" | "error";
export type LogSource = "client" | "server";

export type LogRecord = {
	timestamp: string;
	level: LogLevel;
	scope: string;
	source: LogSource;
	message: string;
	[field: string]: unknown;
};

function writeToConsole(record: LogRecord): void {
	const line = JSON.stringify(record);
	if (record.level === "error") {
		console.error(line);
	} else if (record.level === "warn") {
		console.warn(line);
	} else {
		console.log(line);
	}
}

/** Only records an operator actually needs server-side leave the browser. */
function shouldForward(record: LogRecord): boolean {
	return REMOTE_LEVELS.has(record.level) || REMOTE_SCOPES.has(record.scope);
}

/**
 * The browser console must stay clean, so client records are only echoed when
 * they are actionable (warn/error). Everything else — including audit records,
 * which are still forwarded to `/telemetry` — is kept out of the console.
 */
function shouldPrint(record: LogRecord): boolean {
	return record.level === "warn" || record.level === "error";
}

export const sendRecord = createIsomorphicFn()
	.server((record: LogRecord) => {
		writeToConsole(record);
	})
	.client((record: LogRecord) => {
		if (shouldPrint(record)) writeToConsole(record);
		if (!shouldForward(record)) return;
		try {
			// Fire-and-forget: `keepalive` lets the request outlive the page.
			void fetch(TELEMETRY_ENDPOINT, {
				method: "POST",
				headers: { "content-type": "application/json" },
				body: JSON.stringify(record),
				credentials: "same-origin",
				keepalive: true,
			}).catch((err: unknown) => {
				// A dropped log record must never surface as an application error,
				// but keep a dev-visible trace so telemetry failures are diagnosable.
				if (typeof import.meta !== "undefined" && import.meta.env?.MODE !== "production") {
					console.error("[transport] Telemetry send failed:", err);
				}
			});
		} catch {
			// Same as above, for the synchronous part of `fetch`.
		}
	});
