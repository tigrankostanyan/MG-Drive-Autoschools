import { Check, Copy, Mail, Phone } from "lucide-react";
import { memo } from "react";
import type { UserItem } from "@/lib/api/types";

interface StudentContactRowProps {
	user: UserItem;
	field: "email" | "phone";
	copied: boolean;
	onCopy: (e: React.MouseEvent, text: string | undefined, field: "email" | "phone") => void;
}

export const StudentContactRow = memo(function StudentContactRow({
	user,
	field,
	copied,
	onCopy,
}: StudentContactRowProps) {
	const text = field === "email" ? user.email : user.phone;
	const hasValue = Boolean(text?.trim()) && (field === "email" || text?.trim() !== "—");
	const Icon = field === "email" ? Mail : Phone;

	if (!hasValue) {
		return (
			<div className="flex items-center gap-2 px-2 py-1.5 -mx-2 text-slate-400 dark:text-slate-600">
				<Icon className="size-3.5 shrink-0 text-slate-300 dark:text-slate-600" />
				<span>—</span>
			</div>
		);
	}

	return (
		<button
			type="button"
			onClick={(e) => onCopy(e, text, field)}
			title={
				field === "email"
					? "Սեղմեք էլ․ հասցեն պատճենելու համար"
					: "Սեղմեք հեռախոնահամարը պատճենելու համար"
			}
			className={`group/item flex w-full items-center justify-between gap-2 rounded-xl px-2 py-1.5 -mx-2 text-left transition-all duration-150 cursor-pointer active:scale-[0.99] ${
				copied
					? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-300 dark:ring-emerald-700/50"
					: "text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/60 dark:hover:text-white"
			}`}
		>
			<span className="flex min-w-0 items-center gap-2">
				<Icon
					className={`size-3.5 shrink-0 transition-colors ${
						copied
							? "text-emerald-500 dark:text-emerald-400"
							: "text-slate-300 group-hover/item:text-accent dark:text-slate-600 dark:group-hover/item:text-accent"
					}`}
				/>
				<span className="truncate font-medium">{text}</span>
			</span>
			<span className="shrink-0">
				{copied ? (
					<span className="inline-flex items-center gap-1 rounded-md bg-emerald-100/90 px-1.5 py-0.5 text-[10px] font-bold text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300">
						<Check className="size-3" />
						<span>Պատճենվեց</span>
					</span>
				) : (
					<Copy className="size-3.5 text-slate-300 opacity-0 transition-opacity group-hover/item:opacity-100 group-hover/item:text-slate-500 dark:text-slate-600 dark:group-hover/item:text-slate-300" />
				)}
			</span>
		</button>
	);
});
