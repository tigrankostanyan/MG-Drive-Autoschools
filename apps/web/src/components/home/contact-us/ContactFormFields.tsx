import type { UseFormReturn } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { ContactFormValues } from "./contact.schema";

const PHONE_WRAPPER_CLASS =
	"flex h-12 w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 overflow-hidden transition-all focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20";

const PHONE_INPUT_CLASS =
	"h-full w-full bg-transparent px-4 text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-400 outline-none";

export function ContactFormFields({ form }: { form: UseFormReturn<ContactFormValues> }) {
	return (
		<>
			<div className="grid gap-5 sm:grid-cols-2">
				<FormField
					control={form.control}
					name="name"
					render={({ field }) => (
						<FormItem>
							<FormLabel required>Անուն</FormLabel>
							<FormControl>
								<Input placeholder="Ձեր անունը" autoComplete="given-name" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="company"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Ազգանուն</FormLabel>
							<FormControl>
								<Input placeholder="Ձեր ազգանունը" autoComplete="family-name" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
			</div>

			<div className="grid gap-5 sm:grid-cols-2">
				<FormField
					control={form.control}
					name="email"
					render={({ field }) => (
						<FormItem>
							<FormLabel required>Էլ․ փոստ</FormLabel>
							<FormControl>
								<Input
									type="email"
									placeholder="email@example.com"
									autoComplete="email"
									{...field}
								/>
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
							<div className={PHONE_WRAPPER_CLASS}>
								<span className="flex items-center justify-center border-r border-slate-200 dark:border-slate-700 px-3 text-sm font-medium text-slate-600 dark:text-slate-400">
									+374
								</span>
								<FormControl>
									<input
										type="tel"
										inputMode="tel"
										autoComplete="tel"
										placeholder="00 000 000"
										className={PHONE_INPUT_CLASS}
										{...field}
									/>
								</FormControl>
							</div>
							<FormMessage />
						</FormItem>
					)}
				/>
			</div>

			<FormField
				control={form.control}
				name="message"
				render={({ field }) => (
					<FormItem>
						<FormLabel required>Հաղորդագրություն</FormLabel>
						<FormControl>
							<Textarea rows={4} placeholder="Ձեր հարցը կամ հաղորդագրությունը..." {...field} />
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>
		</>
	);
}
