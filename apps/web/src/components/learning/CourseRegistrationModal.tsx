import { zodResolver } from "@hookform/resolvers/zod";
import * as React from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { useAsyncSubmit } from "@/hooks/use-async-submit";
import { createRegistration } from "@/lib/api/registrations";
import { notify } from "@/lib/notify";
import { CourseRegistrationFields } from "./CourseRegistrationFields";
import { type FormValues, formSchema } from "./course-registration.schema";

interface CourseRegistrationModalProps {
	isOpen: boolean;
	onClose: () => void;
	selectedPackage: string; // "տեսական", "գործնական", or "ֆուլ փաթեթ"
}

export function CourseRegistrationModal({
	isOpen,
	onClose,
	selectedPackage,
}: CourseRegistrationModalProps) {
	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: "",
			phone: "",
			packageType: selectedPackage,
		},
	});

	// Keep packageType synced if it changes
	React.useEffect(() => {
		form.setValue("packageType", selectedPackage);
	}, [selectedPackage, form]);

	const { isSubmitting, error, run } = useAsyncSubmit({
		fallbackError: "Խնդրում ենք փորձել կրկին",
		onSuccess: () => {
			notify.success("Գրանցումը հաջողությամբ կատարվեց!", "Մենք կկապնվենք ձեզ հետ մոտ ժամանակներս:");
			form.reset();
			onClose();
		},
	});

	const onSubmit = (data: FormValues) => run(() => createRegistration(data));

	return (
		<Dialog
			open={isOpen}
			onOpenChange={(next) => {
				if (!next && !isSubmitting) onClose();
			}}
		>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Գրանցում</DialogTitle>
					<DialogDescription>
						Լրացրեք ձեր տվյալները և մենք կկապնվենք ձեզ հետ։
						<br />
						Ընտրված փաթեթ՝ <strong>{selectedPackage}</strong>
					</DialogDescription>
				</DialogHeader>

				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} noValidate className="space-y-4">
						<CourseRegistrationFields form={form} />

						{error && (
							<p role="alert" className="text-sm font-medium text-red-500">
								{error}
							</p>
						)}

						<DialogFooter className="pt-4">
							<Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
								Չեղարկել
							</Button>
							<Button type="submit" isLoading={isSubmitting}>
								Գրանցվել
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
