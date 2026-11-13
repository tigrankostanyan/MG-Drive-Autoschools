export function safeHref(raw: string | undefined): string | undefined {
	return safeExternalUrl(raw, (url) => isHttp(url));
}

const MAP_EMBED_HOSTS = ["www.google.com", "maps.google.com"];

export function safeMapEmbedUrl(raw: string | undefined): string | undefined {
	return safeExternalUrl(
		raw,
		(url) =>
			url.protocol === "https:" &&
			MAP_EMBED_HOSTS.includes(url.hostname) &&
			url.pathname.startsWith("/maps/embed"),
	);
}

function isHttp(url: URL): boolean {
	return url.protocol === "https:" || url.protocol === "http:";
}

function safeExternalUrl(
	raw: string | undefined,
	isAllowed: (url: URL) => boolean,
): string | undefined {
	if (!raw) return undefined;
	try {
		const url = new URL(raw);
		return isAllowed(url) ? url.href : undefined;
	} catch {
		return undefined;
	}
}
