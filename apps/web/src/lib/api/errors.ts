import { ApiError } from "./client";

// Normalized API error structure for consistent error handling across the app.
export interface ApiErrorData {
	message: string;
	status: number;
	isAuthError: boolean; // 401, 403
	isNetworkError: boolean;
	isValidationError: boolean;
	code: string;
}

// Transforms various error types into a normalized ApiErrorData structure.
export function normalizeError(err: unknown): ApiErrorData {
	if (err instanceof ApiError) {
		const status = err.status;
		const message = err.message || "Առաջացավ սխալ";

		const isAuthError = status === 401 || status === 403;
		const isNetworkError = status === 0;
		const isValidationError = status === 400 || status === 422;

		return {
			message,
			status,
			isAuthError,
			isNetworkError,
			isValidationError,
			code: isAuthError ? "TOKEN_EXPIRED" : "",
		};
	}

	if (err instanceof Error) {
		return {
			message: err.message || "Առաջացավ սխալ",
			status: 500,
			isAuthError: false,
			isNetworkError: false,
			isValidationError: false,
			code: "",
		};
	}

	return {
		message: "Առաջացավ սխալ",
		status: 500,
		isAuthError: false,
		isNetworkError: false,
		isValidationError: false,
		code: "",
	};
}
