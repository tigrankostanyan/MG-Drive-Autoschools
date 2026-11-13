import * as z from "zod";

const NAME_MIN_LENGTH = 2;
const PHONE_MIN_LENGTH = 6;

/** True when `value` is an integer greater than or equal to `min` (default 1). */
export function isPositiveInteger(value: number, min = 1): boolean {
	return Number.isInteger(value) && value >= min;
}

/** Person name field with a shared minimum length and required message. */
export function nameField(requiredMessage = "Անունը պարտադիր է") {
	return z.string().trim().min(NAME_MIN_LENGTH, requiredMessage);
}

/** Phone field with a shared minimum length and required message. */
export function phoneField(requiredMessage = "Հեռախոսահամարը պարտադիր է") {
	return z.string().trim().min(PHONE_MIN_LENGTH, requiredMessage);
}

/** Required e-mail field with a shared format message. */
export function emailField(requiredMessage = "Էլ․ փոստը պարտադիր է") {
	return z.string().trim().min(1, requiredMessage).email("Սխալ էլ․ հասցե");
}
