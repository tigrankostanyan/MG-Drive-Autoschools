import type { ProfileData } from "@/lib/api/profile";
import { OverviewTabFeedback } from "./OverviewTabFeedback";
import { OverviewTabHero } from "./OverviewTabHero";
import { OverviewTabTopics } from "./OverviewTabTopics";

export function OverviewTab({ profile }: { profile: ProfileData | null }) {
	const stats = profile?.stats;
	const topics = profile?.completedTopics ?? [];
	const feedback = profile?.feedback ?? null;
	const displayName = profile?.user?.name?.trim() || "ուսանող";

	const allTopicsDone =
		!!stats && stats.totalGroups > 0 && stats.completedGroups >= stats.totalGroups;

	return (
		<div className="animate-in fade-in slide-in-from-bottom-3 duration-500 space-y-8">
			<OverviewTabHero
				progressPercent={stats?.progressPercent ?? 0}
				displayName={displayName}
				allTopicsDone={allTopicsDone}
			/>
			<OverviewTabTopics
				topics={topics}
				completedGroups={stats?.completedGroups ?? 0}
				totalGroups={stats?.totalGroups ?? 0}
			/>
			<OverviewTabFeedback feedback={feedback} />
		</div>
	);
}
