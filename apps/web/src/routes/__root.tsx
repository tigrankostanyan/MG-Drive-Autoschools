import type { QueryClient } from "@tanstack/react-query";
import { createRootRouteWithContext } from "@tanstack/react-router";
import { fetchContactInfo } from "@/lib/api/contact";
import type { ContactItem } from "@/lib/api/types";
import { getSession, type SessionResult } from "@/lib/auth-guard";
import {
	absoluteUrl,
	DEFAULT_OG_IMAGE,
	jsonLd,
	SITE_DESCRIPTION,
	SITE_LOCALE,
	SITE_NAME,
	SITE_TAGLINE,
	siteJsonLd,
} from "@/lib/seo";
import appCss from "../styles.css?url";
import { ErrorComponent } from "./-components/ErrorComponent";
import { NotFoundComponent } from "./-components/NotFoundComponent";
import { RootLayout } from "./-components/RootLayout";
import { RootShell } from "./-components/RootShell";

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{ name: "viewport", content: "width=device-width, initial-scale=1" },
			{ name: "theme-color", content: "#044dda" },
			{ name: "mobile-web-app-capable", content: "yes" },
			{ name: "apple-mobile-web-app-capable", content: "yes" },
			{ name: "apple-mobile-web-app-title", content: "MG Drive" },
			{ title: `${SITE_NAME} — ${SITE_TAGLINE}` },
			{ name: "description", content: SITE_DESCRIPTION },
			{ property: "og:title", content: `${SITE_NAME} — ${SITE_TAGLINE}` },
			{ property: "og:description", content: SITE_DESCRIPTION },
			{ property: "og:type", content: "website" },
			{ property: "og:site_name", content: SITE_NAME },
			{ property: "og:locale", content: SITE_LOCALE },
			{ property: "og:image", content: absoluteUrl(DEFAULT_OG_IMAGE) },
			{ name: "twitter:card", content: "summary_large_image" },
		],
		links: [
			{
				rel: "stylesheet",
				href: appCss,
			},
			{ rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
			{ rel: "manifest", href: "/manifest.json" },
			{ rel: "apple-touch-icon", href: "/icon-192.png" },
		],
		scripts: [
			{
				type: "text/javascript",
				children: `window.deferredPwaPrompt = null; window.addEventListener('beforeinstallprompt', (e) => { e.preventDefault(); window.deferredPwaPrompt = e; window.dispatchEvent(new Event('pwa-prompt-ready')); });`,
			},
			...jsonLd(siteJsonLd()),
		],
	}),

	beforeLoad: async ({ context: { queryClient } }) => {
		const [auth, contactRes] = await Promise.all([
			getSession(),
			fetchContactInfo().catch(() => ({ data: null })),
		]);
		if (contactRes?.data) {
			queryClient.setQueryData(["contact-info"], contactRes.data);
		}
		return { auth, contact: contactRes?.data ?? null };
	},
	shellComponent: RootShell,
	component: RootRouteComponent,
	notFoundComponent: NotFoundComponent,
	errorComponent: ErrorComponent,
});

function RootRouteComponent() {
	const { queryClient, auth, contact } = Route.useRouteContext() as {
		queryClient: QueryClient;
		auth?: SessionResult | undefined;
		contact?: ContactItem | null | undefined;
	};
	return <RootLayout queryClient={queryClient} auth={auth} contact={contact} />;
}
