import { createFileRoute } from "@tanstack/react-router";
import { redactFields, truncate } from "@/lib/observability/redaction";
import { type LogLevel, type LogRecord, sendRecord } from "@/lib/observability/transport";

const HTTP_NO_CONTENT = 204;
const HTTP_BAD_REQUEST = 400;
const HTTP_FORBIDDEN = 403;
const HTTP_PAYLOAD_TOO_LARGE = 413;
const MAX_BODY_LENGTH = 16_384;
const MAX_SCOPE_LENGTH = 120;
const MAX_MESSAGE_LENGTH = 1_024;
const DEFAULT_LEVEL: LogLevel = "info";
const REPORT_SCOPE = "telemetry.report";
const ALLOWED_LEVELS = new Set<string>(["debug", "info", "warn", "error"]);

function asString(value: unknown, max: number): string {
	return typeof value === "string" ? truncate(value).slice(0, max) : "";
}

function badRequest(status: number): Response {
	return new Response(null, { status });
}

export const Route = createFileRoute("/telemetry")({
	server: {
		handlers: {
			POST: async ({ request }) => {
				// Cheap, browser-only anti-spam check; other clients omit the header.
				if (request.headers.get("sec-fetch-site") === "cross-site") {
					return badRequest(HTTP_FORBIDDEN);
				}
				const raw = await request.text();
				if (raw.length > MAX_BODY_LENGTH) {
					return badRequest(HTTP_PAYLOAD_TOO_LARGE);
				}
				let payload: Record<string, unknown>;
				try {
					const parsed: unknown = JSON.parse(raw);
					if (parsed === null || typeof parsed !== "object") {
						return badRequest(HTTP_BAD_REQUEST);
					}
					payload = parsed as Record<string, unknown>;
				} catch {
					return badRequest(HTTP_BAD_REQUEST);
				}
				const level = ALLOWED_LEVELS.has(payload["level"] as string)
					? (payload["level"] as LogLevel)
					: DEFAULT_LEVEL;
				const record: LogRecord = {
					timestamp: new Date().toISOString(),
					level,
					scope: asString(payload["scope"], MAX_SCOPE_LENGTH) || REPORT_SCOPE,
					source: "client",
					message: asString(payload["message"], MAX_MESSAGE_LENGTH),
				};
				Object.assign(record, redactFields(payload));
				sendRecord(record);
				return new Response(null, { status: HTTP_NO_CONTENT });
			},
		},
	},
});
