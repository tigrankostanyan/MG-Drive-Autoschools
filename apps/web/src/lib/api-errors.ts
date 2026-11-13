import { ApiError } from "@/lib/api/client";

/**
 * Prefer the server-provided message so 400/403/404 reasons reach the user;
 * fall back to a localized default only when the error carries no detail.
 */
export function serverErrorText(err: unknown, fallback: string): string {
	return err instanceof ApiError && err.message ? err.message : fallback;
}
