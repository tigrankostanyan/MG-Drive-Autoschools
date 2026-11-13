/** Initials for avatars, e.g. "Tigran Kostanyan" → "TK". */
export function getInitials(name: string): string {
	return name
		.split(/\s+/)
		.filter(Boolean)
		.slice(0, 2)
		.map((w) => w[0])
		.join("")
		.toUpperCase();
}

/**
 * Short display name: First name + first letter of last name with dot.
 * e.g. "Tigran Petrosyan" → "Tigran Պ.", "Tigran" → "Tigran"
 */
export function formatShortName(name: string): string {
	if (!name) return "";
	const parts = name.trim().split(/\s+/).filter(Boolean);
	if (parts.length <= 1) return parts[0] || "";
	return `${parts[0]} ${parts[1]?.[0] || ""}.`;
}

const LOCALE = "hy-AM";

const numberFormatter = new Intl.NumberFormat(LOCALE);

const currencyFormatters = new Map<string, Intl.NumberFormat>();

function currencyFormatter(currency: string): Intl.NumberFormat {
	const code = currency.toUpperCase();
	let formatter = currencyFormatters.get(code);
	if (!formatter) {
		formatter = new Intl.NumberFormat(LOCALE, {
			style: "currency",
			currency: code,
			maximumFractionDigits: 0,
		});
		currencyFormatters.set(code, formatter);
	}
	return formatter;
}

const dateTimeFormatter = new Intl.DateTimeFormat(LOCALE, {
	year: "numeric",
	month: "short",
	day: "numeric",
	hour: "2-digit",
	minute: "2-digit",
});

const dateFormatter = new Intl.DateTimeFormat(LOCALE, {
	year: "numeric",
	month: "short",
	day: "numeric",
});

/** Grouped plain number, e.g. 15000 → "15 000". */
export function formatNumber(value: number): string {
	return numberFormatter.format(value);
}

/** Currency amount with no fraction digits, e.g. 15000 → "15 000 ֏". */
export function formatCurrency(amount: number, currency = "AMD"): string {
	return currencyFormatter(currency).format(amount);
}

/** Date and time in a fixed locale, safe for SSR, e.g. "12 հնվ. 2026, 14:30". */
export function formatDateTime(value: string | Date): string {
	return dateTimeFormatter.format(new Date(value));
}

/** Date only in a fixed locale, safe for SSR. */
export function formatDate(value: string | Date): string {
	return dateFormatter.format(new Date(value));
}
