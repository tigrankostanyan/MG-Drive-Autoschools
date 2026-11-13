import { createIsomorphicFn } from "@tanstack/react-start";
import { fetchMe } from "./api/auth";
import { parseJson, sessionResponseSchema } from "./api/schemas";
import type { UserItem } from "./api/types";
import { getMemoryUser } from "./api/user-store";
import type { AuthUser, AuthUserInput, SessionResult, UserRole } from "./auth-types";

const HTTP_UNAUTHORIZED = 401;
const HTTP_FORBIDDEN = 403;

const USER_ROLES: readonly string[] = ["user", "student", "teacher", "admin"];

const SESSION_COOKIE_RE = /(?:^|;\s*)session_token=/;

export function normalizeUser(user: AuthUserInput | null | undefined): AuthUser | null {
	if (!user || typeof user.id !== "number") return null;
	const role =
		typeof user.role === "string" && USER_ROLES.includes(user.role)
			? (user.role as UserRole)
			: "user";
	return {
		id: user.id,
		name: user.name ?? "",
		email: user.email ?? "",
		role,
		...(user.phone ? { phone: user.phone } : {}),
		...(typeof user.isPaid === "boolean" ? { isPaid: user.isPaid } : {}),
		...(user.studentGroup ? { studentGroup: user.studentGroup } : {}),
		...(user.avatar ? { avatar: user.avatar } : {}),
		...(user.files ? { files: user.files } : {}),
	};
}

export function getKnownUser(): AuthUser | null {
	if (typeof window === "undefined") return null;
	return normalizeUser(getMemoryUser());
}

export function clientContextHeaders(inbound: Headers): Record<string, string> {
	const headers: Record<string, string> = {};
	const userAgent = inbound.get("user-agent");
	if (userAgent) headers["user-agent"] = userAgent;
	const forwardedFor = inbound.get("x-forwarded-for");
	if (forwardedFor) headers["x-forwarded-for"] = forwardedFor;
	const realIp = inbound.get("x-real-ip");
	if (realIp) headers["x-real-ip"] = realIp;
	return headers;
}

export const verifySession = createIsomorphicFn()
	.server(async (): Promise<SessionResult> => {
		try {
			const { getRequest, getRequestUrl } = await import("@tanstack/react-start/server");
			const inbound = getRequest().headers;
			const cookie = inbound.get("cookie") ?? "";
			if (!cookie) return { status: "none" };
			const hasSessionCookie = SESSION_COOKIE_RE.test(cookie);
			const forwarded = clientContextHeaders(inbound);
			const origin = getRequestUrl({
				xForwardedProto: true,
				xForwardedHost: true,
			}).origin;
			const apiUrl = process.env["API_URL"] ?? origin;
			const bases = [...new Set([apiUrl, origin])].filter((base): base is string => Boolean(base));
			let rejected = false;
			for (const base of bases) {
				try {
					const res = await fetch(`${base}/api/v1/user/me`, {
						headers: { cookie, accept: "application/json", ...forwarded },
					});
					if (!res.ok) {
						if (res.status === HTTP_UNAUTHORIZED || res.status === HTTP_FORBIDDEN) rejected = true;
						continue;
					}
					const json = await parseJson<{ user?: UserItem | null }>(res, sessionResponseSchema);
					const user = normalizeUser(json.user);
					if (user) return { status: "ok", user };
					rejected = true;
				} catch {
					// Try the next base, then fall through to "unknown".
				}
			}
			return rejected && hasSessionCookie ? { status: "expired" } : { status: "none" };
		} catch {
			return { status: "none" };
		}
	})
	.client(async (): Promise<SessionResult> => {
		// Fast path: this tab's own value already says it is signed in.
		const known = getKnownUser();
		if (known) return { status: "ok", user: known };
		try {
			// Same request path as the UI, so router and UI never disagree.
			const { data } = await fetchMe();
			const user = normalizeUser(data);
			if (user) return { status: "ok", user };
		} catch {
			// Fall through — an unreachable API is not proof of a live session.
		}
		return { status: "none" };
	});

export async function getSession(): Promise<SessionResult> {
	return verifySession();
}

export async function getSessionUser(): Promise<AuthUser | null> {
	const session = await getSession();
	return session.status === "ok" ? session.user : null;
}
