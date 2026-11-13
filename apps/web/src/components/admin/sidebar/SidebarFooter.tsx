import { Link } from "@tanstack/react-router";
import { HelpCircle, LogOut, Settings } from "lucide-react";
import type { TabType } from "@/components/admin/types";
import { useLogout } from "@/hooks/use-logout";

export function SidebarFooter({
	activeTab,
	onSelectTab,
}: {
	activeTab: TabType;
	onSelectTab: (tab: TabType) => void;
}) {
	const { handleLogout } = useLogout();
	return (
		<div className="pt-6 border-t border-slate-100 dark:border-slate-800 space-y-1">
			<Link
				to="/how-it-works"
				className="flex items-center gap-3.5 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-colors dark:text-slate-400 dark:hover:bg-slate-800/60"
			>
				<HelpCircle className="size-4.5 text-slate-400" />
				<span>Օգնության Կենտրոն</span>
			</Link>
			<button
				type="button"
				onClick={() => onSelectTab("settings")}
				className={`flex w-full items-center gap-3.5 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-colors ${
					activeTab === "settings"
						? "bg-primary text-white shadow-md shadow-primary/25"
						: "text-slate-500 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/60"
				}`}
			>
				<Settings
					className={`size-4.5 ${activeTab === "settings" ? "text-white" : "text-slate-400"}`}
				/>
				<span>Կարգավորումներ</span>
			</button>
			<button
				type="button"
				onClick={() => void handleLogout()}
				className="flex w-full items-center gap-3.5 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-slate-500 hover:bg-rose-50 hover:text-rose-600 transition-colors dark:text-slate-400 dark:hover:bg-rose-950/40"
			>
				<LogOut className="size-4.5 text-slate-400 group-hover:text-rose-600" />
				<span>Ելք (Logout)</span>
			</button>
		</div>
	);
}
