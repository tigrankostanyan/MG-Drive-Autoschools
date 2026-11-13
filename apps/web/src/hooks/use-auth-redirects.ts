import { useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { getKnownUser, getSessionUser } from "@/lib/auth-guard";
import { subscribeSessionChange } from "@/lib/cross-tab";

// Navigation side-effects of the login page
export function useAuthRedirects(_setError: (message: string) => void) {
	const navigate = useNavigate();

	useEffect(() => {
		const abortController = new AbortController();
		const leaveIfSignedIn = () => {
			if (!abortController.signal.aborted && getKnownUser()) navigate({ to: "/" });
		};
		leaveIfSignedIn();
		void (async () => {
			const user = await getSessionUser();
			if (!abortController.signal.aborted && user) navigate({ to: "/" });
		})();
		window.addEventListener("auth-change", leaveIfSignedIn);
		const unsubscribe = subscribeSessionChange(leaveIfSignedIn);
		return () => {
			abortController.abort();
			window.removeEventListener("auth-change", leaveIfSignedIn);
			unsubscribe();
		};
	}, [navigate]);
}
