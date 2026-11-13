/// <reference types="vite/client" />

declare global {
	namespace ImportMeta {
		interface Env {
			VITE_SITE_URL: string;
			VITE_GOOGLE_CLIENT_ID: string;
			VITE_SENTRY_DSN: string;
			VITE_SENTRY_ENVIRONMENT: string;
		}
	}

	namespace NodeJS {
		interface ProcessEnv {
			NODE_ENV: "development" | "production" | "test";
			SENTRY_DSN: string;
			SENTRY_ENVIRONMENT: string;
			API_URL: string;
		}
	}
}

export {};
