import type { ProfileData } from "@/lib/api/profile";
import { TestsTabHistoryTable } from "./TestsTabHistoryTable";
import { TestsTabStatsGrid } from "./TestsTabStatsGrid";

export function TestsTab({ profile }: { profile: ProfileData | null }) {
	const stats = profile?.stats;
	const testResults = profile?.results ?? [];

	return (
		<div className="animate-in fade-in slide-in-from-bottom-3 duration-500 space-y-8">
			<TestsTabStatsGrid stats={stats} />

			<TestsTabHistoryTable testResults={testResults} />
		</div>
	);
}
