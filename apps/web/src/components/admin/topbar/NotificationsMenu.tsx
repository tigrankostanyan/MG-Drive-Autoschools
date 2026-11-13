import { Bell } from "lucide-react";
import type { TabType } from "@/components/admin/types";
import type { RegistrationItem } from "@/lib/api/types";

/** How many recent registrations the dropdown previews before "view all". */
const PREVIEW_LIMIT = 5;

export function NotificationsMenu({
	registrations,
	open,
	onToggle,
	onClose,
	onSelectTab,
}: {
	registrations: RegistrationItem[];
	open: boolean;
	onToggle: () => void;
	onClose: () => void;
	onSelectTab: (tab: TabType) => void;
}) {
	const goToRegistrations = () => {
		onSelectTab("registrations");
		onClose();
	};

	return (
		<div className="relative">
			<button
				type="button"
				onClick={onToggle}
				title="Ծանուցումներ"
				className="relative grid size-10 place-items-center rounded-full border border-slate-200/80 bg-white text-slate-600 shadow-sm transition-all hover:bg-slate-50 hover:text-accent dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
			>
				<Bell className="size-4.5" />
				{registrations.length > 0 && (
					<span className="absolute top-2 right-2 size-2.5 rounded-full bg-rose-500 ring-2 ring-white animate-pulse" />
				)}
			</button>
			{open && (
				<div className="absolute right-0 mt-3 w-80 sm:w-96 rounded-2xl border border-slate-200 bg-white p-4 shadow-xl shadow-slate-900/10 z-50 tab-content-enter dark:border-slate-800 dark:bg-[#111622]">
					<div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
						<div className="flex items-center gap-2">
							<h4 className="text-sm font-black text-slate-900 dark:text-white">Ծանուցումներ</h4>
							<span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-extrabold text-primary dark:bg-primary/20 dark:text-primary">
								{registrations.length} նոր
							</span>
						</div>
						<button
							type="button"
							onClick={onClose}
							className="text-xs font-semibold text-slate-400 hover:text-slate-600"
						>
							Փակել
						</button>
					</div>
					<div className="mt-3 space-y-2.5 max-h-72 overflow-y-auto">
						{registrations.length === 0 ? (
							<div className="py-6 text-center text-xs text-slate-400">Նոր ծանուցումներ չկան</div>
						) : (
							registrations.slice(0, PREVIEW_LIMIT).map((r) => (
								<button
									type="button"
									key={r.id}
									onClick={goToRegistrations}
									className="flex w-full items-start gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer text-left dark:hover:bg-slate-800/50"
								>
									<div className="size-8 rounded-full bg-primary/10 grid place-items-center text-primary shrink-0 text-xs font-bold dark:bg-primary/20 dark:text-primary">
										{r.name ? r.name[0]?.toUpperCase() : "Հ"}
									</div>
									<div className="flex-1 min-w-0">
										<p className="text-xs font-bold text-slate-900 truncate dark:text-slate-100">
											Նոր գրանցման հայտ: {r.name}
										</p>
										<p className="text-[11px] text-slate-500 truncate">
											{r.phone || r.email || "Հեռախոսահամար"}
										</p>
										<p className="text-[10px] text-slate-400 mt-0.5">Անցնել հայտերի բաժին →</p>
									</div>
								</button>
							))
						)}
					</div>
					<div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-center">
						<button
							type="button"
							onClick={goToRegistrations}
							className="text-xs font-bold text-primary hover:underline"
						>
							Դիտել բոլոր հայտերը ({registrations.length})
						</button>
					</div>
				</div>
			)}
		</div>
	);
}
