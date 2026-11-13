import type { ProfileStats } from "@/lib/api/profile";
import { getUserImageUrl, pickUserImage } from "@/lib/media";
import { ProfileSidebarActions } from "./ProfileSidebarActions";
import { ProfileSidebarHeader } from "./ProfileSidebarHeader";
import { ProfileSidebarStatsGrid } from "./ProfileSidebarStatsGrid";

export function ProfileSidebar({
	currentUser,
	stats,
	isAdmin,
	isLoggingOut,
	onLogout,
}: {
	currentUser: {
		name?: string;
		email?: string;
		avatar?: string;
		id?: number;
		files?: { id?: number; name: string; ext: string; name_used?: string }[];
	} | null;
	stats: ProfileStats | null;
	isAdmin: boolean;
	isLoggingOut: boolean;
	onLogout: () => void;
}) {
	const displayName = currentUser?.name || "Ուսանող";
	const avgScore = stats?.avgScore ?? 0;
	const passedTests = stats?.passedTests ?? 0;
	const failedTests = stats?.failedTests ?? 0;
	const avatar =
		getUserImageUrl(pickUserImage(currentUser?.files)) || currentUser?.avatar || undefined;

	return (
		<div className="w-full lg:w-[340px] shrink-0 space-y-4">
			{/* User Main Card */}
			<div className="rounded-3xl bg-white dark:bg-slate-900 shadow-[0_4px_20px_-4px_rgba(15,23,42,0.06)] border border-slate-200/80 dark:border-slate-800 overflow-hidden transition-all">
				{/* Profile Card Header with Avatar */}
				<ProfileSidebarHeader
					avatar={avatar}
					displayName={displayName}
					isAdmin={isAdmin}
					avgScore={avgScore}
				/>

				{/* 2x2 Modern Stats Grid */}
				<ProfileSidebarStatsGrid
					stats={stats}
					avgScore={avgScore}
					passedTests={passedTests}
					failedTests={failedTests}
				/>

				{/* Actions */}
				<ProfileSidebarActions isAdmin={isAdmin} isLoggingOut={isLoggingOut} onLogout={onLogout} />
			</div>
		</div>
	);
}
