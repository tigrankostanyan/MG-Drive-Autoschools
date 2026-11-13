import * as Sentry from "@sentry/cloudflare";
import { wrapFetchWithSentry } from "@sentry/tanstackstart-react";

const TRACES_SAMPLE_RATE = 0.1;

type WorkerHandler = {
	fetch: (request: Request, env: unknown, ctx: unknown) => Promise<Response> | Response;
};

export function withServerSentry(handler: WorkerHandler): WorkerHandler {
	return Sentry.withSentry(
		() => ({
			tracesSampleRate: TRACES_SAMPLE_RATE,
			...(process.env["SENTRY_DSN"] ? { dsn: process.env["SENTRY_DSN"] } : {}),
			...(process.env["SENTRY_ENVIRONMENT"]
				? { environment: process.env["SENTRY_ENVIRONMENT"] }
				: {}),
		}),
		wrapFetchWithSentry(handler as unknown as { fetch: typeof fetch }),
	) as WorkerHandler;
}
