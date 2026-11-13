import * as Sentry from "@sentry/tanstackstart-react";
import { createFileRoute } from "@tanstack/react-router";

const allowedDsns = [process.env["VITE_SENTRY_DSN"], process.env["SENTRY_DSN"]].filter(
	(dsn): dsn is string => Boolean(dsn),
);

export const Route = createFileRoute("/monitor")({
	server: Sentry.createSentryTunnelRoute({ allowedDsns }),
});
