import { type Dispatch, type SetStateAction, useState } from "react";
import { toast } from "sonner";
import { updateContactInfo } from "@/lib/api/contact";
import type { ContactItem } from "@/lib/api/types";
import { serverErrorText } from "@/lib/api-errors";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export interface ContactFormErrors {
	phone?: string | undefined;
	email?: string | undefined;
	address?: string | undefined;
}

/**
 * Owns the contact-info + subscription admin form state, its validation and
 * its save request, so `SettingsManagerView` stays a pure presentational view.
 */
export function useContactSettingsForm(
	contact: ContactItem | null,
	onChange: Dispatch<SetStateAction<ContactItem | null>>,
) {
	const [phone, setPhone] = useState(contact?.phone || "+374 10 55 44 33");
	const [email, setEmail] = useState(contact?.email || "info@avtodrive.am");
	const [address, setAddress] = useState(contact?.address || "Երևան, Աբովյան 15");
	const [facebook, setFacebook] = useState(contact?.facebook || "https://facebook.com/avtodrive");
	const [instagram, setInstagram] = useState(
		contact?.instagram || "https://instagram.com/avtodrive",
	);
	const [hours, setHours] = useState(contact?.working_hours || "Երկ-Շբթ: 09:00 - 20:00");
	const [saving, setSaving] = useState(false);
	const [errors, setErrors] = useState<ContactFormErrors>({});

	const clearError = (key: keyof ContactFormErrors) =>
		setErrors((prev) => (prev[key] ? { ...prev, [key]: undefined } : prev));

	const validate = (): ContactFormErrors => {
		const next: ContactFormErrors = {};
		if (!phone.trim()) next.phone = "Մուտքագրեք հեռախոսահամարը";
		if (!email.trim()) next.email = "Մուտքագրեք էլ. փոստը";
		else if (!EMAIL_PATTERN.test(email.trim())) next.email = "Մուտքագրեք վավեր էլ. փոստի հասցե";
		if (!address.trim()) next.address = "Մուտքագրեք հասցեն";
		return next;
	};

	const handleSave = async () => {
		if (saving) return;
		const nextErrors = validate();
		setErrors(nextErrors);
		if (Object.values(nextErrors).some(Boolean)) return;
		setSaving(true);
		try {
			const res = await updateContactInfo({
				phone: phone.trim(),
				email: email.trim(),
				address: address.trim(),
				facebook: facebook.trim(),
				instagram: instagram.trim(),
				working_hours: hours.trim(),
			});
			toast.success("Կոնտակտային տվյալները հաջողությամբ պահպանվեցին");
			onChange(res.data);
		} catch (err) {
			toast.error(serverErrorText(err, "Պահպանման սխալ"));
		} finally {
			setSaving(false);
		}
	};

	return {
		phone,
		setPhone: (value: string) => {
			setPhone(value);
			clearError("phone");
		},
		email,
		setEmail: (value: string) => {
			setEmail(value);
			clearError("email");
		},
		address,
		setAddress: (value: string) => {
			setAddress(value);
			clearError("address");
		},
		facebook,
		setFacebook,
		instagram,
		setInstagram,
		hours,
		setHours,
		errors,
		saving,
		handleSave,
	};
}
