import { useDashboardAnalytics } from "@/hooks/use-dashboard-analytics";
import type { GroupData, RegistrationItem, TestData } from "@/lib/api/types";
import { ActivityChartCard } from "./dashboard/ActivityChartCard";
import { CategoryPieCard } from "./dashboard/CategoryPieCard";
import { QuickActionsCard } from "./dashboard/QuickActionsCard";
import { RegistrationsTableCard } from "./dashboard/RegistrationsTableCard";
import { StatCards } from "./dashboard/StatCards";
import type { TabType } from "./types";

const CATEGORY_UNIT_VALUE = 20;
const CATEGORY_FALLBACK_VALUE = 360;

export function DashboardView({
	stats,
	groups,
	tests,
	registrations,
	onSelectTab,
}: {
	stats: {
		students: number;
		groups: number;
		tests: number;
		questions: number;
		leads: number;
		passRate: string;
	};
	groups: GroupData[];
	tests: TestData[];
	registrations: RegistrationItem[];
	onSelectTab: (tab: TabType) => void;
}) {
	const { analytics, loading: analyticsLoading } = useDashboardAnalytics();
	const activityData = analytics?.activityData || [
		{ date: "Երկ", tests: 0, passes: 0 },
		{ date: "Երք", tests: 0, passes: 0 },
		{ date: "Չրք", tests: 0, passes: 0 },
		{ date: "Հնգ", tests: 0, passes: 0 },
		{ date: "Ուրբ", tests: 0, passes: 0 },
		{ date: "Շբթ", tests: 0, passes: 0 },
		{ date: "Կիր", tests: 0, passes: 0 },
	];
	const categoryData = analytics?.categoryData || [
		{
			name: "Տեսական Խմբեր",
			value: groups.length * CATEGORY_UNIT_VALUE || CATEGORY_FALLBACK_VALUE,
			color: "#044dda",
		},
		{
			name: "Թեստեր",
			value: tests.length * CATEGORY_UNIT_VALUE || CATEGORY_FALLBACK_VALUE,
			color: "#10B981",
		},
		{ name: "Բարդ Հարցեր", value: 120, color: "#F59E0B" },
		{ name: "Նշաններ & Գծանշում", value: 80, color: "#EC4899" },
	];
	const chartsLoading = analyticsLoading && !analytics;
	return (
		<div className="space-y-6">
			<StatCards stats={stats} />
			<div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
				<ActivityChartCard activityData={activityData} loading={chartsLoading} />
				<CategoryPieCard categoryData={categoryData} loading={chartsLoading} />
			</div>
			<div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
				<RegistrationsTableCard registrations={registrations} onSelectTab={onSelectTab} />
				<QuickActionsCard onSelectTab={onSelectTab} />
			</div>
		</div>
	);
}
