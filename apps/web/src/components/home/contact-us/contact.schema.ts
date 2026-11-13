import * as z from "zod";
import { emailField, nameField, phoneField } from "@/lib/validation";

const MESSAGE_MIN = 10;

export const contactFormSchema = z.object({
	name: nameField(),
	company: z.string().trim(),
	email: emailField(),
	phone: phoneField(),
	subject: z.string().trim(),
	message: z.string().trim().min(MESSAGE_MIN, "Հաղորդագրությունը պետք է լինի առնվազն 10 նշան"),
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;
