import { createFileRoute } from "@tanstack/react-router";

const HTTP_OK = 200;
const SECONDS_PER_HOUR = 3_600;

/** Screens */
const DISALLOWED = ["/admin", "/profile", "/auth", "/tests/", "/groups/"];

export const Route = createFileRoute("/robots.txt")({
	server: {
		handlers: {
			GET: ({ request }) => {
				const origin = new URL(request.url).origin;
				const rules = DISALLOWED.map((path) => `Disallow: ${path}`).join("\n");
				const body = [
					"User-agent: *",
					"Allow: /",
					rules,
					"",
					`Sitemap: ${origin}/sitemap.xml`,
					"",
				].join("\n");
				return new Response(body, {
					status: HTTP_OK,
					headers: {
						"content-type": "text/plain; charset=utf-8",
						"cache-control": `public, max-age=${SECONDS_PER_HOUR}`,
					},
				});
			},
		},
	},
});
