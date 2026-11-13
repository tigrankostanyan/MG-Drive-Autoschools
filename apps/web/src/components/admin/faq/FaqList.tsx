import { Edit2, Trash2 } from "lucide-react";
import type { FaqItemData } from "@/lib/api/types";

export function FaqList({
	faqs,
	editingId,
	saving,
	onEdit,
	onDelete,
}: {
	faqs: FaqItemData[];
	editingId: number | null;
	saving: boolean;
	onEdit: (faq: FaqItemData) => void;
	onDelete: (id: number) => void;
}) {
	return (
		<div className="space-y-3">
			{faqs.length === 0 ? (
				<div className="rounded-3xl border border-slate-200/80 bg-white py-12 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900/60">
					<p className="text-sm font-medium text-slate-500">Հարցեր չեն գտնվել:</p>
				</div>
			) : (
				faqs.map((faq) => (
					<div
						key={faq.id}
						className={`rounded-2xl border bg-white p-4 transition-colors dark:bg-slate-900/60 ${
							editingId === faq.id
								? "border-accent shadow-sm"
								: "border-slate-200/80 dark:border-slate-800 hover:border-slate-300"
						}`}
					>
						<div className="flex items-start justify-between gap-4">
							<div className="flex-1">
								<div className="flex items-center gap-2 mb-1.5">
									<span className="inline-flex rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-500 dark:bg-slate-800">
										{faq.category || "Ընդհանուր"}
									</span>
								</div>
								<h4 className="font-bold text-slate-900 dark:text-white text-sm">{faq.question}</h4>
								<p className="mt-2 text-xs text-slate-500 leading-relaxed whitespace-pre-wrap line-clamp-3">
									{faq.answer}
								</p>
							</div>
							<div className="flex items-center gap-1.5 shrink-0">
								<button
									type="button"
									onClick={() => onEdit(faq)}
									disabled={saving}
									title="Խմբագրել"
									aria-label="Խմբագրել հարցը"
									className="grid size-8 place-items-center rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 disabled:opacity-50 dark:bg-slate-800 dark:text-slate-300 transition-colors"
								>
									<Edit2 className="size-3.5" />
								</button>
								<button
									type="button"
									onClick={() => onDelete(faq.id)}
									disabled={saving}
									title="Ջնջել"
									aria-label="Ջնջել հարցը"
									className="grid size-8 place-items-center rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 disabled:opacity-50 dark:bg-rose-950/40 dark:text-rose-400 transition-colors"
								>
									<Trash2 className="size-3.5" />
								</button>
							</div>
						</div>
					</div>
				))
			)}
		</div>
	);
}
