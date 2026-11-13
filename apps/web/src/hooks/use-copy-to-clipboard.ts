import { useCallback, useEffect, useRef, useState } from "react";
import { notify } from "@/lib/notify";

/**
 * Copy text to clipboard with browser API with a legacy `execCommand` fallback.
 * Tracks the last-copied field so UI can show confirmation feedback.
 */
export function useCopyToClipboard(feedbackDurationMs = 2000, successMessage = "Պատճենվեց") {
	const [copiedField, setCopiedField] = useState<string | null>(null);
	const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	useEffect(() => {
		return () => {
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
			}
		};
	}, []);

	const copy = useCallback(
		async (text: string | undefined, field: string) => {
			if (!text?.trim()) return false;

			try {
				const trimmed = text.trim();
				if (navigator?.clipboard?.writeText) {
					await navigator.clipboard.writeText(trimmed);
				} else {
					const textArea = document.createElement("textarea");
					textArea.value = trimmed;
					textArea.style.position = "fixed";
					textArea.style.left = "-9999px";
					textArea.style.top = "-9999px";
					textArea.style.opacity = "0";
					document.body.appendChild(textArea);
					textArea.focus();
					textArea.select();
					document.execCommand("copy");
					textArea.remove();
				}

				setCopiedField(field);
				notify.success(successMessage, trimmed);

				if (timeoutRef.current) {
					clearTimeout(timeoutRef.current);
				}
				timeoutRef.current = setTimeout(() => {
					setCopiedField(null);
				}, feedbackDurationMs);
				return true;
			} catch {
				notify.error("Չհաջողվեց պատճենել");
				return false;
			}
		},
		[feedbackDurationMs, successMessage],
	);

	return { copiedField, copy };
}
