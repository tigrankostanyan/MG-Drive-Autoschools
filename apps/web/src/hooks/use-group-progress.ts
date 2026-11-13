import { useEffect } from "react";
import { toast } from "sonner";
import { saveGroupProgress } from "@/lib/api/groups";
import { logger } from "@/lib/observability/logger";

const SAVE_DEBOUNCE_MS = 800;

/** Persists answers once the user pauses instead of on every click. */
export function useGroupProgress(groupId: string, answers: Record<number, number>) {
	useEffect(() => {
		if (Object.keys(answers).length === 0) return;
		const timer = setTimeout(() => {
			saveGroupProgress(groupId, answers).catch((err) => {
				logger.error("progress.save_failed", "Failed to save progress", { error: err });
				toast.error("Առաջընթացը չպահպանվեց", {
					description: `Խնդրում ենք ստուգել ձեր ինտերնետային կապը: ${err.message || ""}`,
				});
			});
		}, SAVE_DEBOUNCE_MS);
		return () => clearTimeout(timer);
	}, [answers, groupId]);
}
