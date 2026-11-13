import { useState } from "react";
import { logout } from "@/lib/api/auth";
import { logError } from "@/lib/error-logger";
import { recordAudit } from "@/lib/observability/audit";

/**
 * Shared logout flow for the admin shell: calls the CSRF-protected logout
 * endpoint (which also invalidates the refresh cookie) and then hard-navigates
 * to the public site so every client store resets. `isLoggingOut` guards
 * against duplicate clicks.
 */
export function useLogout() {
	const [isLoggingOut, setIsLoggingOut] = useState(false);

	const handleLogout = async () => {
		if (isLoggingOut) return;
		setIsLoggingOut(true);
		try {
			await logout();
			recordAudit("auth.signout", "success");
		} catch (err) {
			recordAudit("auth.signout", "failure");
			logError(err, { scope: "auth.signout" });
		} finally {
			window.location.href = "/";
		}
	};

	return { isLoggingOut, handleLogout };
}
