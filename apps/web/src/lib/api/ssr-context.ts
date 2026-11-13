import { createIsomorphicFn } from "@tanstack/react-start";

//  Per-request SSR context
export const getSsrContext = createIsomorphicFn()
	.server(async () => {
		const { getRequest, getRequestUrl } = await import("@tanstack/react-start/server");
		const inbound = getRequest().headers;
		const cookie = inbound.get("cookie") ?? "";
		const origin = getRequestUrl({
			xForwardedProto: true,
			xForwardedHost: true,
		}).origin;
		// Use API_URL if set (e.g. in production pointing to the Express API server),
		// otherwise derive the origin from the incoming request URL.
		const apiUrl = process.env["API_URL"] ?? origin;
		return {
			cookie,
			userAgent: inbound.get("user-agent") ?? "",
			forwardedFor: inbound.get("x-forwarded-for") ?? "",
			realIp: inbound.get("x-real-ip") ?? "",
			apiBase: apiUrl.replace(/\/+$/, ""),
		};
	})
	.client(() => ({
		cookie: "",
		userAgent: "",
		forwardedFor: "",
		realIp: "",
		apiBase: "",
	}));
