/**
 * Basic uptime monitoring. The readiness probe reports every observation here,
 * but only a change of state is emitted, so a monitor polling through a long
 * outage produces one record at the start and one on recovery instead of a log
 * line per poll. Availability is remembered per worker instance, which is all a
 * basic in-process check can promise.
 */
import { type LogFields, logger } from "./logger";
import { reportMessage } from "./sentry";

const UPTIME_SCOPE = "health.uptime";

/** Last observed availability; `undefined` means no baseline has been taken. */
let lastKnownAvailable: boolean | undefined;

/** Announces the transition into downtime or back to health exactly once. */
export function reportAvailability(available: boolean, details: LogFields): void {
	const previous = lastKnownAvailable;
	if (previous === available) return;
	lastKnownAvailable = available;
	// The first observation only sets the baseline; there is no change to report.
	if (previous === undefined) return;
	if (available) {
		logger.info(UPTIME_SCOPE, "Service is reachable again", details);
		reportMessage("Web layer can reach the API again", { scope: UPTIME_SCOPE }, "info");
		return;
	}
	logger.error(UPTIME_SCOPE, "Service became unreachable", details);
	reportMessage("Web layer can no longer reach the API", {
		scope: UPTIME_SCOPE,
	});
}
