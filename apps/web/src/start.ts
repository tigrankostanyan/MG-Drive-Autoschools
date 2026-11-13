import {
	sentryGlobalFunctionMiddleware,
	sentryGlobalRequestMiddleware,
} from "@sentry/tanstackstart-react";
import { createCsrfMiddleware, createMiddleware, createStart } from "@tanstack/react-start";
import { logError } from "./lib/error-logger";
import { renderErrorPage } from "./lib/error-page";
import { createCspNonce } from "./lib/security-headers";

const HTTP_INTERNAL_SERVER_ERROR = 500;
const MIDDLEWARE_SCOPE = "request.middleware";

const cspMiddleware = createMiddleware().server(({ next }) => {
	const nonce = createCspNonce();
	return next({ context: { nonce } });
});

const errorMiddleware = createMiddleware().server(async ({ next }) => {
	try {
		return await next();
	} catch (error) {
		if (error != null && typeof error === "object" && "statusCode" in error) {
			throw error;
		}
		// Caught here, so it never reaches Sentry's middleware — report it now.
		logError(error, { scope: MIDDLEWARE_SCOPE });
		return new Response(renderErrorPage(), {
			status: HTTP_INTERNAL_SERVER_ERROR,
			headers: { "content-type": "text/html; charset=utf-8" },
		});
	}
});
// Re-add CSRF explicitly since defining src/start.ts opts out of the default
const csrfMiddleware = createCsrfMiddleware({
	filter: (ctx) => ctx.handlerType === "serverFn",
});
export const startInstance = createStart(() => ({
	// Sentry goes first so failures in every later middleware are captured.
	requestMiddleware: [
		sentryGlobalRequestMiddleware,
		cspMiddleware,
		errorMiddleware,
		csrfMiddleware,
	],
	functionMiddleware: [sentryGlobalFunctionMiddleware],
}));
