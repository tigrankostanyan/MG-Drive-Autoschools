import { AlertOctagon, CalendarDays, FileCheck2, LayoutDashboard, Settings } from "lucide-react";
import type { ProfileTab, TabId } from "./data";

function getTabIcon(id: TabId) {
	switch (id) {
		case "settings":
			return <Settings className="size-4" />;
		case "overview":
			return <LayoutDashboard className="size-4" />;
		case "tests":
			return <FileCheck2 className="size-4" />;
		case "wrong":
			return <AlertOctagon className="size-4" />;
		case "lessons":
			return <CalendarDays className="size-4" />;
	}
}

export function ProfileTabs({
	tabs,
	activeTab,
	onChange,
}: {
	tabs: ProfileTab[];
	activeTab: TabId;
	onChange: (id: TabId) => void;
}) {
	return (
		<div className="border-b border-slate-200/80 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/40 p-2.5 sm:p-3">
			<div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar scroll-smooth">
				{tabs.map((tab) => {
					const isActive = activeTab === tab.id;
					return (
						<button
							type="button"
							key={tab.id}
							onClick={() => onChange(tab.id)}
							className={`group relative flex items-center gap-2 rounded-full px-4 py-2 sm:px-5 sm:py-2.5 text-xs sm:text-sm font-bold transition-all duration-200 whitespace-nowrap cursor-pointer ${
								isActive
									? "bg-primary text-white shadow-md shadow-primary/25"
									: "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/80 dark:hover:bg-slate-800"
							}`}
						>
							<span
								className={`transition-transform duration-200 ${
									isActive ? "text-white scale-110" : "text-slate-400 group-hover:text-slate-600"
								}`}
							>
								{getTabIcon(tab.id)}
							</span>
							<span>{tab.label}</span>
							{tab.badge && (
								<span
									className={`ml-0.5 rounded-full px-2 py-0.5 text-[10px] font-extrabold transition-colors ${
										isActive
											? "bg-white/20 text-white"
											: tab.id === "wrong"
												? "bg-rose-50 text-rose-600"
												: "bg-slate-200/70 text-slate-600"
									}`}
								>
									{tab.badge}
								</span>
							)}
						</button>
					);
				})}
			</div>
		</div>
	);
}
