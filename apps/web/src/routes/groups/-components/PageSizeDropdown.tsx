import { Check, ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export interface PageSizeDropdownProps {
	value: number;
	options: number[];
	onChange: (val: number) => void;
}

export function PageSizeDropdown({ value, options, onChange }: PageSizeDropdownProps) {
	const [isOpen, setIsOpen] = useState(false);
	const containerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
				setIsOpen(false);
			}
		}
		function handleKeyDown(event: KeyboardEvent) {
			if (event.key === "Escape") {
				setIsOpen(false);
			}
		}
		document.addEventListener("mousedown", handleClickOutside);
		document.addEventListener("keydown", handleKeyDown);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
			document.removeEventListener("keydown", handleKeyDown);
		};
	}, []);

	return (
		<div className="relative inline-flex items-center text-left" ref={containerRef}>
			<button
				type="button"
				onClick={() => setIsOpen(!isOpen)}
				aria-haspopup="listbox"
				aria-expanded={isOpen}
				className={`h-9 px-3 rounded-xl border text-xs font-semibold inline-flex items-center gap-2 cursor-pointer transition-all shadow-xs ${
					isOpen
						? "border-primary/40 bg-primary/5 text-primary ring-2 ring-primary/20"
						: "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
				}`}
			>
				<span>{value} հարց / էջ</span>
				<ChevronDown
					className={`size-3.5 text-slate-400 dark:text-slate-500 transition-transform duration-200 ${
						isOpen ? "rotate-180 text-primary" : ""
					}`}
				/>
			</button>

			{isOpen && (
				<div
					role="listbox"
					className="absolute right-0 top-full mt-1.5 min-w-[136px] z-50 overflow-hidden rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-1.5 shadow-xl shadow-slate-200/50 dark:shadow-slate-950/60 animate-in fade-in zoom-in-95 duration-100"
				>
					{options.map((s) => {
						const isSelected = s === value;
						return (
							<button
								key={s}
								type="button"
								role="option"
								aria-selected={isSelected}
								onClick={() => {
									onChange(s);
									setIsOpen(false);
								}}
								className={`w-full flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-xl transition-colors text-left cursor-pointer ${
									isSelected
										? "bg-primary/10 text-primary font-bold dark:bg-primary/20"
										: "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/80"
								}`}
							>
								<span>{s} հարց / էջ</span>
								{isSelected && <Check className="size-3.5 text-primary shrink-0 ml-2" />}
							</button>
						);
					})}
				</div>
			)}
		</div>
	);
}
