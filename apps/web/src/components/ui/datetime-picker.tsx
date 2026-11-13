import { format } from "date-fns";
import { Calendar as CalendarIcon, Clock } from "lucide-react";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface DateTimePickerProps {
	value?: string;
	onChange: (value: string) => void;
	placeholder?: string;
}

export function DateTimePicker({
	value,
	onChange,
	placeholder = "Ընտրեք ամսաթիվ և ժամ",
}: DateTimePickerProps) {
	const [date, setDate] = React.useState<Date | undefined>(value ? new Date(value) : undefined);
	const [time, setTime] = React.useState<string>(
		value ? format(new Date(value), "HH:mm") : "12:00",
	);

	React.useEffect(() => {
		if (value) {
			const parsed = new Date(value);
			if (!Number.isNaN(parsed.getTime())) {
				setDate(parsed);
				setTime(format(parsed, "HH:mm"));
			}
		}
	}, [value]);

	const handleDateSelect = (selectedDate: Date | undefined) => {
		if (!selectedDate) {
			setDate(undefined);
			onChange("");
			return;
		}
		setDate(selectedDate);
		updateDateTime(selectedDate, time);
	};

	const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const newTime = e.target.value;
		setTime(newTime);
		if (date) {
			updateDateTime(date, newTime);
		}
	};

	const updateDateTime = (d: Date, t: string) => {
		const [hours, minutes] = t.split(":").map(Number);
		const updated = new Date(d);
		updated.setHours(hours || 0);
		updated.setMinutes(minutes || 0);

		// Format for datetime-local (YYYY-MM-DDTHH:mm)
		const year = updated.getFullYear();
		const month = String(updated.getMonth() + 1).padStart(2, "0");
		const day = String(updated.getDate()).padStart(2, "0");
		const formattedTime = `${String(hours || 0).padStart(2, "0")}:${String(minutes || 0).padStart(2, "0")}`;

		onChange(`${year}-${month}-${day}T${formattedTime}`);
	};

	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button
					variant={"outline"}
					className={cn(
						"w-full justify-start text-left font-normal rounded-xl border-slate-200/80 bg-white dark:bg-slate-900 dark:border-slate-800",
						!date && "text-slate-500",
					)}
				>
					<CalendarIcon className="mr-2 h-4 w-4" />
					{date ? `${format(date, "MM/dd/yyyy")} ${time}` : <span>{placeholder}</span>}
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-auto p-0" align="start">
				<Calendar mode="single" selected={date} onSelect={handleDateSelect} initialFocus />
				<div className="border-t border-slate-100 p-3 dark:border-slate-800">
					<div className="flex items-center gap-2">
						<Clock className="h-4 w-4 text-slate-500" />
						<input
							type="time"
							value={time}
							onChange={handleTimeChange}
							className="w-full rounded-md border border-slate-200 px-2 py-1 text-sm outline-none focus:border-accent dark:border-slate-800 dark:bg-slate-900"
						/>
					</div>
				</div>
			</PopoverContent>
		</Popover>
	);
}
