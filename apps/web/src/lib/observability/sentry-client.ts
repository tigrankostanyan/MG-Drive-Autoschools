import * as Sentry from "@sentry/tanstackstart-react";

const TUNNEL_PATH = "/monitor";
const TRACES_SAMPLE_RATE = 0.1;

type Router = Parameters<typeof Sentry.tanstackRouterBrowserTracingIntegration>[0];

export function initializeClientSentry(router: Router): void {
	const dsn = import.meta.env["VITE_SENTRY_DSN"];
	if (!dsn) return;
	const environment = import.meta.env["VITE_SENTRY_ENVIRONMENT"];
	Sentry.init({
		dsn,
		tunnel: TUNNEL_PATH,
		tracesSampleRate: TRACES_SAMPLE_RATE,
		integrations: [Sentry.tanstackRouterBrowserTracingIntegration(router)],
		dataCollection: { userInfo: false },
		...(environment ? { environment } : {}),
	});
}
