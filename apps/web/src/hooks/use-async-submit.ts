import * as React from "react";
import { serverErrorText } from "@/lib/api-errors";

interface AsyncSubmitOptions {
	/** Shown when the thrown error carries no server-provided detail. */
	fallbackError: string;
	onSuccess?: (() => void) | undefined;
	onError?: ((message: string) => void) | undefined;
}

interface AsyncSubmitState {
	isSubmitting: boolean;
	error: string | null;
	clearError: () => void;
	run: (action: () => Promise<unknown>) => Promise<boolean>;
}

/**
 * Runs a submit action behind an in-flight guard, so repeated clicks only ever
 * fire one request, and maps thrown API errors into a displayable message.
 */
export function useAsyncSubmit(options: AsyncSubmitOptions): AsyncSubmitState {
	const [isSubmitting, setIsSubmitting] = React.useState(false);
	const [error, setError] = React.useState<string | null>(null);
	const inFlight = React.useRef(false);
	const mounted = React.useRef(true);
	const optionsRef = React.useRef(options);
	optionsRef.current = options;

	React.useEffect(() => {
		mounted.current = true;
		return () => {
			mounted.current = false;
		};
	}, []);

	const clearError = React.useCallback(() => setError(null), []);

	const run = React.useCallback(async (action: () => Promise<unknown>) => {
		if (inFlight.current) return false;
		inFlight.current = true;
		setIsSubmitting(true);
		setError(null);
		try {
			await action();
			if (mounted.current) optionsRef.current.onSuccess?.();
			return true;
		} catch (err) {
			const message = serverErrorText(err, optionsRef.current.fallbackError);
			if (mounted.current) {
				setError(message);
				optionsRef.current.onError?.(message);
			}
			return false;
		} finally {
			inFlight.current = false;
			if (mounted.current) setIsSubmitting(false);
		}
	}, []);

	return { isSubmitting, error, clearError, run };
}
