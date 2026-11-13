/** Focus accent presets shared by all admin fields. */
export const ACCENTS = {
	accent: {
		icon: "group-focus-within:text-accent",
		field: "focus:border-accent focus:ring-accent/10",
	},
	indigo: {
		icon: "text-primary/70",
		field: "focus:border-primary focus:ring-primary/10",
	},
	orange: {
		icon: "text-orange-400",
		field: "focus:border-orange-500 focus:ring-orange-500/10",
	},
	facebook: {
		icon: "group-focus-within:text-[#1877F2]",
		field: "focus:border-[#1877F2] focus:ring-[#1877F2]/10",
	},
	instagram: {
		icon: "group-focus-within:text-[#E4405F]",
		field: "focus:border-[#E4405F] focus:ring-[#E4405F]/10",
	},
} as const;

export type Accent = keyof typeof ACCENTS;

export const LABEL_CLASS =
	"ml-1 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400";
export const FIELD_BASE =
	"w-full rounded-2xl border border-slate-200 bg-slate-50/50 py-3.5 text-sm text-slate-700 outline-none transition-all focus:bg-white focus:ring-4 dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-200 dark:focus:bg-slate-900";
export const FIELD_ERROR =
	"border-red-300 focus:border-red-500 focus:ring-red-500/10 dark:border-red-800";

export function FieldLabel({ id, children }: { id: string; children: string }) {
	return (
		<label htmlFor={id} className={LABEL_CLASS}>
			{children}
		</label>
	);
}

/**
 * Inline field error. Renders nothing without a message, so callers can pass
 * an optional error straight through, and announces itself to screen readers.
 */
export function FieldError({ id, children }: { id: string; children?: string | undefined }) {
	if (!children) return null;
	return (
		<p id={id} role="alert" className="ml-1 text-xs font-semibold text-red-600 dark:text-red-400">
			{children}
		</p>
	);
}

/** ARIA wiring applied to a field control only while it has an error. */
export function errorAttributes(error?: string | undefined, errorId?: string) {
	return error && errorId ? { "aria-invalid": true, "aria-describedby": errorId } : {};
}
