import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { logger } from "@/lib/observability/logger";

interface BeforeInstallPromptEvent extends Event {
	prompt: () => Promise<void>;
	userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

// Module-level so the event captured at startup is available to any component.
let deferredPrompt: BeforeInstallPromptEvent | null = null;
const listeners = new Set<() => void>();
const notify = () => {
	for (const l of listeners) l();
};

// Extend window to include our custom property
declare global {
	interface Window {
		deferredPwaPrompt: BeforeInstallPromptEvent | null;
	}
}

if (typeof window !== "undefined") {
	// Check if it was already captured by the inline script
	if (window.deferredPwaPrompt) {
		deferredPrompt = window.deferredPwaPrompt;
		notify();
	}

	window.addEventListener("pwa-prompt-ready", () => {
		if (window.deferredPwaPrompt) {
			deferredPrompt = window.deferredPwaPrompt;
			notify();
		}
	});

	window.addEventListener("beforeinstallprompt", (e) => {
		e.preventDefault();
		deferredPrompt = e as BeforeInstallPromptEvent;
		window.deferredPwaPrompt = deferredPrompt;
		notify();
	});
	window.addEventListener("appinstalled", () => {
		deferredPrompt = null;
		window.deferredPwaPrompt = null;
		notify();
	});
}

/** Registers the service worker (production + dev, browser only). */
export function registerServiceWorker() {
	if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;
	const register = () =>
		navigator.serviceWorker.register("/sw.js").catch((err) => {
			logger.error("pwa.sw_registration_failed", "Service worker registration failed", {
				error: err,
			});
		});
	if (document.readyState === "complete") register();
	else window.addEventListener("load", register, { once: true });
}

export function usePwaInstall() {
	const [, force] = useState(0);

	useEffect(() => {
		const l = () => force((n) => n + 1);
		listeners.add(l);
		return () => {
			listeners.delete(l);
		};
	}, []);

	const canInstall = deferredPrompt !== null;

	const install = useCallback(async () => {
		if (!deferredPrompt) {
			toast.info("Ներբեռնման պատուհանը չի կարող բացվել", {
				description:
					"Խնդրում ենք օգտագործել բրաուզերի հասցեի դաշտում գտնվող ներբեռնման կոճակը կամ բրաուզերի մենյուից ընտրել «Install» կամ «Add to Home Screen»։",
				duration: 8000,
			});
			return false;
		}
		const evt = deferredPrompt;
		await evt.prompt();
		const { outcome } = await evt.userChoice;
		deferredPrompt = null;
		notify();
		return outcome === "accepted";
	}, []);

	return { canInstall, install };
}
