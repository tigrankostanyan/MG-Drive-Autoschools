/* MG Drive Autoschools — Service Worker */
const VERSION = "v1";
const STATIC_CACHE = `mg-static-${VERSION}`;
const OFFLINE_URL = "/offline.html";

const PRECACHE = [
	OFFLINE_URL,
	"/manifest.json",
	"/favicon.ico",
	"/icon-192.png",
	"/icon-512.png",
	"/images/logo/logo.png",
];

self.addEventListener("install", (event) => {
	event.waitUntil(
		caches
			.open(STATIC_CACHE)
			.then((cache) => cache.addAll(PRECACHE))
			.then(() => self.skipWaiting()),
	);
});

self.addEventListener("activate", (event) => {
	event.waitUntil(
		caches
			.keys()
			.then((keys) =>
				Promise.all(keys.filter((k) => k !== STATIC_CACHE).map((k) => caches.delete(k))),
			)
			.then(() => self.clients.claim()),
	);
});

function isStaticAsset(url) {
	return (
		url.pathname.startsWith("/assets/") ||
		url.pathname.startsWith("/images/") ||
		/\.(?:png|jpg|jpeg|webp|svg|ico|woff2?|css|js)$/.test(url.pathname)
	);
}

self.addEventListener("fetch", (event) => {
	const { request } = event;
	if (request.method !== "GET") return;

	const url = new URL(request.url);
	if (url.origin !== self.location.origin) return;
	// Never cache API, auth, realtime or telemetry traffic.
	if (
		url.pathname.startsWith("/api/") ||
		url.pathname.startsWith("/telemetry") ||
		url.pathname.startsWith("/monitor") ||
		url.pathname.startsWith("/health") ||
		url.pathname === "/sw.js"
	) {
		return;
	}

	// Pages: network first, fall back to offline page only.
	// Do NOT cache user-specific SSR HTML (auth state, user data).
	if (request.mode === "navigate") {
		event.respondWith(fetch(request).catch(() => caches.match(OFFLINE_URL)));
		return;
	}

	// Static assets: stale-while-revalidate.
	if (isStaticAsset(url)) {
		event.respondWith(
			caches.open(STATIC_CACHE).then(async (cache) => {
				const cached = await cache.match(request);
				const network = fetch(request)
					.then((res) => {
						if (res.ok) cache.put(request, res.clone());
						return res;
					})
					.catch(() => cached);
				return cached || network;
			}),
		);
	}
});
