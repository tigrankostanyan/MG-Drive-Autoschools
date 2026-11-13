import { useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { buildTabs, type TabId } from "@/components/profile/data";
import { ProfileBanner } from "@/components/profile/ProfileBanner";
import { ProfileSidebar } from "@/components/profile/ProfileSidebar";
import { ProfileTabContent } from "@/components/profile/ProfileTabContent";
import { ProfileTabs } from "@/components/profile/ProfileTabs";
import { useProfileData } from "@/components/profile/useProfile";
import { ProfilePageSkeleton } from "@/components/ui/page-skeleton";
import { useSession } from "@/hooks/use-session";
import { logout } from "@/lib/api/auth";
import { requireAuth } from "@/lib/auth-guard";
import { logger } from "@/lib/observability/logger";
import { privateSeo } from "@/lib/seo";

export const Route = createFileRoute("/profile")({
	beforeLoad: () => requireAuth(),
	validateSearch: (search: Record<string, unknown>): { tab?: TabId } => ({
		tab: (search["tab"] as TabId) || undefined,
	}),
	head: () => privateSeo("Իմ Ռեունդ — MG Drive", "Ձեր անձնական ուսումնական էջը"),
	pendingComponent: ProfilePageSkeleton,
	pendingMs: 0,
	component: ProfilePage,
});

function ProfilePage() {
	const navigate = useNavigate();
	const search = Route.useSearch();
	const [activeTab, setActiveTab] = useState<TabId>(search.tab || "settings");
	const [isLoggingOut, setIsLoggingOut] = useState(false);
	const { user: currentUser } = useSession();
	const queryClient = useQueryClient();
	const { profile, progress, loading, error, reload } = useProfileData();

	useEffect(() => {
		if (search.tab) {
			setActiveTab(search.tab);
		}
	}, [search.tab]);

	// Display-only gate; the admin area is authorized server-side.
	const isAdmin = currentUser?.role === "admin";

	const tabs = useMemo(
		() =>
			buildTabs(
				profile?.stats.passedTests,
				profile?.stats.totalTests,
				profile?.wrongAnswers.length,
			),
		[profile],
	);

	const handleLogout = async () => {
		if (isLoggingOut) return;
		setIsLoggingOut(true);
		try {
			await logout();
			// Clear all user-scoped caches on logout
			queryClient.clear();
			queryClient.invalidateQueries();
		} catch (err) {
			logger.error("profile.logout_failed", "Logout failed", { error: err });
		} finally {
			setIsLoggingOut(false);
			navigate({ to: "/" });
		}
	};

	return (
		<div className="min-h-[100dvh] bg-slate-50/60 dark:bg-slate-950 pb-16">
			<ProfileBanner />

			{/* Main Container */}
			<div className="container -mt-16 sm:-mt-20 relative z-10">
				<div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">
					<ProfileSidebar
						currentUser={currentUser}
						stats={profile?.stats ?? null}
						isAdmin={isAdmin}
						isLoggingOut={isLoggingOut}
						onLogout={handleLogout}
					/>

					{/* Main Tabs Area */}
					<div className="flex-1 min-w-0 w-full">
						<div className="rounded-3xl bg-white dark:bg-slate-900 shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-200/80 dark:border-slate-800 min-h-[680px] flex flex-col overflow-hidden transition-all">
							<ProfileTabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

							{/* Tab Contents */}
							<div className="flex-1 p-5 sm:p-8 lg:p-10 bg-white dark:bg-slate-900">
								<ProfileTabContent
									activeTab={activeTab}
									currentUser={currentUser}
									profile={profile}
									progress={progress}
									loading={loading}
									error={error}
									reload={reload}
								/>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
