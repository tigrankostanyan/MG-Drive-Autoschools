import { Plus, Save, Trash2, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { toast } from "sonner";
import { updateFaqCategories } from "@/lib/api/faq";

const FOCUSABLE =
	'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function FaqCategoriesModal({
	categories,
	onClose,
	onSaved,
}: {
	categories: string[];
	onClose: () => void;
	onSaved: (categories: string[]) => void;
}) {
	const [editingCategories, setEditingCategories] = useState<string[]>([...categories]);
	const [newCategoryName, setNewCategoryName] = useState("");
	const dialogRef = useRef<HTMLDivElement | null>(null);

	// Move focus into the dialog on open and keep Tab focus trapped inside it.
	useEffect(() => {
		const dialog = dialogRef.current;
		if (!dialog) return;
		const getFocusable = () =>
			Array.from(dialog.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
				(el) => el.offsetParent !== null,
			);
		getFocusable()[0]?.focus();

		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Escape") {
				onClose();
				return;
			}
			if (e.key !== "Tab") return;
			const focusable = getFocusable();
			if (focusable.length === 0) return;
			const first = focusable[0];
			const last = focusable[focusable.length - 1];
			if (!first || !last) return;
			const active = document.activeElement;
			if (e.shiftKey && active === first) {
				e.preventDefault();
				last.focus();
			} else if (!e.shiftKey && active === last) {
				e.preventDefault();
				first.focus();
			}
		};

		window.addEventListener("keydown", handleKeyDown);
		const prevOverflow = document.body.style.overflow;
		document.body.style.overflow = "hidden";
		return () => {
			window.removeEventListener("keydown", handleKeyDown);
			document.body.style.overflow = prevOverflow;
		};
	}, [onClose]);

	const addCategory = () => {
		if (newCategoryName.trim() && !editingCategories.includes(newCategoryName.trim())) {
			setEditingCategories([...editingCategories, newCategoryName.trim()]);
			setNewCategoryName("");
		}
	};

	const handleSave = async () => {
		try {
			await updateFaqCategories(editingCategories);
			toast.success("Բաժինները պահպանվեցին");
			onSaved(editingCategories);
		} catch {
			toast.error("Պահպանման սխալ");
		}
	};

	if (typeof document === "undefined") return null;

	return createPortal(
		<div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
			<button
				type="button"
				aria-label="Փակել պատուհանը"
				className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm dark:bg-slate-950/60"
				onClick={onClose}
			/>
			<div
				ref={dialogRef}
				role="dialog"
				aria-modal="true"
				aria-labelledby="faq-categories-title"
				className="relative w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl dark:bg-[#111622] animate-in zoom-in-95 fade-in"
			>
				<div className="flex items-center justify-between mb-6">
					<h3
						id="faq-categories-title"
						className="text-lg font-black tracking-tight text-slate-900 dark:text-white"
					>
						Կարգավորել Բաժինները
					</h3>
					<button
						type="button"
						onClick={onClose}
						aria-label="Փակել"
						className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800"
					>
						<X className="size-5" />
					</button>
				</div>
				<div className="space-y-4">
					<div className="flex items-center gap-2">
						<input
							type="text"
							value={newCategoryName}
							onChange={(e) => setNewCategoryName(e.target.value)}
							aria-label="Նոր բաժնի անվանումը"
							placeholder="Նոր բաժնի անվանումը..."
							className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:border-accent dark:border-slate-800 dark:bg-slate-900/50"
							onKeyDown={(e) => {
								if (e.key === "Enter") {
									addCategory();
								}
							}}
						/>
						<button
							type="button"
							onClick={addCategory}
							aria-label="Ավելացնել բաժին"
							className="rounded-xl bg-[image:var(--gradient-accent)] px-4 py-2.5 text-sm font-bold text-white shadow-md shadow-accent/25 hover:brightness-110"
						>
							<Plus className="size-4" />
						</button>
					</div>
					<div className="max-h-[40vh] overflow-y-auto rounded-xl border border-slate-100 bg-slate-50/50 p-2 dark:border-slate-800/60 dark:bg-slate-900/30 space-y-1">
						{editingCategories.length === 0 ? (
							<p className="py-4 text-center text-sm text-slate-500">Բաժիններ չկան</p>
						) : (
							editingCategories.map((cat, idx) => (
								<div
									key={cat}
									className="flex items-center justify-between rounded-lg bg-white px-3 py-2 shadow-sm border border-slate-200/60 dark:bg-slate-800 dark:border-slate-700/60"
								>
									<span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
										{cat}
									</span>
									<button
										type="button"
										onClick={() =>
											setEditingCategories(editingCategories.filter((_, i) => i !== idx))
										}
										aria-label={`Ջնջել ${cat} բաժինը`}
										className="rounded-lg p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
									>
										<Trash2 className="size-4" />
									</button>
								</div>
							))
						)}
					</div>
					<div className="pt-4 flex justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
						<button
							type="button"
							onClick={onClose}
							className="rounded-xl px-5 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
						>
							Չեղարկել
						</button>
						<button
							type="button"
							onClick={handleSave}
							className="flex items-center gap-2 rounded-xl bg-[image:var(--gradient-accent)] px-6 py-2 text-sm font-bold text-white shadow-md shadow-accent/25 hover:brightness-110"
						>
							<Save className="size-4" />
							Պահպանել
						</button>
					</div>
				</div>
			</div>
		</div>,
		document.body,
	);
}
