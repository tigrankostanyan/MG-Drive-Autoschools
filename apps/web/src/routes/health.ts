import { createFileRoute } from "@tanstack/react-router";

const HTTP_OK = 200;
const MILLISECONDS_PER_SECOND = 1_000;
/**
 * Liveness probe: answers from process memory only, so an uptime monitor can
 * never be misled by a slow dependency. Readiness is a separate route.
 */
export const Route = createFileRoute("/health")({
	server: {
		handlers: {
			GET: () =>
				Response.json(
					{
						status: "ok",
						uptimeSeconds: Math.round(performance.now() / MILLISECONDS_PER_SECOND),
						timestamp: new Date().toISOString(),
					},
					{ status: HTTP_OK, headers: { "cache-control": "no-store" } },
				),
		},
	},
});
