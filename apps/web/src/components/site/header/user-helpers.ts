import type { AuthUser } from "@/lib/auth-guard";
import { getUserImageUrl, pickUserImage } from "@/lib/media";

/** Minimal identity the header surfaces render. */
export type HeaderUser = {
	name: string;
	email: string;
	role?: string | undefined;
	avatar?: string | undefined;
};

export function toHeaderUser(user: AuthUser | null): HeaderUser | null {
	if (!user?.name) return null;
	const avatar = getUserImageUrl(pickUserImage(user.files)) || user.avatar || undefined;
	return { name: user.name, email: user.email ?? "", role: user.role, avatar };
}
