import { Link } from "@tanstack/react-router";
import { ChevronDown, Globe, LogOut, Settings, UserCheck } from "lucide-react";
import { useState } from "react";
import type { TabType } from "@/components/admin/types";
import { useLogout } from "@/hooks/use-logout";
import { getMemoryUser } from "@/lib/api/user-store";

const profileItemClass =
	"flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-600 rounded-xl hover:bg-slate-50 transition-colors dark:text-slate-300 dark:hover:bg-slate-800/50";

export function ProfileMenu({
	open,
	onToggle,
	onClose,
	onSelectTab,
}: {
	open: boolean;
	onToggle: () => void;
	onClose: () => void;
	onSelectTab: (tab: TabType) => void;
}) {
	const { handleLogout } = useLogout();
	const [currentUser] = useState<{
		name: string;
		email: string;
		role?: string;
	} | null>(() => {
		if (typeof window === "undefined") return null;
		const memoryUser = getMemoryUser();
		if (!memoryUser) return null;
		return {
			name: memoryUser.name ?? "",
			email: memoryUser.email ?? "",
			...(memoryUser.role ? { role: memoryUser.role } : {}),
		};
	});

	return (
		<div className="relative">
			<button
				type="button"
				onClick={onToggle}
				className="flex items-center gap-3 rounded-full border border-slate-200/80 bg-white p-1 pr-3 shadow-sm transition-all hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900"
			>
				<div className="grid size-8.5 place-items-center rounded-full bg-[image:var(--gradient-accent)] text-xs font-black text-white shadow-xs">
					{currentUser?.name ? currentUser.name[0]?.toUpperCase() : "?"}
				</div>
				<div className="hidden text-left md:block">
					<p className="text-xs font-extrabold leading-tight text-slate-900 dark:text-white">
						{currentUser?.name || "Անուն չկա"}
					</p>
					<p className="text-[10px] font-semibold text-slate-400">{currentUser?.role ?? "user"}</p>
				</div>
				<ChevronDown className="size-3.5 text-slate-400" />
			</button>
			{open && (
				<div className="absolute right-0 mt-3 w-56 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl shadow-slate-900/10 z-50 tab-content-enter dark:border-slate-800 dark:bg-[#111622]">
					<div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800 mb-1">
						<p className="text-xs font-extrabold text-slate-900 dark:text-white">
							{currentUser?.name || "Անուն չկա"}
						</p>
						<p className="text-[11px] text-slate-400 truncate">{currentUser?.email || ""}</p>
					</div>
					<Link to="/profile" onClick={onClose} className={profileItemClass}>
						<UserCheck className="size-4 text-slate-400" />
						<span>Իմ Պրոֆիլը</span>
					</Link>
					<button
						type="button"
						onClick={() => {
							onSelectTab("settings");
							onClose();
						}}
						className={`w-full ${profileItemClass}`}
					>
						<Settings className="size-4 text-slate-400" />
						<span>Կայքի Կարգավորումներ</span>
					</button>
					<Link to="/" onClick={onClose} className={profileItemClass}>
						<Globe className="size-4 text-slate-400" />
						<span>Դիտել Կայքը</span>
					</Link>
					<div className="border-t border-slate-100 dark:border-slate-800 my-1" />
					<button
						type="button"
						onClick={() => void handleLogout()}
						className="flex w-full items-center gap-2.5 px-3 py-2 text-xs font-semibold text-rose-600 rounded-xl hover:bg-rose-50 transition-colors dark:hover:bg-rose-950/40"
					>
						<LogOut className="size-4" />
						<span>Ելք Համակարգից</span>
					</button>
				</div>
			)}
		</div>
	);
}
