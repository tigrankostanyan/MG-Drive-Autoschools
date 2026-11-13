import { createFileRoute, useLoaderData } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
import { AboutUs } from "@/components/home/AboutUs";
import { FAQ_DATA } from "@/components/home/faq/data";
import { Hero } from "@/components/home/Hero";
import { Program } from "@/components/home/Program";
import { Steps } from "@/components/home/Steps";
import { HomePageSkeleton } from "@/components/ui/page-skeleton";
import { getHeroSetting } from "@/lib/api/hero-setting";
import { faqJsonLd, jsonLd, pageSeo, SITE_NAME, SITE_TAGLINE } from "@/lib/seo";

const Gallery = lazy(() =>
	import("@/components/home/Gallery").then((m) => ({ default: m.Gallery })),
);
const Testimonials = lazy(() =>
	import("@/components/home/Testimonials").then((m) => ({ default: m.Testimonials })),
);
const Faq = lazy(() => import("@/components/home/Faq").then((m) => ({ default: m.Faq })));
const ContactUs = lazy(() =>
	import("@/components/home/ContactUs").then((m) => ({ default: m.ContactUs })),
);

const FAQ_ITEMS = Object.values(FAQ_DATA).flat();

const HOME_SEO = pageSeo({
	title: `${SITE_NAME} — ${SITE_TAGLINE}`,
	description:
		"Ժամանակակից վարման դպրոց՝ տեսական խմբեր, քննական թեստեր և գործնական վարման դասեր Երևանում։",
	path: "/",
	image: "/hero.webp",
});

export const Route = createFileRoute("/")({
	pendingComponent: HomePageSkeleton,
	pendingMs: 0,
	head: () => ({
		meta: HOME_SEO.meta,
		links: [
			// Above-the-fold LCP image: fetch it early, WebP-first.
			...HOME_SEO.links,
			{
				rel: "preload",
				as: "image",
				href: "/hero-mobile.webp",
				type: "image/webp",
				media: "(max-width: 767px)",
				fetchPriority: "high",
			},
			{
				rel: "preload",
				as: "image",
				href: "/hero.webp",
				type: "image/webp",
				media: "(min-width: 768px)",
				fetchPriority: "high",
			},
		],
		scripts: jsonLd(faqJsonLd(FAQ_ITEMS)),
	}),
	loader: async () => {
		try {
			const heroRes = await getHeroSetting();
			return { hero: heroRes.data };
		} catch {
			return { hero: null };
		}
	},
	component: Index,
});

function Index() {
	const { hero } = useLoaderData({ from: "/" });

	return (
		<div>
			<Hero data={hero} />
			<Steps />
			<AboutUs />
			<Program />
			<Suspense fallback={null}>
				<Gallery />
				<Testimonials />
				<Faq />
				<ContactUs />
			</Suspense>
		</div>
	);
}
