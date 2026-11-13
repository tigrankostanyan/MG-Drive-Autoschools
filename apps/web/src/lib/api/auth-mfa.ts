import { setSessionUser } from "../auth-session";
import { request } from "./client";
import type { AuthResponse } from "./types";

// TOTP MFA endpoints, mirroring apps/server/src/controllers/mfa.js.
export type MfaRequired = { status: "mfa_required"; mfaToken: string };
export type PasswordSignInResult = AuthResponse | MfaRequired;
export type MfaStatus = { enabled: boolean; enrolledAt: string | null };
function applySignedInUser(user: AuthResponse["user"]) {
	setSessionUser(user);
}
export async function signIn(email: string, password: string): Promise<PasswordSignInResult> {
	const res = await request<AuthResponse & { mfaToken?: string; status: string }>("/user/signIn", {
		method: "POST",
		body: JSON.stringify({ email, password }),
	});
	if (res.status === "mfa_required" && res.mfaToken) {
		return { status: "mfa_required", mfaToken: res.mfaToken };
	}
	applySignedInUser(res.user);
	return res;
}
export async function completeMfaChallenge(input: {
	mfaToken: string;
	token?: string;
	recoveryCode?: string;
}): Promise<AuthResponse> {
	const res = await request<AuthResponse>("/auth/mfa/challenge", {
		method: "POST",
		body: JSON.stringify(input),
	});
	applySignedInUser(res.user);
	return res;
}
export async function fetchMfaStatus(): Promise<MfaStatus> {
	const res = await request<MfaStatus>("/user/mfa/status");
	return { enabled: Boolean(res.enabled), enrolledAt: res.enrolledAt ?? null };
}
export async function enrollMfa(): Promise<{
	secret: string;
	otpauthUri: string;
}> {
	return request<{ secret: string; otpauthUri: string }>("/user/mfa/enroll", {
		method: "POST",
		body: JSON.stringify({}),
	});
}
export async function verifyMfaEnrollment(token: string): Promise<{ recoveryCodes: string[] }> {
	return request<{ recoveryCodes: string[] }>("/user/mfa/verify", {
		method: "POST",
		body: JSON.stringify({ token }),
	});
}
export async function disableMfa(password: string, token: string): Promise<void> {
	await request("/user/mfa/disable", {
		method: "POST",
		body: JSON.stringify({ password, token }),
	});
}
