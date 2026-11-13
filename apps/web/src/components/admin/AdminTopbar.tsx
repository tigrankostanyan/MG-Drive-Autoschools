import { useState } from "react";
import type { RegistrationItem } from "@/lib/api/types";
import { NotificationsMenu } from "./topbar/NotificationsMenu";
import { ProfileMenu } from "./topbar/ProfileMenu";
import { TopbarSearch } from "./topbar/TopbarSearch";
import { TopbarTitle } from "./topbar/TopbarTitle";
import type { TabType } from "./types";

export function AdminTopbar({
	activeTab,
	onSelectTab,
	registrations,
}: {
	activeTab: TabType;
	onSelectTab: (tab: TabType) => void;
	registrations: RegistrationItem[];
}) {
	const [openMenu, setOpenMenu] = useState<"notifications" | "profile" | null>(null);

	return (
		<header className="sticky top-0 z-20 flex h-20 w-full items-center justify-between border-b border-slate-200/60 bg-[#F4F7FE]/90 px-6 md:px-10 backdrop-blur-xl dark:border-slate-800/80 dark:bg-[#0B0F17]/90">
			<TopbarTitle activeTab={activeTab} />
			<div className="flex items-center gap-3.5">
				<TopbarSearch />
				<NotificationsMenu
					registrations={registrations}
					open={openMenu === "notifications"}
					onToggle={() => setOpenMenu((cur) => (cur === "notifications" ? null : "notifications"))}
					onClose={() => setOpenMenu(null)}
					onSelectTab={onSelectTab}
				/>
				<ProfileMenu
					open={openMenu === "profile"}
					onToggle={() => setOpenMenu((cur) => (cur === "profile" ? null : "profile"))}
					onClose={() => setOpenMenu(null)}
					onSelectTab={onSelectTab}
				/>
			</div>
		</header>
	);
}
