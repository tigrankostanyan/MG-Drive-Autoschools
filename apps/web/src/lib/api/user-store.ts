import type { UserItem } from "./types";

// Module-level singleton, so any client component can read the session user
// without a provider. SSR never mutates it — that would leak across requests.
let memoryUser: UserItem | null = null;
// Flipped once the client store is authoritative (SSR seed or `/user/me`),
// which is what tells consumers to stop showing their SSR placeholder.
let ready = false;
const listeners = new Set<() => void>();

function emit() {
	for (const listener of listeners) listener();
}

export function getMemoryUser(): UserItem | null {
	return memoryUser;
}

export function isUserReady(): boolean {
	return ready;
}

/** Subscribe to user changes; backs the `useSession` hook. */
export function subscribeUser(listener: () => void): () => void {
	listeners.add(listener);
	return () => {
		listeners.delete(listener);
	};
}

export function setMemoryUser(user: UserItem | null) {
	memoryUser = user;
	emit();
}

/** Mark the client session as resolved, so SSR placeholders can be dropped. */
export function markUserReady() {
	if (ready) return;
	ready = true;
	emit();
}
