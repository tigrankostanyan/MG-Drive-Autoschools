import { createFileRoute } from "@tanstack/react-router";
import { getSsrContext } from "@/lib/api/ssr-context";
import { reportAvailability } from "@/lib/observability/uptime";

const HTTP_OK = 200;
const HTTP_SERVICE_UNAVAILABLE = 503;
const READINESS_TIMEOUT_MS = 3_000;
/** Public, unauthenticated and side-effect free — safe to probe every time. */
const READINESS_PROBE_PATH = "/api/v1/faq";

/**
 * Readiness probe. Unlike liveness it verifies the web layer can still reach
 * the API, so a load balancer or uptime monitor never keeps routing traffic to
 * an instance that cannot serve data. Answers 503 while the probe fails.
 */
export const Route = createFileRoute("/health_/ready")({
	server: {
		handlers: {
			GET: async () => {
				const { apiBase } = await getSsrContext();
				const startedAt = Date.now();
				let backendOk = false;
				let backendStatus: number | undefined;
				let backendError: string | undefined;
				try {
					const response = await fetch(`${apiBase}${READINESS_PROBE_PATH}`, {
						headers: { accept: "application/json" },
						signal: AbortSignal.timeout(READINESS_TIMEOUT_MS),
					});
					backendOk = response.ok;
					backendStatus = response.status;
				} catch (error) {
					backendError = error instanceof Error ? error.name : "UnknownError";
				}
				const latencyMs = Date.now() - startedAt;
				reportAvailability(backendOk, {
					status: backendStatus,
					error: backendError,
					latencyMs,
				});
				return Response.json(
					{
						status: backendOk ? "ready" : "degraded",
						checks: {
							backend: {
								ok: backendOk,
								status: backendStatus,
								latencyMs,
								error: backendError,
							},
						},
						timestamp: new Date().toISOString(),
					},
					{
						status: backendOk ? HTTP_OK : HTTP_SERVICE_UNAVAILABLE,
						headers: { "cache-control": "no-store" },
					},
				);
			},
		},
	},
});
