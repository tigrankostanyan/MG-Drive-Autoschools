/** Maps transport/API failures to short, actionable Armenian messages. */
export function friendlyError(raw: unknown): string {
	if (!raw) return "";
	const msg = raw instanceof Error ? raw.message : String(raw);
	if (msg.includes("Failed to fetch") || msg.includes("NetworkError")) {
		return "Ցանցային սխալ. Խնդրում ենք ստուգել ձեր ինտերնետ կապը և կրկին փորձել։";
	}
	// CSRF — should not normally reach UI after auto-retry, but just in case
	if (msg.toLowerCase().includes("csrf")) {
		return "Անվտանգության նիշն սպառվել է։ Կատարվում է ավտոմատ վերագործարկում…";
	}
	if (msg.includes("No credential") || msg.includes("credential")) {
		return "Google-ից հավաստագիր չստացվեց։ Խնդրում ենք կրկին փորձել։";
	}
	if (msg.includes("401") || msg.includes("Authentication failed")) {
		return "Նույնականացումը ձախողվեց։ Խնդրում ենք կրկին փորձել կամ ընտրել այլ հաշիվ։";
	}
	if (msg.includes("429") || msg.includes("Too many")) {
		return "Շատ փորձ արվեց։ Խնդրում ենք սպասել մի քանի վայրկյան և կրկին փորձել։";
	}
	if (msg.includes("disabled") || msg.includes("403")) {
		return "Այս հաշիվը կասեցված է։ Խնդրում ենք կապ հաստատել աջակցման ծառայության հետ։";
	}
	return "Մուտքն ձախողվեց։ Խնդրում ենք կրկին փորձել։";
}

/** Keeps an explicit server message, otherwise falls back to a friendly one. */
export function resolveAuthError(err: unknown): string {
	return err instanceof Error && err.message ? err.message : friendlyError(err);
}
