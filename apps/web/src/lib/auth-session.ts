import type { UserItem } from "./api/types";
import { setMemoryUser } from "./api/user-store";
import { broadcastSessionChange } from "./cross-tab";

export function setSessionUser(user: UserItem | null) {
	if (typeof window === "undefined") return;
	setMemoryUser(user);
	broadcastSessionChange();
	window.dispatchEvent(new Event("auth-change"));
}

export function clearSessionUser() {
	setSessionUser(null);
}
