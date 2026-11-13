import { createFileRoute } from "@tanstack/react-router";
import { HowItWorksBenefits } from "@/components/home/how-it-works/HowItWorksBenefits";
import { HowItWorksCta } from "@/components/home/how-it-works/HowItWorksCta";
import { HowItWorksStats } from "@/components/home/how-it-works/HowItWorksStats";
import { HowItWorksSteps } from "@/components/home/how-it-works/HowItWorksSteps";
import { ListPageSkeleton } from "@/components/ui/page-skeleton";
import { useSession } from "@/hooks/use-session";
import { pageSeo } from "@/lib/seo";

export const Route = createFileRoute("/how-it-works")({
	pendingComponent: ListPageSkeleton,
	pendingMs: 0,
	head: () =>
		pageSeo({
			title: "Ուսումնական ծրագրեր — MG Drive",
			description:
				"4 պարզ քայլ դեպի վարորդական իրավունք․ գրանցում, տեսություն, պրակտիկա, քննություն։",
			path: "/how-it-works",
		}),
	component: HowItWorksPage,
});

function HowItWorksPage() {
	const { user } = useSession();
	const ctaLink = user ? "/tests" : "/auth";

	return (
		<div className="min-h-screen font-sans selection:bg-primary/20 selection:text-primary bg-white dark:bg-slate-950">
			<HowItWorksSteps ctaLink={ctaLink} />
			<HowItWorksBenefits />
			<HowItWorksStats />
			<HowItWorksCta ctaLink={ctaLink} isAuthenticated={Boolean(user)} />
		</div>
	);
}
