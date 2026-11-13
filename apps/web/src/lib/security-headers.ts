import { VITE_MEDIA_BASE } from "./env";

const GOOGLE_IDENTITY_ORIGIN = "https://accounts.google.com";

// Media may be served from a separate origin (e.g. the API host in dev), so its
// origin must be allow-listed or the browser blocks every question/avatar image.
function mediaOrigin(): string | null {
	if (!VITE_MEDIA_BASE) return null;
	try {
		return new URL(VITE_MEDIA_BASE).origin;
	} catch {
		return null;
	}
}

const MEDIA_ORIGIN = mediaOrigin();
const MEDIA_SRC = MEDIA_ORIGIN ? ` ${MEDIA_ORIGIN}` : "";

const SHARED_DIRECTIVES = [
	"default-src 'self'",
	"base-uri 'self'",
	"object-src 'none'",
	"frame-ancestors 'none'",
	"form-action 'self'",
];

const RESOURCE_DIRECTIVES = [
	"style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://accounts.google.com",
	"font-src 'self' data: https://fonts.gstatic.com",
	`img-src 'self' data: blob:${MEDIA_SRC} https://*.googleapis.com https://*.gstatic.com https://*.googleusercontent.com`,
	`connect-src 'self'${MEDIA_SRC} ${GOOGLE_IDENTITY_ORIGIN}`,
	"frame-src 'self' https://www.google.com https://accounts.google.com",
	"worker-src 'self' blob:",
	"manifest-src 'self'",
];

const NONCE_BYTE_LENGTH = 16;
const HEX_BASE = 16;
const HEX_BYTE_WIDTH = 2;

export function createCspNonce(): string {
	const bytes = new Uint8Array(NONCE_BYTE_LENGTH);
	crypto.getRandomValues(bytes);
	let nonce = "";
	for (const byte of bytes) {
		nonce += byte.toString(HEX_BASE).padStart(HEX_BYTE_WIDTH, "0");
	}
	return nonce;
}

function scriptSrc(local: boolean, nonce: string | undefined): string {
	if (local || !nonce) {
		return `script-src 'self' 'unsafe-inline' ${GOOGLE_IDENTITY_ORIGIN}`;
	}
	return `script-src 'self' 'nonce-${nonce}' ${GOOGLE_IDENTITY_ORIGIN}`;
}

const PERMISSIONS_POLICY = [
	"accelerometer=()",
	"camera=()",
	"geolocation=()",
	"gyroscope=()",
	"magnetometer=()",
	"microphone=()",
	"payment=()",
	"usb=()",
].join(", ");

function isLocalNetworkOrDev(url: URL): boolean {
	if (typeof process !== "undefined" && process.env.NODE_ENV !== "production") {
		return true;
	}
	if (url.protocol === "http:") {
		return true;
	}
	const host = url.hostname;
	if (host === "localhost" || host === "127.0.0.1" || host === "[::1]") {
		return true;
	}
	return (
		host.endsWith(".local") ||
		/^10\./.test(host) ||
		/^172\.(1[6-9]|2\d|3[01])\./.test(host) ||
		/^192\.168\./.test(host)
	);
}

export function securityHeaders(url: URL, nonce?: string): Record<string, string> {
	const local = isLocalNetworkOrDev(url);
	const directives = [...SHARED_DIRECTIVES, scriptSrc(local, nonce), ...RESOURCE_DIRECTIVES];
	const csp = local ? directives.join("; ") : `${directives.join("; ")}; upgrade-insecure-requests`;
	const headers: Record<string, string> = {
		"Content-Security-Policy": csp,
		"X-Content-Type-Options": "nosniff",
		"X-Frame-Options": "DENY",
		"Referrer-Policy": "strict-origin-when-cross-origin",
		"Permissions-Policy": PERMISSIONS_POLICY,
		// Google Identity Services opens a popup and calls back via
		// `window.postMessage`; `same-origin` / `same-origin-allow-popups` sever
		// that opener relationship and the browser logs a COOP warning while the
		// callback is dropped. `unsafe-none` keeps the popup flow working.
		"Cross-Origin-Opener-Policy": "unsafe-none",
	};
	// HSTS is only meaningful over HTTPS, so skip it in local development.
	if (!local) {
		headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains; preload";
	}
	return headers;
}

export function applySecurityHeaders(response: Response, url: URL, nonce?: string): Response {
	const headers = securityHeaders(url, nonce);
	try {
		for (const [key, value] of Object.entries(headers)) {
			response.headers.set(key, value);
		}
		return response;
	} catch {
		// Immutable headers (e.g. redirects): rebuild, preserving Set-Cookie pairs.
		const rebuilt = new Headers();
		response.headers.forEach((value, key) => {
			if (key.toLowerCase() !== "set-cookie") rebuilt.append(key, value);
		});
		for (const cookie of response.headers.getSetCookie()) {
			rebuilt.append("set-cookie", cookie);
		}
		for (const [key, value] of Object.entries(headers)) {
			rebuilt.set(key, value);
		}
		return new Response(response.body, {
			status: response.status,
			statusText: response.statusText,
			headers: rebuilt,
		});
	}
}
