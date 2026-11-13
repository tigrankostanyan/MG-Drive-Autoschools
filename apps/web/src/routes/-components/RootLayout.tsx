import { type QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Outlet, useRouterState } from "@tanstack/react-router";
import { lazy, Suspense, useEffect, useState } from "react";
import { AuthModalProvider, useAuthModal } from "@/components/auth/auth-modal-context";
import { AuthKickModal } from "@/components/shared/AuthKickModal";
import { Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";
import { MobileBottomNav } from "@/components/site/MobileBottomNav";
import { ConfirmDialogProvider } from "@/components/ui/confirm-dialog";
import { Toaster } from "@/components/ui/sonner";
import { useLenis } from "@/hooks/use-lenis";
import { registerServiceWorker } from "@/hooks/use-pwa-install";
import { fetchMe } from "@/lib/api/auth";
import type { ContactItem } from "@/lib/api/types";
import { getMemoryUser, markUserReady, setMemoryUser } from "@/lib/api/user-store";
import type { SessionResult } from "@/lib/auth-guard";
import { setSessionUser } from "@/lib/auth-session";
import { env } from "@/lib/env";
import { logger } from "@/lib/observability/logger";
import { connectSessionSSE, disconnectSessionSSE } from "@/lib/sse-client";
import { RouteProgress } from "./RouteProgress";

const { VITE_GOOGLE_CLIENT_ID: GOOGLE_CLIENT_ID } = env;

const LazyAuthModalWithGoogle = lazy(async () => {
	const [{ GoogleOAuthProvider }, { AuthModal }] = await Promise.all([
		import("@react-oauth/google"),
		import("@/components/auth/AuthModal"),
	]);
	return {
		default: function AuthModalWithGoogle() {
			return (
				<GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
					<AuthModal />
				</GoogleOAuthProvider>
			);
		},
	};
});
const LazyChatWidget = lazy(() =>
	import("@/components/site/ChatWidget").then((m) => ({ default: m.ChatWidget })),
);

/** Mounts the auth modal (and Google's script) only after it is first opened. */
function DeferredAuthModal() {
	const { isOpen } = useAuthModal();
	const [hasOpened, setHasOpened] = useState(false);
	useEffect(() => {
		if (isOpen) setHasOpened(true);
	}, [isOpen]);
	if (!hasOpened && !isOpen) return null;
	return (
		<Suspense fallback={null}>
			<LazyAuthModalWithGoogle />
		</Suspense>
	);
}

/** Mounts children only once the browser is idle, keeping them off the critical path. */
function AfterIdle({ children }: { children: React.ReactNode }) {
	const [ready, setReady] = useState(false);
	useEffect(() => {
		if (typeof window.requestIdleCallback === "function") {
			const id = window.requestIdleCallback(() => setReady(true), { timeout: 4000 });
			return () => window.cancelIdleCallback(id);
		}
		const id = window.setTimeout(() => setReady(true), 2500);
		return () => window.clearTimeout(id);
	}, []);
	return ready ? children : null;
}

function AuthModalTriggerListener() {
	const { openAuthModal } = useAuthModal();
	useEffect(() => {
		if (typeof window === "undefined") return;
		if (window.sessionStorage.getItem("trigger_auth_modal") === "1") {
			window.sessionStorage.removeItem("trigger_auth_modal");
			openAuthModal();
		}
		const params = new URLSearchParams(window.location.search);
		if (params.get("auth") === "login") {
			openAuthModal();
			const url = new URL(window.location.href);
			url.searchParams.delete("auth");
			window.history.replaceState({}, "", url.toString());
		}
	}, [openAuthModal]);
	return null;
}

/** Providers, session bootstrap and the site/admin page chrome. */
export function RootLayout({
	queryClient,
	auth: resolvedAuth,
	contact,
}: {
	queryClient: QueryClient;
	auth: SessionResult | undefined;
	contact?: ContactItem | null | undefined;
}) {
	if (contact && !queryClient.getQueryData(["contact-info"])) {
		queryClient.setQueryData(["contact-info"], contact);
	}

	// Absent auth means no session; never dereference it unguarded.
	const auth: SessionResult = resolvedAuth ?? { status: "none" };
	const isAdminRoute = useRouterState({
		select: (s) => s.location.pathname.startsWith("/admin"),
	});
	useLenis({ skip: isAdminRoute });

	useEffect(() => {
		registerServiceWorker();
	}, []);

	// The SSR auth context is read once; seeding must not repeat on re-renders.
	const [initialAuth] = useState(() => auth);

	useEffect(() => {
		// Seed the shared session store from SSR state, then mark it authoritative so
		// consumers stop showing their server-rendered placeholder.
		setMemoryUser(initialAuth.status === "ok" ? initialAuth.user : null);
		markUserReady();

		// Reconcile with the server once if a session exists; this also rotates an expired access token.
		if (initialAuth.status === "ok") {
			fetchMe()
				.then((res) => {
					if (res.data) setSessionUser(res.data);
				})
				.catch((err) => {
					logger.error("session.reconcile_failed", "Failed to reconcile server session", {
						error: err,
					});
				});
		}

		const syncSSE = () => {
			if (getMemoryUser()) connectSessionSSE();
			else disconnectSessionSSE();
		};
		syncSSE();
		window.addEventListener("auth-change", syncSSE);
		return () => window.removeEventListener("auth-change", syncSSE);
	}, [initialAuth]);

	// Route shape selectors; kept narrow so navigation doesn't re-render chrome.
	const isTestRunnerRoute = useRouterState({
		select: (s) => /^\/tests\/[^/]+/.test(s.location.pathname),
	});
	const isGroupDetailRoute = useRouterState({
		select: (s) => /^\/groups\/[^/]+/.test(s.location.pathname),
	});

	return (
		<QueryClientProvider client={queryClient}>
			<ConfirmDialogProvider>
				<AuthModalProvider>
					<a
						href="#main-content"
						className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-white dark:focus:bg-slate-900 focus:p-3 focus:rounded-full focus:ring-2 focus:ring-primary/50 focus:shadow-lg text-sm font-medium text-slate-700 dark:text-slate-200"
					>
						Skip to main content
					</a>
					<RouteProgress />
					<AuthKickModal />
					<DeferredAuthModal />
					<AuthModalTriggerListener />
					{isAdminRoute ? (
						<div className="min-h-screen w-full bg-[#F8FAFC] dark:bg-[#0B0F19] text-slate-900 dark:text-slate-100">
							<main className="w-full min-h-screen">
								<div>
									<Outlet />
								</div>
							</main>
							<Toaster position="bottom-right" richColors />
						</div>
					) : (
						<div className="flex min-h-screen flex-col bg-white">
							<Header
								initialUser={auth.status === "ok" ? auth.user : null}
								initialSessionStatus={auth.status}
							/>
							<main
								id="main-content"
								className={`flex-1 pt-18 sm:pt-20 ${
									isTestRunnerRoute || isGroupDetailRoute
										? "bg-[#F8FAFC] dark:bg-[#0B0F19]"
										: "bg-white"
								}`}
							>
								<div className="animate-in fade-in duration-500">
									<Outlet />
								</div>
							</main>
							{!isTestRunnerRoute && <Footer showCta={!isGroupDetailRoute} />}
							{!isTestRunnerRoute && (
								<MobileBottomNav initialUser={auth.status === "ok" ? auth.user : null} />
							)}
							{!isTestRunnerRoute && (
								<AfterIdle>
									<Suspense fallback={null}>
										<LazyChatWidget />
									</Suspense>
								</AfterIdle>
							)}
							<Toaster position="bottom-right" />
						</div>
					)}
				</AuthModalProvider>
			</ConfirmDialogProvider>
		</QueryClientProvider>
	);
}
