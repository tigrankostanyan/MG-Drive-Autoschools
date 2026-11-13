import {
	createContext,
	type ReactNode,
	useCallback,
	useContext,
	useEffect,
	useRef,
	useState,
} from "react";
import { createPortal } from "react-dom";

type ConfirmOptions = {
	title?: string;
	description?: string;
	confirmText?: string;
	cancelText?: string;
	type?: "danger" | "warning" | "info";
};

type ConfirmContextType = {
	confirm: (options: ConfirmOptions) => Promise<boolean>;
};

const ConfirmContext = createContext<ConfirmContextType | undefined>(undefined);

export function useConfirm() {
	const context = useContext(ConfirmContext);
	if (!context) {
		throw new Error("useConfirm must be used within a ConfirmDialogProvider");
	}
	return context;
}

export function ConfirmDialogProvider({ children }: { children: ReactNode }) {
	const [open, setOpen] = useState(false);
	const [options, setOptions] = useState<ConfirmOptions>({});
	const pendingRef = useRef<((value: boolean) => void) | null>(null);
	const cancelRef = useRef<HTMLButtonElement | null>(null);

	const settle = useCallback((value: boolean) => {
		setOpen(false);
		const resolve = pendingRef.current;
		pendingRef.current = null;
		resolve?.(value);
	}, []);

	const confirm = (opts: ConfirmOptions) => {
		// A newer confirmation supersedes any dialog still awaiting an answer, so
		// the abandoned promise never stays pending forever.
		settle(false);
		setOptions(opts);
		setOpen(true);
		return new Promise<boolean>((resolve) => {
			pendingRef.current = resolve;
		});
	};

	useEffect(() => {
		if (!open) return;
		cancelRef.current?.focus();
		const onKeyDown = (event: KeyboardEvent) => {
			if (event.key === "Escape") settle(false);
		};
		window.addEventListener("keydown", onKeyDown);
		return () => window.removeEventListener("keydown", onKeyDown);
	}, [open, settle]);

	const isDanger = options.type === "danger" || !options.type;

	return (
		<ConfirmContext.Provider value={{ confirm }}>
			{children}
			{open &&
				typeof document !== "undefined" &&
				createPortal(
					<div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
						<button
							type="button"
							aria-label="Փակել երկխոսությունը"
							className="fixed inset-0 bg-black/40"
							onClick={() => settle(false)}
						/>

						<div
							role="dialog"
							aria-modal="true"
							aria-label={options.title || "Հաստատեք գործողությունը"}
							className="relative w-full max-w-sm rounded-xl bg-white p-6 shadow-2xl dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
						>
							<h3 className="text-lg font-bold text-slate-900 dark:text-white">
								{options.title || "Հաստատեք գործողությունը"}
							</h3>

							<p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
								{options.description || "Համոզվա՞ծ եք, որ ցանկանում եք շարունակել:"}
							</p>

							<div className="mt-6 flex justify-end gap-3">
								<button
									type="button"
									ref={cancelRef}
									className="rounded-lg px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
									onClick={() => settle(false)}
								>
									{options.cancelText || "Չեղարկել"}
								</button>
								<button
									type="button"
									className={`rounded-lg px-4 py-2 text-sm font-semibold text-white ${
										isDanger ? "bg-red-600 hover:bg-red-700" : "bg-blue-600 hover:bg-blue-700"
									}`}
									onClick={() => settle(true)}
								>
									{options.confirmText || "Հաստատել"}
								</button>
							</div>
						</div>
					</div>,
					document.body,
				)}
		</ConfirmContext.Provider>
	);
}
