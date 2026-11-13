import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";

type Env = {
	VITE_SITE_URL?: string;
	VITE_GOOGLE_CLIENT_ID?: string;
	VITE_SENTRY_DSN?: string;
	VITE_SENTRY_ENVIRONMENT?: string;
	API_URL?: string;
	SENTRY_ORG?: string;
	SENTRY_PROJECT?: string;
	SENTRY_AUTH_TOKEN?: string;
} & Record<string, string>;

export default defineConfig(async ({ command, mode }) => {
	const env = loadEnv(mode, process.cwd(), "") as Env;
	// Inline environment variables into process.env for SSR (Cloudflare Workers)
	const envDefine: Record<string, string> = {};
	// Whitelist of non-VITE env vars that should be inlined into process.env
	const processEnvAllowlist = new Set(["API_URL", "NODE_ENV"]);
	for (const [key, value] of Object.entries(env)) {
		// VITE_* vars are inlined into import.meta.env for client-side access
		if (key.startsWith("VITE_")) {
			envDefine[`import.meta.env.${key}`] = JSON.stringify(value);
		}
		// Only inline whitelisted non-VITE vars into process.env for SSR
		if (processEnvAllowlist.has(key)) {
			envDefine[`process.env.${key}`] = JSON.stringify(value);
		}
	}

	const plugins = [
		tanstackStart({
			importProtection: {
				behavior: "error",
				client: {
					files: ["**/server/**"],
					specifiers: ["server-only"],
				},
			},
			// Redirect TanStack Start's bundled server
			server: { entry: "server" },
		}),
		react(),
		tailwindcss(),
	];

	// SSR deploy layer — only needed for production builds
	if (command === "build") {
		const { nitro } = await import("nitro/vite");
		plugins.push(nitro({ defaultPreset: "cloudflare-module" }));
	}

	// Source maps and automatic
	const org = env.SENTRY_ORG;
	const project = env.SENTRY_PROJECT;
	const authToken = env.SENTRY_AUTH_TOKEN;
	if (org && project && authToken) {
		const { sentryTanstackStart } = await import("@sentry/tanstackstart-react/vite");
		plugins.push(sentryTanstackStart({ org, project, authToken }));
	}

	return {
		define: envDefine,
		server: {
			host: "::",
			port: 8080,
			proxy: {
				"/api": {
					target: env.API_URL || "http://localhost:3300",
					changeOrigin: true,
					secure: false,
					xfwd: true,
					// Vite's proxy types are not exported; use biome-ignore for the configure callback
					// biome-ignore lint/suspicious/noExplicitAny: Vite proxy types are not exported
					configure: (proxy: any, options: any) => {
						// Tune keep-alive on the proxy target so the Vite dev server
						// reuses connections to the backend instead of opening/closing
						// per request, which causes intermittent ECONNREFUSED errors.
						void new URL(options.target);
						// biome-ignore lint/suspicious/noExplicitAny: Vite proxy request type not exported
						proxy.on("proxyReq", (proxyReq: any) => {
							proxyReq.setHeader("Connection", "keep-alive");
						});
						// biome-ignore lint/suspicious/noExplicitAny: Vite proxy error handler types not exported
						proxy.on("error", (err: any, _req: any, res: any) => {
							if (res.headersSent) return;
							if (err.code === "ECONNREFUSED") {
								res.setHeader("Content-Type", "application/json");
								res.writeHead(502);
								res.end(
									JSON.stringify({
										status: "error",
										code: "BAD_GATEWAY",
										message:
											"Backend is not reachable. Ensure the dev server is running on port 3300.",
									}),
								);
							}
						});
					},
				},
				"/images": {
					target: env.API_URL || "http://localhost:3300",
					changeOrigin: true,
					secure: false,
					xfwd: true,
				},
			},
		},
		resolve: {
			tsconfigPaths: true,
			dedupe: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime"],
		},
		plugins,
	};
});
