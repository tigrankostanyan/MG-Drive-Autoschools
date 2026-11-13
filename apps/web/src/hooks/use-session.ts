import { useSyncExternalStore } from "react";
import type { UserItem } from "@/lib/api/types";
import { getMemoryUser, isUserReady, subscribeUser } from "@/lib/api/user-store";

const getServerUser = (): UserItem | null => null;
const getServerReady = (): boolean => false;

/**
 * Reactive client session. `user` is the live store value and `ready` turns
 * true once it is authoritative — before that, callers should keep their
 * SSR-seeded value to avoid a hydration mismatch.
 */
export function useSession(): { user: UserItem | null; ready: boolean } {
	const user = useSyncExternalStore(subscribeUser, getMemoryUser, getServerUser);
	const ready = useSyncExternalStore(subscribeUser, isUserReady, getServerReady);
	return { user, ready };
}
