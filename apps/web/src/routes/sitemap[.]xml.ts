import { createFileRoute } from "@tanstack/react-router";

const HTTP_OK = 200;
const SECONDS_PER_HOUR = 3_600;

/** Public, indexable routes — private screens are excluded on purpose. */
const SITEMAP_PATHS = ["/", "/courses", "/tests", "/groups", "/how-it-works"];

const SITEMAP_HEADER =
	'<?xml version="1.0" encoding="UTF-8"?>\n' +
	'<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
const SITEMAP_FOOTER = "</urlset>";

/**
 * Served from the request origin so the file always lists the host the crawler
 * actually reached, regardless of deploy environment.
 */
export const Route = createFileRoute("/sitemap.xml")({
	server: {
		handlers: {
			GET: ({ request }) => {
				const origin = new URL(request.url).origin;
				const entries = SITEMAP_PATHS.map(
					(path) => `  <url><loc>${origin}${path}</loc></url>`,
				).join("\n");
				const xml = `${SITEMAP_HEADER}\n${entries}\n${SITEMAP_FOOTER}\n`;
				return new Response(xml, {
					status: HTTP_OK,
					headers: {
						"content-type": "application/xml; charset=utf-8",
						"cache-control": `public, max-age=${SECONDS_PER_HOUR}`,
					},
				});
			},
		},
	},
});
