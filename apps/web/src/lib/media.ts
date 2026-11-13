import { VITE_MEDIA_BASE } from "./env";

/** Single entry point for building media URLs from `VITE_MEDIA_BASE`. */
export function mediaUrl(path: string): string {
	const trimmed = VITE_MEDIA_BASE?.replace(/\/+$/, "") ?? "";
	if (!trimmed) return path;
	// Avoid double slashes: "/images/x" -> "base/images/x"
	return `${trimmed}${path.startsWith("/") ? path : `/${path}`}`;
}

export type FileItem = {
	id?: number;
	name: string;
	ext: string;
	name_used?: string;
};

const MEDIA_BASE = (VITE_MEDIA_BASE ?? "").replace(/\/+$/, "");

/**
 * Build a fully-qualified URL for a question image file.
 *
 * If a `VITE_MEDIA_BASE` is configured, the URL is absolute (e.g.
 * `http://localhost:5000/images/questions/large/<name>.<ext>`).
 * When unset, a root-relative path is returned so the dev proxy
 * can serve it.
 */
export function getQuestionImageUrl(
	file?: FileItem | null,
	size: "large" | "small" = "large",
): string | null {
	if (!file?.name || !file?.ext) return null;
	const cleanExt = file.ext.startsWith(".") ? file.ext.slice(1) : file.ext;
	const path = `/images/questions/${size}/${file.name}.${cleanExt}`;
	return MEDIA_BASE ? `${MEDIA_BASE}${path}` : path;
}

/**
 * Build a fully-qualified URL for a user avatar file.
 *
 * Mirrors the legacy MVC convention: pick the file with
 * `name_used === "user_img"` and resolve it under
 * `/images/users/<size>/<name>.<ext>`.
 */
export function getUserImageUrl(
	file?: FileItem | null,
	size: "large" | "small" = "large",
): string | null {
	if (!file?.name || !file?.ext) return null;
	const cleanExt = file.ext.startsWith(".") ? file.ext.slice(1) : file.ext;
	const path = `/images/users/${size}/${file.name}.${cleanExt}`;
	return MEDIA_BASE ? `${MEDIA_BASE}${path}` : path;
}

/** Pick the avatar file from a user's `files` array, falling back to the first. */
export function pickUserImage(files?: FileItem[] | null): FileItem | undefined {
	return files?.find((f) => f.name_used === "user_img") ?? files?.[0];
}
