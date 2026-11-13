import * as z from "zod";
import { nameField, phoneField } from "@/lib/validation";

// age, lastname, email were removed for a simpler form
export const formSchema = z.object({
	name: nameField(),
	phone: phoneField(),
	packageType: z.string(),
});

export type FormValues = z.infer<typeof formSchema>;
