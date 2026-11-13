import { redirect } from "@tanstack/react-router";
import { clearSessionUser } from "./auth-session";
import { getKnownUser, getSessionUser, verifySession } from "./auth-session-resolver";
import type { UserRole } from "./auth-types";

export {
	clientContextHeaders,
	getSession,
	normalizeUser,
} from "./auth-session-resolver";
export type {
	AuthUser,
	AuthUserInput,
	SessionResult,
	UserRole,
} from "./auth-types";
export { getKnownUser, getSessionUser };

interface AuthGuardOptions {
	requireRole?: UserRole[];
}

function denyAccess(): never {
	clearSessionUser();
	throw redirect({ to: "/" });
}

/** Keep already-authenticated users out of login-only routes (e.g. /auth). */
export async function redirectIfAuthenticated() {
	if (getKnownUser()) throw redirect({ to: "/" });
	if (await getSessionUser()) throw redirect({ to: "/" });
}

export async function requireAuth(opts?: AuthGuardOptions) {
	const session = await verifySession();
	if (session.status === "expired") {
		throw redirect({ to: "/" });
	}
	if (session.status === "none") denyAccess();
	const user = session.user;
	if (opts?.requireRole && !opts.requireRole.includes(user.role)) {
		denyAccess();
	}
}

/** Role set allowed to access groups and tests. */
export const ACCESSIBLE_ROLES = ["student", "admin"] as const;

/** Guard: must be authenticated and have the student or admin role. */
export async function requireAccessibleRole() {
	return requireAuth({ requireRole: [...ACCESSIBLE_ROLES] });
}
