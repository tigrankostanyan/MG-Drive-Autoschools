import { type FileItem, getQuestionImageUrl, getUserImageUrl } from "../media";

export const BASE = "/api/v1";

export type ErrorBody = {
	message?: string | undefined;
	code?: string | undefined;
	/** `authenticate` middleware failure reason, e.g. `kicked_out`. */
	error?: string | undefined;
	csrfToken?: string | undefined;
};

export class ApiError extends Error {
	readonly status: number;
	constructor(message: string, status = 500) {
		super(message);
		this.name = "ApiError";
		this.status = status;
	}
}

export type { FileItem };
export { getQuestionImageUrl, getUserImageUrl };
