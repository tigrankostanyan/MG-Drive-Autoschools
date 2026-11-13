import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { createIsomorphicFn, getGlobalStartContext } from "@tanstack/react-start";
import { installGlobalErrorHandlers } from "./lib/global-error-handlers";
import { logger } from "./lib/observability/logger";
import { routeTree } from "./routeTree.gen";

const MINUTE_MS = 60_000;
const QUERY_STALE_TIME_MS = MINUTE_MS;
const QUERY_GC_TIME_MINUTES = 5;
const QUERY_GC_TIME_MS = QUERY_GC_TIME_MINUTES * MINUTE_MS;

const getNonce = createIsomorphicFn()
	.server(() => {
		const context = getGlobalStartContext();
		return context?.nonce as string | undefined;
	})
	.client(() => {
		const meta = document.querySelector("meta[property=csp-nonce]") as HTMLMetaElement | null;
		return meta?.content;
	});

export const getRouter = () => {
	installGlobalErrorHandlers();
	const queryClient = new QueryClient({
		defaultOptions: {
			queries: {
				staleTime: QUERY_STALE_TIME_MS,
				gcTime: QUERY_GC_TIME_MS,
				refetchOnWindowFocus: false,
				retry: 1,
			},
		},
	});
	const nonce = getNonce();
	const router = createRouter({
		routeTree,
		context: { queryClient },
		scrollRestoration: true,
		defaultStaleTime: QUERY_STALE_TIME_MS,
		defaultPreloadStaleTime: QUERY_STALE_TIME_MS,
		defaultPendingMs: 0,
		defaultPendingMinMs: 150,
		...(nonce ? { ssr: { nonce } } : {}),
	});
	// The browser SDK must never be initialised during SSR.
	if (!router.isServer) {
		const init = () =>
			import("./lib/observability/sentry-client")
				.then((m) => m.initializeClientSentry(router))
				.catch((err) => {
					logger.error("sentry.init_failed", "Failed to initialize client SDK", { error: err });
				});
		if (typeof window.requestIdleCallback === "function") {
			window.requestIdleCallback(init, { timeout: 5000 });
		} else {
			window.setTimeout(init, 3000);
		}
	}
	return router;
};
