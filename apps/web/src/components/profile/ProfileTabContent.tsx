import { AlertCircle } from "lucide-react";
import type { ProfileData, ProfileProgress } from "@/lib/api/profile";
import type { UserItem } from "@/lib/api/types";
import { AccountSettingsTab } from "./AccountSettingsTab";
import type { TabId } from "./data";
import { LessonsTab } from "./LessonsTab";
import { OverviewTab } from "./OverviewTab";
import { TestsTab } from "./TestsTab";
import { WrongAnswersTab } from "./WrongAnswersTab";

/** Renders the active profile tab, guarding the async load and error states. */
export function ProfileTabContent({
	activeTab,
	currentUser,
	profile,
	progress,
	loading,
	error,
	reload,
}: {
	activeTab: TabId;
	currentUser: UserItem | null;
	profile: ProfileData | null;
	progress: ProfileProgress | null;
	loading: boolean;
	error: string | null;
	reload: () => void;
}) {
	const content = (() => {
		switch (activeTab) {
			case "settings":
				return <AccountSettingsTab currentUser={currentUser} />;
			case "overview":
				return <OverviewTab profile={profile} />;
			case "tests":
				return <TestsTab profile={profile} />;
			case "wrong":
				return <WrongAnswersTab profile={profile} />;
			case "lessons":
				return <LessonsTab groups={progress?.groups ?? []} />;
			default:
				return null;
		}
	})();

	return (
		<>
			{error && (
				<div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3">
					<span className="flex items-center gap-2 text-xs font-bold text-rose-700">
						<AlertCircle className="size-4" />
						Տվյալները բեռնել չհաջողվեց․ {error}
					</span>
					<button
						type="button"
						onClick={reload}
						className="rounded-full bg-rose-600 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-rose-700 cursor-pointer"
					>
						Կրկնել
					</button>
				</div>
			)}
			{loading && !profile ? (
				<div className="flex min-h-[320px] items-center justify-center">
					<span className="text-sm font-bold text-slate-400">Բեռնվում է…</span>
				</div>
			) : (
				content
			)}
		</>
	);
}
