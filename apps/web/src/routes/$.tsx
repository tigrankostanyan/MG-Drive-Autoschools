import { createFileRoute, notFound } from "@tanstack/react-router";
import { privateSeo } from "@/lib/seo";
import { NotFoundComponent } from "./-components/NotFoundComponent";

/**
 * Catch-all route: unmatched URLs throw `notFound()` so the server answers with
 * a real 404 status (no soft 404), while the route still supplies its own
 * title/description and keeps the page out of the search index.
 */
export const Route = createFileRoute("/$")({
	beforeLoad: () => {
		throw notFound();
	},
	head: () =>
		privateSeo(
			"Էջը չի գտնվել — MG Drive",
			"Ձեր փնտրած էջը գոյություն չունի կամ տեղափոխվել է։ Վերադարձեք գլխավոր էջ։",
		),
	notFoundComponent: NotFoundComponent,
});
