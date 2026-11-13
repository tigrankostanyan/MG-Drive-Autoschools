import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, Send } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useAsyncSubmit } from "@/hooks/use-async-submit";
import { sendContactMessage } from "@/lib/api/contact";
import { ContactFormFields } from "./ContactFormFields";
import { type ContactFormValues, contactFormSchema } from "./contact.schema";
import { EMPTY_CONTACT_FORM } from "./data";

export function ContactForm() {
	const [sent, setSent] = useState(false);
	const form = useForm<ContactFormValues>({
		resolver: zodResolver(contactFormSchema),
		defaultValues: { ...EMPTY_CONTACT_FORM },
	});

	const { isSubmitting, error, run } = useAsyncSubmit({
		fallbackError: "Հաղորդագրությունը չուղարկվեց։ Խնդրում ենք փորձել կրկին",
		onSuccess: () => {
			setSent(true);
			form.reset({ ...EMPTY_CONTACT_FORM });
		},
	});

	const onSubmit = (values: ContactFormValues) => run(() => sendContactMessage(values));

	return (
		<div className="p-4 sm:p-8 lg:p-12 2xl:p-14 lg:col-span-7 flex flex-col justify-center">
			<h2 className="text-2xl sm:text-4xl 2xl:text-[44px] font-black text-slate-950 dark:text-white tracking-tight mb-2.5 break-words">
				Ուղարկեք մեզ հաղորդագրություն
			</h2>
			<p className="text-xs sm:text-sm 2xl:text-base text-slate-600 dark:text-slate-400 mb-6 sm:mb-8 max-w-lg leading-relaxed font-medium">
				Ունե՞ք հարցեր, առաջարկներ կամ օգնության կարիք: Լրացրեք տվյալները, և մեր մասնագետը կկապվի Ձեզ
				հետ հնարավորինս շուտ։
			</p>

			{sent ? (
				<div className="flex flex-col items-center justify-center py-8 sm:py-12 text-center h-full">
					<div className="grid size-16 place-items-center rounded-2xl bg-emerald-500/10 text-emerald-500 mb-5 ring-8 ring-emerald-500/5">
						<CheckCircle2 className="size-8 text-emerald-500" />
					</div>
					<h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
						Շնորհակալություն
					</h3>
					<p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mb-6">
						Ձեր հաղորդագրությունն ուղարկված է։ Մեր մասնագետը կկապվի Ձեզ հետ շուտով։
					</p>
					<Button type="button" variant="outline" onClick={() => setSent(false)}>
						Ուղարկել նոր հաղորդագրություն
					</Button>
				</div>
			) : (
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} noValidate className="space-y-5">
						<ContactFormFields form={form} />

						{error && (
							<p role="alert" className="text-sm font-medium text-red-500">
								{error}
							</p>
						)}

						<div className="pt-2">
							<Button
								type="submit"
								size="lg"
								isLoading={isSubmitting}
								className="w-full sm:w-auto min-w-[200px]"
							>
								<span>Ուղարկել</span>
								<Send className="size-4 ml-1" />
							</Button>
						</div>
					</form>
				</Form>
			)}
		</div>
	);
}
