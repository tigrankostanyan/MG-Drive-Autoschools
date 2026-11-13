import { useQuery } from "@tanstack/react-query";
import { createFileRoute, type ErrorComponentProps } from "@tanstack/react-router";
import { AlertTriangle } from "lucide-react";
import { useState } from "react";
import { EmptyState, type MetricItem, TestCard } from "@/components/learning";
import { Button } from "@/components/ui/button";
import { ListPageSkeleton } from "@/components/ui/page-skeleton";
import { TestsFilters, TestsMetrics, TestsPageHeader } from "@/features/tests/components";
import { TEST_TABS, useFilteredTests } from "@/features/tests/hooks";
import { useSession } from "@/hooks/use-session";
import { ApiError } from "@/lib/api/client";
import { normalizeError } from "@/lib/api/errors";
import { fetchGroups } from "@/lib/api/groups";
import type { ProfileStats } from "@/lib/api/profile";
import { fetchProfile } from "@/lib/api/profile";
import { fetchTests } from "@/lib/api/tests";
import { requireAccessibleRole } from "@/lib/auth-guard";
import { pageSeo } from "@/lib/seo";

// Query keys
const PROFILE_STATS_QUERY_KEY = ["profile", "stats"] as const;
const GROUPS_QUERY_KEY = ["groups", "list"] as const;

// Stale time configuration
const STALE_TIME = 60_000; // 1 minute

export const Route = createFileRoute("/tests/")({
	head: () =>
		pageSeo({
			title: "Թեստեր — MG Drive",
			description: "Քննական թեստեր՝ 20 հարց, 30 րոպե, ինչպես իրական քննությանը։",
			path: "/tests",
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
		const res = await fetchTests();
		return { tests: res.data ?? [] };
	},
	component: TestsPage,
});

function TestsPage() {
	const { tests } = Route.useLoaderData();
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

	// Load groups for metrics
	const { data: groupsData } = useQuery({
		queryKey: GROUPS_QUERY_KEY,
		queryFn: async () => {
			const res = await fetchGroups();
			return res.data ?? [];
		},
		staleTime: STALE_TIME,
		refetchOnWindowFocus: false,
	});

	const stats: ProfileStats = profileData || {
		totalTests: tests.length,
		passedTests: 0,
		failedTests: 0,
		avgScore: 0,
		progressPercent: 0,
		totalGroups: groupsData?.length ?? 0,
		completedGroups: 0,
	};

	const filteredTests = useFilteredTests(tests, activeTab, searchQuery);

	const metrics: MetricItem[] = [
		{
			value: tests.length,
			unit: "թեստ",
			label: "Ընդհանուր թեստեր",
			description: "Քննական բոլոր թեստերը",
		},
		{
			value: stats.passedTests ?? 0,
			unit: "թեստ",
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
			<div className="pointer-events-none absolute inset-x-0 top-0 h-96 overflow-hidden">
				<div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[760px] h-[360px] bg-gradient-to-br from-blue-500/8 via-sky-400/6 to-indigo-500/8 blur-3xl rounded-full" />
				<div className="absolute top-20 right-10 w-72 h-72 bg-blue-400/5 blur-3xl rounded-full" />
				<div className="absolute top-40 left-10 w-80 h-80 bg-indigo-400/5 blur-3xl rounded-full" />
			</div>

			<div className="container relative z-10 space-y-7 sm:space-y-8">
				<TestsPageHeader />
				<TestsMetrics metrics={metrics} />
				<TestsFilters
					tabs={TEST_TABS}
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
					{filteredTests.length === 0 ? (
						<EmptyState
							title="Թեստեր չեն գտնվել"
							description={
								searchQuery
									? `«${searchQuery}» հարցումով թեստեր չեն գտնվել։ Փորձեք փոխել որոնման պարամետրը։`
									: "Տվյալ պահին հասանելի թեստեր չկան։"
							}
							action={
								searchQuery ? (
									<Button
										variant="outline"
										size="sm"
										className="cursor-pointer"
										onClick={() => setSearchQuery("")}
									>
										Մաքրել որոնմանը
									</Button>
								) : undefined
							}
						/>
					) : (
						<div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
							{filteredTests.map((test, i) => (
								<TestCard key={test.id} test={test} index={i} isLocked={!user} />
							))}
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
