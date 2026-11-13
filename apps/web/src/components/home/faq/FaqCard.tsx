import { ChevronDown } from "lucide-react";
import { useState } from "react";

export function FaqCard({ q, a }: { q: string; a: string }) {
	const [open, setOpen] = useState(false);
	return (
		<div
			className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
				open
					? "border-primary/35 bg-blue-50/40 dark:bg-slate-900/90 shadow-sm"
					: "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:border-slate-300 dark:hover:border-slate-700 shadow-xs"
			}`}
		>
			<button
				type="button"
				onClick={() => setOpen(!open)}
				className="w-full flex items-center justify-between p-5 sm:p-5.5 text-left gap-4 cursor-pointer"
			>
				<span
					className={`font-bold text-[14.5px] sm:text-[15.5px] transition-colors leading-snug ${
						open ? "text-primary" : "text-slate-900 dark:text-white"
					}`}
				>
					{q}
				</span>
				<div
					className={`size-8 rounded-full flex items-center justify-center shrink-0 transition-colors ${
						open ? "bg-primary/10 text-primary" : "bg-slate-100 dark:bg-slate-800 text-slate-500"
					}`}
				>
					<ChevronDown
						className={`size-4 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
					/>
				</div>
			</button>
			<div
				className={`grid transition-all duration-300 ease-in-out ${
					open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
				}`}
			>
				<div className="overflow-hidden">
					<p className="px-5 sm:px-5.5 pb-5 text-slate-600 dark:text-slate-300 text-sm leading-relaxed border-t border-slate-100 dark:border-slate-800/80 pt-3.5">
						{a}
					</p>
				</div>
			</div>
		</div>
	);
}
