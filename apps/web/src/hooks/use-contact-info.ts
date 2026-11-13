import { useQuery } from "@tanstack/react-query";
import { fetchContactInfo } from "@/lib/api/contact";
import type { ContactItem } from "@/lib/api/types";

const MINUTE_MS = 60_000;
const CONTACT_STALE_TIME_MINUTES = 5;
const CONTACT_STALE_TIME_MS = CONTACT_STALE_TIME_MINUTES * MINUTE_MS;

/**
 * Shared contact info backed by React Query. Header, footer, contact section,
 * and settings read the same cache entry, so a page renders a single
 * request instead of one per surface.
 */
export function useContactInfo(): ContactItem | null {
	const { data } = useQuery({
		queryKey: ["contact-info"],
		queryFn: async () => (await fetchContactInfo()).data,
		staleTime: CONTACT_STALE_TIME_MS,
	});
	return data ?? null;
}
