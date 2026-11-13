import type { FileItem, StudentGroupAccess, UserItem } from "./api/types";

export type UserRole = "user" | "student" | "teacher" | "admin";

// Core fields the server always returns for an authenticated user.
export interface AuthUser {
	id: number;
	name: string;
	email: string;
	phone?: string;
	role: UserRole;
	isPaid?: boolean;
	paymentExpiresAt?: string | null;
	studentGroup?: StudentGroupAccess | null;
	avatar?: string;
	files?: FileItem[];
}

/** Loose user shape accepted from the API: only `id` is trusted up front. */
export type AuthUserInput = Partial<UserItem> & { id: UserItem["id"] };

export type SessionResult =
	| { status: "ok"; user: AuthUser }
	| { status: "expired" }
	| { status: "none" };
