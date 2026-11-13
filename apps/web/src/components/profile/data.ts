import { z } from "zod";

/** Profile tab metadata plus helpers for the locally-encoded user address. */
export type TabId = "settings" | "overview" | "tests" | "wrong" | "lessons";

export interface ProfileTab {
	id: TabId;
	label: string;
	badge?: string | number;
}

export const tabs: ProfileTab[] = [
	{ id: "settings", label: "Կարգավորումներ" },
	{ id: "overview", label: "Ընդհանուր" },
	{ id: "tests", label: "Թեստեր" },
	{ id: "wrong", label: "Սխալներ" },
	{ id: "lessons", label: "Դասեր" },
];

/** Attach live counters (test pass ratio + wrong-test count) to the tab bar. */
export function buildTabs(
	passedTests?: number,
	totalTests?: number,
	wrongTests?: number,
): ProfileTab[] {
	return tabs.map((tab) => {
		if (tab.id === "tests" && typeof totalTests === "number") {
			return { ...tab, badge: `${passedTests ?? 0}/${totalTests}` };
		}
		if (tab.id === "wrong" && typeof wrongTests === "number") {
			if (wrongTests <= 0) {
				const { badge: _drop, ...rest } = tab;
				return rest;
			}
			return { ...tab, badge: String(wrongTests) };
		}
		return tab;
	});
}

export type AddressForm = {
	city: string;
	state: string;
	zip: string;
	country: string;
};

export const defaultAddressForm: AddressForm = {
	city: "Երևան",
	state: "Երևան",
	zip: "0001",
	country: "Հայաստան",
};

/** `UserItem.address` is a JSON string written by the client, so it is untrusted. */
const addressSchema = z
	.object({
		city: z.string().optional(),
		state: z.string().optional(),
		zip: z.string().optional(),
		country: z.string().optional(),
	})
	.passthrough();

export function parseAddress(raw: string | undefined): AddressForm {
	const fallback = { ...defaultAddressForm };
	if (!raw) return fallback;
	try {
		const parsed = addressSchema.safeParse(JSON.parse(raw));
		if (!parsed.success) return fallback;
		return {
			city: parsed.data.city || fallback.city,
			state: parsed.data.state || fallback.state,
			zip: parsed.data.zip || fallback.zip,
			country: parsed.data.country || fallback.country,
		};
	} catch {
		return fallback;
	}
}

export type AccountForm = AddressForm & {
	firstName: string;
	lastName: string;
	phone: string;
};

export type AccountFieldErrors = Partial<Record<keyof AccountForm, string | undefined>>;

const PHONE_PATTERN = /^\+?[\d\s()-]{6,20}$/;

/** Client-side mirror of what the account settings tab is allowed to submit. */
export const accountFormSchema = z.object({
	firstName: z.string().trim().min(1, "Անունը պարտադիր է"),
	lastName: z.string().trim().min(1, "Ազգանունը պարտադիր է"),
	phone: z
		.string()
		.trim()
		.refine((value) => value === "" || PHONE_PATTERN.test(value), {
			message: "Հեռախոսահամարը սխալ ձևաչափով է",
		}),
	city: z.string().trim(),
	state: z.string().trim(),
	zip: z.string().trim(),
	country: z.string().trim(),
});
