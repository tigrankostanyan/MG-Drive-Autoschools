import { useEffect, useState } from "react";
import { toast } from "sonner";
import type { AnalyticsResponse } from "@/lib/api/analytics";
import { fetchDashboardAnalytics } from "@/lib/api/analytics";
import { serverErrorText } from "@/lib/api-errors";

/**
 * Loads the admin dashboard analytics once on mount, owning the request, the
 * loading flag and the unmount guard so `DashboardView` stays presentational.
 */
export function useDashboardAnalytics() {
	const [analytics, setAnalytics] = useState<AnalyticsResponse | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		let mounted = true;
		setLoading(true);
		fetchDashboardAnalytics()
			.then((data) => {
				if (mounted) setAnalytics(data);
			})
			.catch((err) => {
				if (!mounted) return;
				setAnalytics(null);
				toast.error(serverErrorText(err, "Վիճակագրության բեռնման սխալ"));
			})
			.finally(() => {
				if (mounted) setLoading(false);
			});
		return () => {
			mounted = false;
		};
	}, []);

	return { analytics, loading };
}
