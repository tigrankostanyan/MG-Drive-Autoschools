import "./lib/error-capture";
import { consumeLastCapturedError } from "./lib/error-capture";
import { logError } from "./lib/error-logger";
import { renderErrorPage } from "./lib/error-page";
import { withServerSentry } from "./lib/observability/sentry-server";
import { applySecurityHeaders } from "./lib/security-headers";

const HTTP_INTERNAL_SERVER_ERROR = 500;
const SSR_SCOPE = "server.ssr";

type ServerEntry = {
	fetch: (request: Request, env: unknown, ctx: unknown) => Promise<Response> | Response;
};
let serverEntryPromise: Promise<ServerEntry> | undefined;
async function getServerEntry(): Promise<ServerEntry> {
	if (!serverEntryPromise) {
		serverEntryPromise = import("@tanstack/react-start/server-entry").then(
			(m) => (m.default ?? m) as ServerEntry,
		);
	}
	return serverEntryPromise;
}
// h3 swallows in-handler throws into a generic 500 Response; detect and re-render
async function normalizeCatastrophicSsrResponse(response: Response): Promise<Response> {
	if (response.status < HTTP_INTERNAL_SERVER_ERROR) return response;
	const contentType = response.headers.get("content-type") ?? "";
	if (!contentType.includes("application/json")) return response;
	const body = await response.clone().text();
	if (!isH3SwallowedErrorBody(body)) return response;
	logError(consumeLastCapturedError() ?? new Error(`h3 swallowed SSR error: ${body}`), {
		scope: SSR_SCOPE,
	});
	return new Response(renderErrorPage(), {
		status: HTTP_INTERNAL_SERVER_ERROR,
		headers: { "content-type": "text/html; charset=utf-8" },
	});
}
function isH3SwallowedErrorBody(body: string): boolean {
	try {
		const payload = JSON.parse(body) as {
			unhandled?: unknown;
			message?: unknown;
		};
		return payload.unhandled === true && payload.message === "HTTPError";
	} catch {
		return false;
	}
}

function extractNonceFromResponse(response: Response): string | undefined {
	const csp = response.headers.get("content-security-policy");
	if (!csp) return undefined;
	const match = /nonce-([a-f0-9]+)/i.exec(csp);
	return match?.[1];
}

const worker = {
	async fetch(request: Request, env: unknown, ctx: unknown) {
		const url = new URL(request.url);
		try {
			const handler = await getServerEntry();
			const response = await handler.fetch(request, env, ctx);
			const normalized = await normalizeCatastrophicSsrResponse(response);
			const nonce = extractNonceFromResponse(normalized);
			return applySecurityHeaders(normalized, url, nonce);
		} catch (error) {
			// SSR rendering failures bypass the middleware stack, so report here.
			logError(error, { scope: SSR_SCOPE });
			return applySecurityHeaders(
				new Response(renderErrorPage(), {
					status: HTTP_INTERNAL_SERVER_ERROR,
					headers: { "content-type": "text/html; charset=utf-8" },
				}),
				url,
			);
		}
	},
};

export default withServerSentry(worker);
