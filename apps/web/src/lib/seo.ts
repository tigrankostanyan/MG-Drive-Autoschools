import { env } from "@/lib/env";

export const SITE_NAME = "MG Drive";
export const SITE_TAGLINE = "վարման դպրոց Երևանում";
export const SITE_DESCRIPTION =
	"Ժամանակակից վարման դպրոց Երևանում՝ տեսական խմբեր, քննական թեստեր և գործնական վարման դասեր։";
export const SITE_LOCALE = "hy_AM";
export const SITE_LANG = "hy";
export const DEFAULT_OG_IMAGE = "/images/hero/hero.webp";

export const BUSINESS = {
	streetAddress: "Աբովյան փողոց",
	locality: "Երևան",
	country: "AM",
	telephone: "+374 10 55 44 33",
	email: "info@mgdrive.am",
};

const ABSOLUTE_URL = /^https?:\/\//i;
const TRAILING_SLASHES = /\/+$/;

export function siteOrigin(): string {
	const configured = env.VITE_SITE_URL;
	if (typeof configured === "string" && configured.trim().length > 0) {
		return configured.trim().replace(TRAILING_SLASHES, "");
	}
	return typeof window === "undefined" ? "" : window.location.origin;
}

export function absoluteUrl(path: string): string {
	if (ABSOLUTE_URL.test(path)) return path;
	const normalized = path.startsWith("/") ? path : `/${path}`;
	const origin = siteOrigin();
	return origin ? `${origin}${normalized}` : normalized;
}

interface PageSeoInput {
	title: string;
	description: string;
	path: string;
	image?: string;
	type?: "website" | "article";
}

export function pageSeo(input: PageSeoInput) {
	const url = absoluteUrl(input.path);
	const image = absoluteUrl(input.image ?? DEFAULT_OG_IMAGE);
	const type = input.type ?? "website";
	return {
		meta: [
			{ title: input.title },
			{ name: "description", content: input.description },
			{ property: "og:title", content: input.title },
			{ property: "og:description", content: input.description },
			{ property: "og:type", content: type },
			{ property: "og:url", content: url },
			{ property: "og:image", content: image },
			{ property: "og:site_name", content: SITE_NAME },
			{ property: "og:locale", content: SITE_LOCALE },
			{ name: "twitter:card", content: "summary_large_image" },
			{ name: "twitter:title", content: input.title },
			{ name: "twitter:description", content: input.description },
			{ name: "twitter:image", content: image },
		],
		links: [{ rel: "canonical", href: url }],
	};
}

export function privateSeo(title: string, description: string) {
	return {
		meta: [
			{ title },
			{ name: "description", content: description },
			{ name: "robots", content: "noindex, nofollow" },
		],
	};
}

export function jsonLd(data: unknown) {
	return [{ type: "application/ld+json", children: JSON.stringify(data) }];
}

export function siteJsonLd() {
	const url = absoluteUrl("/");
	return {
		"@context": "https://schema.org",
		"@graph": [
			{
				"@type": "LocalBusiness",
				"@id": `${url}#business`,
				name: SITE_NAME,
				description: SITE_DESCRIPTION,
				url,
				image: absoluteUrl(DEFAULT_OG_IMAGE),
				telephone: BUSINESS.telephone,
				email: BUSINESS.email,
				areaServed: BUSINESS.locality,
				address: {
					"@type": "PostalAddress",
					streetAddress: BUSINESS.streetAddress,
					addressLocality: BUSINESS.locality,
					addressCountry: BUSINESS.country,
				},
			},
			{
				"@type": "WebSite",
				"@id": `${url}#website`,
				name: SITE_NAME,
				url,
				inLanguage: SITE_LANG,
				publisher: { "@id": `${url}#business` },
			},
		],
	};
}

export function faqJsonLd(items: { q: string; a: string }[]) {
	return {
		"@context": "https://schema.org",
		"@type": "FAQPage",
		mainEntity: items.map((item) => ({
			"@type": "Question",
			name: item.q,
			acceptedAnswer: { "@type": "Answer", text: item.a },
		})),
	};
}
