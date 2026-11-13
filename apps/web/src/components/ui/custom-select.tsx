import { ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export interface CustomSelectProps {
	value: string;
	onChange: (value: string) => void;
	options: { value: string; label: string }[];
	className?: string;
}

export function CustomSelect({ value, onChange, options, className = "" }: CustomSelectProps) {
	const [isOpen, setIsOpen] = useState(false);
	const containerRef = useRef<HTMLDivElement>(null);

	const selectedOption = options.find((o) => o.value === value) || options[0];

	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
				setIsOpen(false);
			}
		}
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	return (
		<div className={`relative inline-block ${className}`} ref={containerRef}>
			<button
				type="button"
				onClick={() => setIsOpen(!isOpen)}
				className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider transition-colors ${
					isOpen
						? "bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200"
						: "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700"
				}`}
			>
				<span>{selectedOption?.label}</span>
				<ChevronDown
					className={`size-3 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
				/>
			</button>

			{isOpen && (
				<div className="absolute top-full left-0 z-50 mt-1.5 flex min-w-[120px] flex-col overflow-hidden rounded-xl border border-slate-200/60 bg-white p-1 shadow-xl shadow-slate-200/50 dark:border-slate-800 dark:bg-slate-900 dark:shadow-none animate-in fade-in zoom-in-95 duration-100">
					{options.map((option) => (
						<button
							key={option.value}
							type="button"
							onClick={() => {
								onChange(option.value);
								setIsOpen(false);
							}}
							className={`flex items-center w-full px-3 py-2 text-left text-[10px] rounded-lg font-bold uppercase tracking-wider transition-all ${
								option.value === value
									? "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400"
									: "text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
							}`}
						>
							{option.label}
						</button>
					))}
				</div>
			)}
		</div>
	);
}
