import { Inbox, Loader2, Phone, Trash2 } from "lucide-react";
import { type Dispatch, type SetStateAction, useState } from "react";
import { toast } from "sonner";
import { useConfirm } from "@/components/ui/confirm-dialog";
import { deleteRegistration } from "@/lib/api/registrations";
import type { RegistrationItem } from "@/lib/api/types";
import { serverErrorText } from "@/lib/api-errors";

export function RegistrationsManagerView({
	registrations,
	onChange,
}: {
	registrations: RegistrationItem[];
	onChange: Dispatch<SetStateAction<RegistrationItem[]>>;
}) {
	const { confirm } = useConfirm();
	const [deletingId, setDeletingId] = useState<number | null>(null);

	const handleDelete = async (id: number) => {
		if (deletingId !== null) return;
		const isConfirmed = await confirm({
			title: "Ջնջե՞լ այս հայտը",
			description: "Համոզվա՞ծ եք, որ ցանկանում եք ջնջել այս հայտը:",
			type: "danger",
		});
		if (!isConfirmed) return;
		setDeletingId(id);
		try {
			await deleteRegistration(id);
			toast.success("Հայտը ջնջվեց");
			onChange((prev) => prev.filter((r) => r.id !== id));
		} catch (err) {
			toast.error(serverErrorText(err, "Ջնջման սխալ"));
		} finally {
			setDeletingId(null);
		}
	};
	return (
		<div className="space-y-6">
			<div className="overflow-x-auto rounded-3xl border border-slate-200/80 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900/60">
				<table className="w-full min-w-[640px] text-left text-xs">
					<thead>
						<tr className="border-b border-slate-100 bg-slate-50/50 text-slate-400 dark:border-slate-800 dark:bg-slate-900">
							<th className="py-3.5 pl-6 font-bold">Դիմորդ</th>
							<th className="py-3.5 font-bold">Հեռախոսահամար</th>
							<th className="py-3.5 font-bold">Դասընթաց / Հաղորդագրություն</th>
							<th className="py-3.5 pr-6 text-right font-bold">Գործողություններ</th>
						</tr>
					</thead>
					<tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
						{registrations.map((r) => (
							<tr key={r.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
								<td className="py-4 pl-6">
									<p className="font-extrabold text-slate-900 dark:text-white text-sm">{r.name}</p>
									<p className="text-[11px] text-slate-400">{r.email || "Կայքի գրանցում"}</p>
								</td>
								<td className="py-4 font-mono font-bold text-accent dark:text-accent">{r.phone}</td>
								<td className="py-4 text-slate-600 dark:text-slate-300">
									{r.message || r.course_type || "Վարման դպրոցի ուսուցման գրանցում"}
								</td>
								<td className="py-4 pr-6 text-right">
									<div className="flex items-center justify-end gap-2">
										<a
											href={`tel:${r.phone}`}
											className="inline-flex items-center gap-1 rounded-xl bg-accent/10 px-3 py-1.5 font-bold text-accent hover:bg-accent/15 dark:bg-accent/20 dark:text-accent"
										>
											<Phone className="size-3.5" /> Զանգել
										</a>
										<button
											type="button"
											onClick={() => handleDelete(r.id)}
											disabled={deletingId === r.id}
											aria-label={`Ջնջել ${r.name} հայտը`}
											aria-busy={deletingId === r.id ? true : undefined}
											className="grid size-8 place-items-center rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 disabled:pointer-events-none disabled:opacity-60 dark:bg-rose-950/40 dark:text-rose-400"
										>
											{deletingId === r.id ? (
												<Loader2 className="size-3.5 animate-spin" />
											) : (
												<Trash2 className="size-3.5" />
											)}
										</button>
									</div>
								</td>
							</tr>
						))}
						{registrations.length === 0 && (
							<tr>
								<td colSpan={4} className="py-16">
									<div
										role="status"
										className="flex flex-col items-center gap-3 text-center text-slate-400"
									>
										<Inbox className="size-8" />
										<p className="text-sm font-bold text-slate-500 dark:text-slate-400">
											Նոր հայտեր չկան
										</p>
										<p className="text-xs">Երբ կայքից նոր գրանցում լինի, այն կհայտնվի այստեղ։</p>
									</div>
								</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>
		</div>
	);
}
