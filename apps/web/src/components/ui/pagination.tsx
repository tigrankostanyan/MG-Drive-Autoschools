import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { ELLIPSIS, getPageItems } from "./pagination.utils";

/** Page-size choices offered in the "rows per page" dropdown. */
const ITEMS_PER_PAGE_SMALL = 10;
const ITEMS_PER_PAGE_MEDIUM = 20;
const ITEMS_PER_PAGE_LARGE = 50;
const ITEMS_PER_PAGE_EXTRA_LARGE = 100;
const DEFAULT_ITEMS_PER_PAGE_OPTIONS = [
	ITEMS_PER_PAGE_SMALL,
	ITEMS_PER_PAGE_MEDIUM,
	ITEMS_PER_PAGE_LARGE,
	ITEMS_PER_PAGE_EXTRA_LARGE,
];

interface PaginationProps {
	currentPage: number;
	totalPages: number;
	onPageChange: (page: number) => void;
	itemsPerPage: number;
	onItemsPerPageChange: (size: number) => void;
	itemsPerPageOptions?: number[];
}
export function Pagination({
	currentPage,
	totalPages,
	onPageChange,
	itemsPerPage,
	onItemsPerPageChange,
	itemsPerPageOptions = DEFAULT_ITEMS_PER_PAGE_OPTIONS,
}: PaginationProps) {
	const [isOpen, setIsOpen] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
				setIsOpen(false);
			}
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);
	if (totalPages <= 1) return null;
	return (
		<div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
			<div className="flex items-center gap-3">
				<span className="text-xs font-bold text-slate-500 dark:text-slate-400">
					Ցուցադրել էջում՝
				</span>
				<div className="relative" ref={dropdownRef}>
					<button
						type="button"
						onClick={() => setIsOpen(!isOpen)}
						className="flex items-center justify-between gap-2 min-w-[70px] rounded-xl border border-slate-200/80 bg-white py-1.5 px-3 text-xs font-bold text-slate-700 shadow-sm outline-none transition-all hover:border-accent focus:border-accent focus:ring-2 focus:ring-accent/15 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
					>
						{itemsPerPage}
						{isOpen ? (
							<ChevronUp className="size-3.5 text-slate-400" />
						) : (
							<ChevronDown className="size-3.5 text-slate-400" />
						)}
					</button>
					{isOpen && (
						<div className="absolute bottom-full mb-1 left-0 w-full overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-lg animate-in fade-in slide-in-from-bottom-2 dark:border-slate-800 dark:bg-slate-900 z-50">
							<div className="flex flex-col py-1">
								{itemsPerPageOptions.map((option) => (
									<button
										type="button"
										key={option}
										onClick={() => {
											onItemsPerPageChange(option);
											setIsOpen(false);
										}}
										className={`px-3 py-1.5 text-xs text-left transition-colors ${
											itemsPerPage === option
												? "bg-accent/10 font-extrabold text-accent dark:bg-accent/20"
												: "font-semibold text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800"
										}`}
									>
										{option}
									</button>
								))}
							</div>
						</div>
					)}
				</div>
			</div>
			<div className="flex items-center gap-1.5">
				<button
					type="button"
					onClick={() => onPageChange(currentPage - 1)}
					disabled={currentPage === 1}
					className="grid size-8 place-items-center rounded-full text-slate-500 transition-colors hover:bg-slate-100 disabled:pointer-events-none disabled:opacity-50 dark:text-slate-400 dark:hover:bg-slate-800"
				>
					<ChevronLeft className="size-4" />
				</button>
				{getPageItems(currentPage, totalPages).map(({ key, value }) =>
					value === ELLIPSIS ? (
						<span key={key} className="px-1 text-xs font-bold text-slate-400">
							...
						</span>
					) : (
						<button
							type="button"
							key={key}
							onClick={() => onPageChange(value)}
							className={`grid size-8 place-items-center rounded-full text-xs font-extrabold transition-all ${
								currentPage === value
									? "bg-[image:var(--gradient-accent)] text-white shadow-md shadow-accent/25"
									: "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
							}`}
						>
							{value}
						</button>
					),
				)}
				<button
					type="button"
					onClick={() => onPageChange(currentPage + 1)}
					disabled={currentPage === totalPages}
					className="grid size-8 place-items-center rounded-full text-slate-500 transition-colors hover:bg-slate-100 disabled:pointer-events-none disabled:opacity-50 dark:text-slate-400 dark:hover:bg-slate-800"
				>
					<ChevronRight className="size-4" />
				</button>
			</div>
		</div>
	);
}
