import { Phone } from "lucide-react";
import type { TabType } from "@/components/admin/types";
import type { RegistrationItem } from "@/lib/api/types";

const RECENT_REGISTRATIONS_COUNT = 5;

export function RegistrationsTableCard({
	registrations,
	onSelectTab,
}: {
	registrations: RegistrationItem[];
	onSelectTab: (tab: TabType) => void;
}) {
	return (
		<div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/60 lg:col-span-2">
			<div className="flex items-center justify-between pb-4">
				<div>
					<h2 className="text-base font-extrabold text-slate-900 dark:text-white">
						Վերջին Գրանցման Հայտերը
					</h2>
					<p className="text-xs text-slate-400">Կայքից ստացված նոր հայտեր և հաղորդագրություններ</p>
				</div>
				<button
					type="button"
					onClick={() => onSelectTab("registrations")}
					className="text-xs font-bold text-accent hover:text-accent dark:text-accent"
				>
					Դիտել բոլորը ({registrations.length}) →
				</button>
			</div>
			<div className="overflow-x-auto">
				<table className="w-full text-left text-xs">
					<thead>
						<tr className="border-b border-slate-100 text-slate-400 dark:border-slate-800">
							<th className="pb-3 font-semibold">Անուն</th>
							<th className="pb-3 font-semibold">Հեռախոս</th>
							<th className="pb-3 font-semibold">Նպատակ</th>
							<th className="pb-3 font-semibold text-right">Գործողություն</th>
						</tr>
					</thead>
					<tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
						{registrations.slice(0, RECENT_REGISTRATIONS_COUNT).map((reg) => (
							<tr key={reg.id} className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
								<td className="py-3 font-bold text-slate-900 dark:text-white flex items-center gap-2">
									<div className="grid size-7 place-items-center rounded-full bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary font-bold">
										{reg.name.charAt(0).toUpperCase()}
									</div>
									{reg.name}
								</td>
								<td className="py-3 font-medium text-slate-600 dark:text-slate-300">{reg.phone}</td>
								<td className="py-3">
									<span className="rounded-md bg-emerald-50 px-2 py-1 text-[11px] font-bold text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
										{reg.course_type || "Վարման Դասընթաց"}
									</span>
								</td>
								<td className="py-3 text-right">
									<a
										href={`tel:${reg.phone}`}
										className="inline-flex items-center gap-1 rounded-lg bg-accent/10 px-2.5 py-1 font-bold text-accent transition-colors hover:bg-accent/15 dark:bg-accent/20 dark:text-accent"
									>
										<Phone className="size-3" /> Զանգել
									</a>
								</td>
							</tr>
						))}
						{registrations.length === 0 && (
							<tr>
								<td colSpan={4} className="py-8 text-center text-slate-400">
									Նոր հայտեր առայժմ չկան
								</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>
		</div>
	);
}
