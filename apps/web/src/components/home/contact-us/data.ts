import type { ContactMessagePayload } from "@/lib/api/contact";

export const EMPTY_CONTACT_FORM: ContactMessagePayload = {
	name: "",
	company: "",
	phone: "",
	email: "",
	subject: "",
	message: "",
};

export const DEFAULT_MAP_IFRAME =
	"https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3048.0836748940736!2d44.51578317682862!3d40.18177857147717!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x406abce5fd875555%3A0x4c9d0b1b7c9b7f0!2sAbovyan%20St%2C%20Yerevan!5e0!3m2!1sen!2sam!4v1700000000000";

export const DEFAULT_ADDRESS = "ք․ Երևան, Աբովյան փողոց";

export const DEFAULT_PHONE = "010 54 45 20";
export const DEFAULT_PHONE_HREF = "tel:010544520";

export const DEFAULT_MOBILE_PHONE = "+374 99 55 44 33";
export const DEFAULT_MOBILE_PHONE_HREF = "tel:+37499554433";

export const DEFAULT_EMAIL = "info@mgdrive.am";
export const DEFAULT_EMAIL_HREF = "mailto:info@mgdrive.am";

export function telHref(phone: string | undefined, fallback: string): string {
	return phone ? `tel:${phone.replace(/\s+/g, "")}` : fallback;
}

export function mailHref(email: string | undefined, fallback: string): string {
	return email ? `mailto:${email}` : fallback;
}
