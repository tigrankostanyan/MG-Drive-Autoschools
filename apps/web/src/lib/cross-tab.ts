const CHANNEL_NAME = "session-change";

let channel: BroadcastChannel | null = null;

function getChannel(): BroadcastChannel | null {
	if (typeof window === "undefined") return null;
	if (typeof BroadcastChannel === "undefined") return null;
	if (!channel) channel = new BroadcastChannel(CHANNEL_NAME);
	return channel;
}

export function broadcastSessionChange() {
	getChannel()?.postMessage("changed");
}

export function subscribeSessionChange(listener: () => void): () => void {
	const activeChannel = getChannel();
	if (!activeChannel) return () => {};
	const handler = () => listener();
	activeChannel.addEventListener("message", handler);
	return () => activeChannel.removeEventListener("message", handler);
}
