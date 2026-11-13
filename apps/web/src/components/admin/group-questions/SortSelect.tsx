import { ArrowUpDown, Check, ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface SortOption<T extends string = string> {
	value: T;
	label: string;
}

interface SortSelectProps<T extends string = string> {
	options: readonly SortOption<T>[];
	value: T;
	onChange: (value: T) => void;
}

export function SortSelect<T extends string = string>({
	options,
	value,
	onChange,
}: SortSelectProps<T>) {
	const [open, setOpen] = useState(false);
	const ref = useRef<HTMLDivElement>(null);

	useEffect(() => {
		function handleClickOutside(e: MouseEvent) {
			if (ref.current && !ref.current.contains(e.target as Node)) {
				setOpen(false);
			}
		}
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	const activeLabel = options.find((opt) => opt.value === value)?.label || options[0]?.label || "";

	return (
		<div className="relative" ref={ref}>
			<button
				type="button"
				onClick={() => setOpen((prev) => !prev)}
				className="flex items-center gap-2 rounded-2xl border border-slate-200/80 bg-white py-2.5 px-4 text-xs font-bold text-slate-700 shadow-xs outline-none transition-all hover:border-accent hover:shadow-sm focus:border-accent focus:ring-2 focus:ring-accent/15 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
			>
				<ArrowUpDown className="size-3.5 text-slate-400" />
				<span>{activeLabel}</span>
				<ChevronDown
					className={`size-3.5 text-slate-400 transition-transform duration-200 ${
						open ? "rotate-180" : ""
					}`}
				/>
			</button>
			{open && (
				<div className="absolute right-0 top-full z-50 mt-1.5 w-48 overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-1.5 shadow-xl shadow-slate-200/50 dark:border-slate-800 dark:bg-slate-900 dark:shadow-none animate-in fade-in zoom-in-95 duration-100">
					{options.map((opt) => (
						<button
							key={opt.value}
							type="button"
							onClick={() => {
								onChange(opt.value);
								setOpen(false);
							}}
							className={`flex items-center justify-between w-full px-3 py-2 text-xs rounded-xl font-bold transition-all ${
								value === opt.value
									? "bg-accent/10 text-accent dark:bg-accent/20"
									: "text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
							}`}
						>
							<span>{opt.label}</span>
							{value === opt.value && <Check className="size-3.5 text-accent" />}
						</button>
					))}
				</div>
			)}
		</div>
	);
}
