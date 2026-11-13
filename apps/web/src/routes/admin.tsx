import { createFileRoute, useLoaderData, useNavigate, useSearch } from "@tanstack/react-router";
import { Suspense } from "react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminPendingComponent, TabSkeleton } from "@/components/admin/AdminSkeletons";
import { AdminTabContent } from "@/components/admin/AdminTabContent";
import { AdminTopbar } from "@/components/admin/AdminTopbar";
import type { TabType } from "@/components/admin/types";
import { useAdminPanel } from "@/hooks/use-admin-panel";
import { fetchAdminBootstrap } from "@/lib/api/admin-bootstrap";
import { requireAuth } from "@/lib/auth-guard";
import { privateSeo } from "@/lib/seo";

const TAB_KEYS: TabType[] = [
	"dashboard",
	"student-analytics",
	"student-groups",
	"tests",
	"groups",
	"students",
	"registrations",
	"faq",
	"settings",
];

type AdminSearch = { tab?: TabType };

function parseTab(value: unknown): TabType {
	return typeof value === "string" && (TAB_KEYS as readonly string[]).includes(value)
		? (value as TabType)
		: "dashboard";
}

export const Route = createFileRoute("/admin")({
	beforeLoad: () => requireAuth({ requireRole: ["admin"] }),
	validateSearch: (search: Record<string, unknown>): AdminSearch => ({
		tab: parseTab(search["tab"]),
	}),
	head: () =>
		privateSeo(
			"Ադմին Վահանակ — MG Drive",
			"MG Drive վարման դպրոցի կառավարման ժամանակակից համկանարգ",
		),
	loader: () => fetchAdminBootstrap(),
	pendingComponent: AdminPendingComponent,
	component: AdminPage,
});

function AdminPage() {
	const { tab } = useSearch({ from: "/admin" });
	const navigate = useNavigate();
	const activeTab: TabType = tab ?? "dashboard";

	const selectTab = (next: TabType) => {
		void navigate({ to: "/admin", search: (prev) => ({ ...prev, tab: next }) });
	};

	const panel = useAdminPanel(useLoaderData({ from: "/admin" }));

	return (
		<div className="min-h-screen w-full flex flex-col md:flex-row bg-[#F4F7FE] text-slate-900 dark:bg-[#0B0F17] dark:text-slate-100 antialiased selection:bg-accent/100 selection:text-white">
			<AdminSidebar
				activeTab={activeTab}
				onSelectTab={selectTab}
				groups={panel.groups}
				tests={panel.tests}
				students={panel.students}
				registrations={panel.registrations}
				studentGroups={panel.studentGroups}
				menuItems={panel.menuItems}
				onMenuItemsChange={panel.setMenuItems}
			/>
			<div className="flex-1 min-h-screen flex flex-col w-full min-w-0 bg-[#F4F7FE] dark:bg-[#0B0F17]">
				<AdminTopbar
					activeTab={activeTab}
					onSelectTab={selectTab}
					registrations={panel.registrations}
				/>
				<main className="flex-1 p-6 md:p-10 overflow-y-auto space-y-6">
					<Suspense fallback={<TabSkeleton tab={activeTab} />}>
						<div key={activeTab} className="tab-content-enter space-y-6">
							<AdminTabContent tab={activeTab} panel={panel} onSelectTab={selectTab} />
						</div>
					</Suspense>
				</main>
			</div>
		</div>
	);
}
