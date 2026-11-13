import { z } from "zod";

const envSchema = z
	.object({
		VITE_SITE_URL: z.string().url().optional(),
		VITE_GOOGLE_CLIENT_ID: z.string().min(1, "VITE_GOOGLE_CLIENT_ID is required"),
		VITE_SENTRY_DSN: z.string().optional(),
		VITE_SENTRY_ENVIRONMENT: z.string().optional(),
		VITE_MEDIA_BASE: z.string().optional(),
	})
	.strict();

// Cast import.meta.env to avoid index signature issues
const metaEnv = import.meta.env as unknown as {
	VITE_SITE_URL: string | undefined;
	VITE_GOOGLE_CLIENT_ID: string;
	VITE_SENTRY_DSN: string | undefined;
	VITE_SENTRY_ENVIRONMENT: string | undefined;
	VITE_MEDIA_BASE: string | undefined;
};

const rawEnv = {
	VITE_SITE_URL: metaEnv.VITE_SITE_URL,
	VITE_GOOGLE_CLIENT_ID: metaEnv.VITE_GOOGLE_CLIENT_ID,
	VITE_SENTRY_DSN: metaEnv.VITE_SENTRY_DSN,
	VITE_SENTRY_ENVIRONMENT: metaEnv.VITE_SENTRY_ENVIRONMENT,
	VITE_MEDIA_BASE: metaEnv.VITE_MEDIA_BASE,
};

export const env = envSchema.parse(rawEnv);
export const VITE_SITE_URL = env.VITE_SITE_URL;
export const VITE_GOOGLE_CLIENT_ID = env.VITE_GOOGLE_CLIENT_ID;
export const VITE_SENTRY_DSN = env.VITE_SENTRY_DSN;
export const VITE_SENTRY_ENVIRONMENT = env.VITE_SENTRY_ENVIRONMENT;
export const VITE_MEDIA_BASE = env.VITE_MEDIA_BASE;
