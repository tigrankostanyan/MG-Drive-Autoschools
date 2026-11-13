import { Search } from "lucide-react";

const DEFAULT_INPUT_CLASS =
	"w-full rounded-2xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-xs shadow-xs outline-none focus:border-accent focus:ring-2 focus:ring-accent/10 dark:border-slate-800 dark:bg-slate-900";

/** Search box used by the admin list views. */
export function SearchInput({
	value,
	onChange,
	placeholder,
	inputClassName = DEFAULT_INPUT_CLASS,
}: {
	value: string;
	onChange: (value: string) => void;
	placeholder: string;
	inputClassName?: string;
}) {
	return (
		<div className="relative w-full max-w-sm">
			<Search className="absolute left-3.5 top-3 size-4 text-slate-400" />
			<input
				type="text"
				placeholder={placeholder}
				value={value}
				onChange={(e) => onChange(e.target.value)}
				className={inputClassName}
			/>
		</div>
	);
}
