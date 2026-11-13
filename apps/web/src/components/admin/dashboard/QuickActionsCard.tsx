import { BookOpen, FileCheck, HelpCircle, Plus } from "lucide-react";
import type { TabType } from "@/components/admin/types";

export function QuickActionsCard({ onSelectTab }: { onSelectTab: (tab: TabType) => void }) {
	return (
		<div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/60 flex flex-col justify-between">
			<div>
				<h2 className="text-base font-extrabold text-slate-900 dark:text-white">
					Արագ Գործողություններ
				</h2>
				<p className="text-xs text-slate-400">Ստեղծել նոր նյութեր մեկ սեղմումով</p>
				<div className="mt-4 space-y-3">
					<button
						type="button"
						onClick={() => onSelectTab("groups")}
						className="flex w-full items-center justify-between rounded-2xl border border-slate-200/70 p-3.5 text-left transition-all hover:border-accent hover:shadow-md dark:border-slate-800"
					>
						<div className="flex items-center gap-3">
							<div className="grid size-9 place-items-center rounded-xl bg-accent/10 text-accent dark:bg-accent/20 dark:text-accent">
								<BookOpen className="size-4.5" />
							</div>
							<div>
								<p className="text-xs font-bold text-slate-900 dark:text-white">
									Ավելացնել Տեսական Խումբ
								</p>
								<p className="text-[11px] text-slate-400">Նոր դասախոսություն և թեստային բաժին</p>
							</div>
						</div>
						<Plus className="size-4 text-slate-400" />
					</button>
					<button
						type="button"
						onClick={() => onSelectTab("tests")}
						className="flex w-full items-center justify-between rounded-2xl border border-slate-200/70 p-3.5 text-left transition-all hover:border-accent hover:shadow-md dark:border-slate-800"
					>
						<div className="flex items-center gap-3">
							<div className="grid size-9 place-items-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
								<FileCheck className="size-4.5" />
							</div>
							<div>
								<p className="text-xs font-bold text-slate-900 dark:text-white">
									Ավելացնել Քննական Թեստ
								</p>
								<p className="text-[11px] text-slate-400">20 հարցից բաղկացած քննական տոմս</p>
							</div>
						</div>
						<Plus className="size-4 text-slate-400" />
					</button>
					<button
						type="button"
						onClick={() => onSelectTab("groups")}
						className="flex w-full items-center justify-between rounded-2xl border border-slate-200/70 p-3.5 text-left transition-all hover:border-accent hover:shadow-md dark:border-slate-800"
					>
						<div className="flex items-center gap-3">
							<div className="grid size-9 place-items-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400">
								<HelpCircle className="size-4.5" />
							</div>
							<div>
								<p className="text-xs font-bold text-slate-900 dark:text-white">Ավելացնել Հարց</p>
								<p className="text-[11px] text-slate-400">Նկարով կամ տեքստային հարց</p>
							</div>
						</div>
						<Plus className="size-4 text-slate-400" />
					</button>
				</div>
			</div>
			<div className="mt-6 rounded-2xl bg-gradient-to-br from-blue-50/80 to-primary/5 p-4 dark:from-blue-950/40 dark:to-primary/10">
				<p className="text-xs font-bold text-slate-900 dark:text-white">Անվտանգության Կարգավիճակ</p>
				<p className="mt-1 text-[11px] text-primary/80 dark:text-blue-300/80">
					CSRF պաշտպանությունը ակտիվ է, տվյալների բազայի բոլոր հարցումները գաղտնագրված են։
				</p>
			</div>
		</div>
	);
}
