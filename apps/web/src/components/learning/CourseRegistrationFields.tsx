import type { UseFormReturn } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import type { FormValues } from "./course-registration.schema";

export function CourseRegistrationFields({ form }: { form: UseFormReturn<FormValues> }) {
	return (
		<div className="grid gap-4 sm:grid-cols-2">
			<FormField
				control={form.control}
				name="name"
				render={({ field }) => (
					<FormItem>
						<FormLabel required>Անուն</FormLabel>
						<FormControl>
							<Input placeholder="Արամ" autoComplete="given-name" {...field} />
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>
			<FormField
				control={form.control}
				name="phone"
				render={({ field }) => (
					<FormItem>
						<FormLabel required>Հեռախոս</FormLabel>
						<FormControl>
							<Input
								type="tel"
								inputMode="tel"
								autoComplete="tel"
								placeholder="099 123456"
								{...field}
							/>
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>
		</div>
	);
}
