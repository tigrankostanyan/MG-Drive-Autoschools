import type { TabType } from "./types";

const SIDEBAR_SKELETON_KEYS = [
	"nav-1",
	"nav-2",
	"nav-3",
	"nav-4",
	"nav-5",
	"nav-6",
	"nav-7",
	"nav-8",
	"nav-9",
];
const STAT_SKELETON_KEYS = ["stat-1", "stat-2", "stat-3", "stat-4"];

/** Full-page skeleton shown while the `/admin` loader resolves. */
export function AdminPendingComponent() {
	return (
		<div className="min-h-screen w-full flex flex-col md:flex-row bg-[#F4F7FE] text-slate-900 dark:bg-[#0B0F17] dark:text-slate-100 antialiased">
			<aside className="hidden md:flex w-20 lg:w-64 bg-white dark:bg-[#0B0F17] border-r border-slate-200 dark:border-slate-800 min-h-screen flex-col shrink-0">
				<div className="p-4 border-b border-slate-200 dark:border-slate-800">
					<div className="h-9 bg-slate-200 dark:bg-slate-800 rounded-xl animate-pulse" />
				</div>
				<div className="flex-1 p-3 space-y-2">
					{SIDEBAR_SKELETON_KEYS.map((key) => (
						<div
							key={key}
							className="h-11 bg-slate-200/80 dark:bg-slate-800/60 rounded-2xl animate-pulse"
						/>
					))}
				</div>
			</aside>
			<div className="flex-1 min-h-screen flex flex-col w-full min-w-0 bg-[#F4F7FE] dark:bg-[#0B0F17]">
				<div className="h-16 bg-white dark:bg-[#0B0F17] border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-6 md:px-10">
					<div className="h-9 w-44 bg-slate-200 dark:bg-slate-800 rounded-xl animate-pulse" />
					<div className="size-9 rounded-full bg-slate-200 dark:bg-slate-800 animate-pulse" />
				</div>
				<main className="flex-1 p-6 md:p-10 overflow-y-auto">
					<TabSkeleton tab="dashboard" />
				</main>
			</div>
		</div>
	);
}

/** Skeleton matching the tab that is currently being code-split in. */
export function TabSkeleton({ tab }: { tab: TabType }) {
	if (tab === "dashboard") {
		return (
			<div className="space-y-6">
				<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
					{STAT_SKELETON_KEYS.map((key) => (
						<div
							key={key}
							className="h-36 bg-white dark:bg-slate-900/60 rounded-3xl animate-pulse"
						/>
					))}
				</div>
				<div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
					<div className="h-80 bg-white dark:bg-slate-900/60 rounded-3xl animate-pulse lg:col-span-2" />
					<div className="h-80 bg-white dark:bg-slate-900/60 rounded-3xl animate-pulse" />
				</div>
			</div>
		);
	}
	return (
		<div className="space-y-6">
			<div className="h-10 w-64 bg-white dark:bg-slate-900/60 rounded-xl animate-pulse" />
			<div className="h-72 bg-white dark:bg-slate-900/60 rounded-3xl animate-pulse" />
			<div className="h-40 bg-white dark:bg-slate-900/60 rounded-3xl animate-pulse" />
		</div>
	);
}
