import type { TabType } from "@/components/admin/types";
import { TOPBAR_SUBTITLES, TOPBAR_TITLES } from "./topbarLabels";

export function TopbarTitle({ activeTab }: { activeTab: TabType }) {
	return (
		<div>
			<h1
				key={`title-${activeTab}`}
				className="tab-content-enter text-2xl md:text-[28px] font-black tracking-tight text-slate-900 dark:text-white"
			>
				{TOPBAR_TITLES[activeTab]}
			</h1>
			<p className="text-xs text-slate-400 font-medium mt-0.5">{TOPBAR_SUBTITLES[activeTab]}</p>
		</div>
	);
}
