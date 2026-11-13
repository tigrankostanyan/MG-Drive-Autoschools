import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/auth")({
	beforeLoad: () => {
		if (typeof window !== "undefined") {
			window.sessionStorage.setItem("trigger_auth_modal", "1");
		}
		throw redirect({ to: "/" });
	},
	component: () => null,
});
