import { DateTimePicker } from "@/components/ui/datetime-picker";
import { cn } from "@/lib/utils";

export function GroupCardEditor({
	isEditingTitle,
	isEditingSchedule,
	form,
	titleError,
	onFormChange,
}: {
	isEditingTitle: boolean;
	isEditingSchedule: boolean;
	form: { title: string; activeFrom: string; activeUntil: string };
	titleError?: string | undefined;
	onFormChange: (field: "title" | "activeFrom" | "activeUntil", value: string) => void;
}) {
	if (isEditingTitle) {
		return (
			<div className="mt-2 space-y-2">
				<input
					type="text"
					value={form.title}
					onChange={(e) => onFormChange("title", e.target.value)}
					aria-label="Խմբի անվանում"
					aria-invalid={titleError ? true : undefined}
					aria-describedby={titleError ? "group-title-error" : undefined}
					className={cn(
						"w-full rounded-lg border bg-white px-3 py-2 text-sm font-bold dark:bg-slate-900",
						titleError
							? "border-red-300 focus:border-red-500 dark:border-red-800"
							: "border-slate-200 dark:border-slate-800",
					)}
					placeholder="Խմբի անվանում"
				/>
				{titleError && (
					<p id="group-title-error" role="alert" className="text-xs font-medium text-red-500">
						{titleError}
					</p>
				)}
			</div>
		);
	}
	if (isEditingSchedule) {
		return (
			<div className="mt-4 space-y-3">
				<div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
					<div className="block">
						<span className="mb-1 block text-xs font-bold text-slate-500">Ակտիվանում է</span>
						<DateTimePicker
							value={form.activeFrom}
							onChange={(val) => onFormChange("activeFrom", val)}
							placeholder="Ընտրեք սկիզբը"
						/>
					</div>
					<div className="block">
						<span className="mb-1 block text-xs font-bold text-slate-500">Անջատվում է</span>
						<DateTimePicker
							value={form.activeUntil}
							onChange={(val) => onFormChange("activeUntil", val)}
							placeholder="Ընտրեք ավարտը"
						/>
					</div>
				</div>
				<p className="text-[11px] font-semibold text-slate-400">
					Դատարկ թողնելու դեպքում ժամանակացույց չկա (միշտ ակտիվ է):
				</p>
			</div>
		);
	}
	return null;
}
