/**
 * Sanitises everything that leaves the process as a log record. The browser is
 * untrusted, so the telemetry ingest route runs the exact same redaction again
 * before a client-supplied record reaches stdout.
 */
const SENSITIVE_KEY =
	/pass|pwd|token|secret|auth|cookie|session|csrf|credential|api[-_]?key|otp|mfa|recovery|bearer/i;
/** Owned by the record envelope; never merged in from caller fields. */
const RESERVED_KEYS = new Set(["timestamp", "level", "scope", "source", "message"]);
const REDACTED = "[redacted]";
const TRUNCATED = "[truncated]";
const MAX_DEPTH = 4;
const MAX_ARRAY_ITEMS = 20;
const MAX_OBJECT_KEYS = 30;
const MAX_STRING_LENGTH = 1_024;

export function truncate(text: string): string {
	if (text.length <= MAX_STRING_LENGTH) return text;
	return `${text.slice(0, MAX_STRING_LENGTH)}${TRUNCATED}`;
}

/** Depth-, size- and secret-aware clone of arbitrary diagnostics. */
export function redactValue(value: unknown, depth = 0): unknown {
	if (value === null || value === undefined) return value;
	if (typeof value === "string") return truncate(value);
	if (typeof value === "boolean") return value;
	if (typeof value === "number") return Number.isFinite(value) ? value : null;
	if (typeof value === "bigint") return value.toString();
	if (typeof value === "function" || typeof value === "symbol") return undefined;
	if (depth >= MAX_DEPTH) return TRUNCATED;
	if (Array.isArray(value)) {
		return value.slice(0, MAX_ARRAY_ITEMS).map((item) => redactValue(item, depth + 1));
	}
	if (value instanceof Error) {
		return { name: value.name, message: truncate(value.message) };
	}
	const source = value as Record<string, unknown>;
	const result: Record<string, unknown> = {};
	for (const key of Object.keys(source).slice(0, MAX_OBJECT_KEYS)) {
		result[key] = SENSITIVE_KEY.test(key) ? REDACTED : redactValue(source[key], depth + 1);
	}
	return result;
}

/** Redacts values and drops keys that the record envelope already owns. */
export function redactFields(fields: Record<string, unknown>): Record<string, unknown> {
	const redacted = redactValue(fields) as Record<string, unknown>;
	const result: Record<string, unknown> = {};
	for (const [key, value] of Object.entries(redacted)) {
		if (!RESERVED_KEYS.has(key)) result[key] = value;
	}
	return result;
}
