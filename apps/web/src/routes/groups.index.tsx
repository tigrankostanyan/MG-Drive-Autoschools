import { useQuery } from "@tanstack/react-query";
import { createFileRoute, type ErrorComponentProps } from "@tanstack/react-router";
import { AlertTriangle } from "lucide-react";
import { useState } from "react";
import { EmptyState, GroupCard, type MetricItem } from "@/components/learning";
import { Button } from "@/components/ui/button";
import { ListPageSkeleton } from "@/components/ui/page-skeleton";
import { GroupsFilters, GroupsMetrics, GroupsPageHeader } from "@/features/groups/components";
import { useFilteredGroups, useGroupTabs } from "@/features/groups/hooks";
import { useSession } from "@/hooks/use-session";
import { ApiError } from "@/lib/api/client";
import { normalizeError } from "@/lib/api/errors";
import { fetchGroups } from "@/lib/api/groups";
import type { ProfileStats } from "@/lib/api/profile";
import { fetchProfile } from "@/lib/api/profile";
import { requireAccessibleRole } from "@/lib/auth-guard";
import { pageSeo } from "@/lib/seo";

// Query keys
const PROFILE_STATS_QUERY_KEY = ["profile", "stats"] as const;

// Stale time configuration
const STALE_TIME = 60_000; // 1 minute

export const Route = createFileRoute("/groups/")({
	head: () =>
		pageSeo({
			title: "Խմբեր — MG Drive",
			description: "Ընտրեք թեմատիկ խումբը և լրացրեք քննական հարցերը՝ բացատրություններով։",
			path: "/groups",
		}),
	pendingComponent: ListPageSkeleton,
	pendingMs: 0,
	staleTime: STALE_TIME,
	beforeLoad: () => requireAccessibleRole(),
	errorComponent: ({ error, reset }: ErrorComponentProps) => {
		const normalizedError = normalizeError(error);

		let title = "Էջը չհաջողվեց բեռնել";
		let description = "Տեղի է ունեցել սխալ։ Կարող եք թարմացնել էջը կամ վերադառնալ գլխավոր էջ։";

		if (normalizedError.isAuthError && error instanceof ApiError) {
			if (error.message === "kicked_out") {
				title = "Սեշնիկը ձանձալում";
				description = "Ձեր անձնական սեշնիկը այլ հասցում ձանձալվել է։ Խնդրում ենք մտնել նորից։";
			} else {
				title = "Հաստանատիա սխալ";
				description = "Ձեզ դուրս կկանաչվի ավտոմվիզիայով: Խնդրում ենք մտնել նորից։";
			}
		} else if (normalizedError.isNetworkError) {
			title = "Ցանցի կապ չկա";
			description =
				"Ձեր ինտերնետային կապը չեչ կապ ստող սխալ: Խնդրում ենք ստուգել կապը և փորձել կրկին։";
		}

		return (
			<div className="w-full min-h-[calc(100vh-5rem)] bg-slate-50 dark:bg-slate-950 py-12 flex items-center justify-center">
				<EmptyState
					title={title}
					description={description}
					icon={<AlertTriangle className="size-6 stroke-[2]" />}
					action={<Button onClick={reset}>Կրկնել</Button>}
				/>
			</div>
		);
	},
	loader: async () => {
		const res = await fetchGroups();
		return { groups: res.data ?? [] };
	},
	component: GroupsPage,
});

function GroupsPage() {
	const { groups } = Route.useLoaderData();
	const { user } = useSession();
	const [activeTab, setActiveTab] = useState("all");
	const [searchQuery, setSearchQuery] = useState("");

	// Load profile stats via TanStack Query
	const { data: profileData, error: statsError } = useQuery({
		queryKey: PROFILE_STATS_QUERY_KEY,
		queryFn: async () => {
			const res = await fetchProfile();
			return res.stats;
		},
		enabled: !!user,
		staleTime: STALE_TIME,
		refetchOnWindowFocus: false,
	});

	const tabs = useGroupTabs(groups);
	const filteredGroups = useFilteredGroups(groups, tabs, activeTab, searchQuery);

	const stats: ProfileStats = profileData || {
		totalTests: 0,
		passedTests: 0,
		failedTests: 0,
		avgScore: 0,
		progressPercent: 0,
		totalGroups: groups.length,
		completedGroups: 0,
	};

	const metrics: MetricItem[] = [
		{
			value: groups.length,
			unit: "թեմա",
			label: "Ընդհանուր խմբեր",
			description: "Ուսումնական բոլոր բաժինները",
		},
		{
			value: stats.completedGroups ?? 0,
			unit: "խումբ",
			label: "Անցած",
			description: "Հաջողությամբ ավարտվածները",
		},
		{
			value: stats.avgScore ?? 0,
			unit: "%",
			isPercentage: true,
			label: "Միջին արդյունք",
			description: "Ճիշտ պատասխանների միջինը",
		},
	];

	return (
		<div className="relative w-full min-h-[calc(100vh-5rem)] bg-gradient-to-b from-slate-100/80 via-[#f8fafc] to-slate-100/60 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 py-8 sm:py-12 lg:py-14 overflow-hidden">
			{/* Ambient background soft light blurs */}
			<div className="pointer-events-none absolute inset-x-0 top-0 h-96 overflow-hidden">
				<div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[760px] h-[360px] bg-gradient-to-br from-primary/8 via-primary/5 to-primary/8 blur-3xl rounded-full" />
				<div className="absolute top-20 right-10 w-72 h-72 bg-primary/5 blur-3xl rounded-full" />
				<div className="absolute top-40 left-10 w-80 h-80 bg-primary/5 blur-3xl rounded-full" />
			</div>

			<div className="container relative z-10 space-y-7 sm:space-y-8">
				<GroupsPageHeader />

				<GroupsMetrics metrics={metrics} />

				<GroupsFilters
					tabs={tabs}
					activeTab={activeTab}
					searchQuery={searchQuery}
					onTabChange={setActiveTab}
					onSearchChange={setSearchQuery}
				/>

				{statsError && (
					<div className="mb-4 rounded-lg bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 p-4">
						<p className="text-sm text-rose-700 dark:text-rose-300">
							Տվյազի բեռնման սխալ: {normalizeError(statsError).message}
						</p>
					</div>
				)}

				<div className="w-full">
					{filteredGroups.length === 0 ? (
						<EmptyState
							title="Խմբեր չեն գտնվել"
							description={
								searchQuery
									? `«${searchQuery}» հարցումով խմբեր չեն գտնվել։ Փորձեք փոխել որոնման պարամետրը։`
									: "Տվյաթի պահին հասանելի խմբեր չկան։"
							}
							action={
								searchQuery ? (
									<Button
										variant="outline"
										size="sm"
										className="cursor-pointer"
										onClick={() => setSearchQuery("")}
									>
										Մաքրել որոնումը
									</Button>
								) : undefined
							}
						/>
					) : (
						<div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
							{filteredGroups.map((g, i) => (
								<GroupCard key={g.id} group={g} index={i} isLocked={!user} />
							))}
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
