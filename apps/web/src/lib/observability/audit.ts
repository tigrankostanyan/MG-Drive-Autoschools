/**
 * Audit trail for security-relevant user actions. These are client-reported
 * signals: the backend stays the authority on whether an action was allowed, so
 * only the action and its outcome are recorded here — never credentials, tokens
 * or other personal data.
 */
import { logger } from "./logger";

/** Mirrors `REMOTE_SCOPES` in the transport so records reach the server too. */
const AUDIT_SCOPE = "audit";

export type AuditAction =
	| "auth.signin.password"
	| "auth.signin.mfa"
	| "auth.signin.google"
	| "auth.signout";

export type AuditOutcome = "success" | "failure";

/** Records one auditable action; `scope: "audit"` keeps records filterable. */
export function recordAudit(action: AuditAction, outcome: AuditOutcome): void {
	logger.info(AUDIT_SCOPE, action, { action, outcome });
}
