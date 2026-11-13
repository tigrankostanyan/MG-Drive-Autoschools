import { z } from "zod";
import { ApiError, type ErrorBody } from "./client-base";

const HTTP_BAD_GATEWAY = 502;

// Strict mode in prod, flexible in dev
const isProduction = typeof import.meta !== "undefined" && import.meta.env?.MODE === "production";

// CORE API SCHEMAS - STRICT IN PRODUCTION
export const errorBodySchema = z
	.object({
		message: z.string().optional(),
		code: z.string().optional(),
		error: z.string().optional(),
		csrfToken: z.string().optional(),
	})
	[isProduction ? "strict" : "passthrough"]();

export const idEnvelopeSchema = z
	.object({ id: z.number().int().positive() })
	[isProduction ? "strict" : "passthrough"]();

// TEST-SPECIFIC SCHEMAS

// Client-safe question view - excludes correctAnswerIndex
export const testQuestionViewSchema = z
	.object({
		id: z.number().int().positive(),
		number: z.number().int().min(1),
		question: z.string().min(1, "Question text is required"),
		options: z.array(z.string().min(1)).length(4, "Exactly 4 options required"),
		image: z.string().url().optional(),
		files: z
			.array(
				z.object({
					id: z.number().optional(),
					name: z.string(),
					ext: z.string(),
					name_used: z.string().optional(),
				}),
			)
			.optional(),
		imageUrl: z.string().nullable().optional(),
	})
	.strict();

// Test metadata for listing
export const testMetadataSchema = z
	.object({
		id: z.number().int().positive(),
		title: z.string().min(1),
		number: z.number().int().min(1),
		slug: z.string(),
		questionCount: z.number().int().min(0),
	})
	.strict();

// Test session payload
export const testSessionPayloadSchema = z
	.object({
		testId: z.number().int().positive(),
	})
	.strict();

// Test session response
export const testSessionResponseSchema = z
	.object({
		sessionId: z.string().uuid(),
		testId: z.number().int().positive(),
		questionCount: z.number().int().min(1),
		timeLimitSeconds: z.number().int().min(60).max(3600),
	})
	.strict();

// Question fetch request
export const questionFetchRequestSchema = z
	.object({
		sessionId: z.string().uuid(),
		questionIndex: z.number().int().min(0),
	})
	.strict();

// Single question response for streaming
export const questionStreamResponseSchema = z
	.object({
		question: testQuestionViewSchema,
		nextQuestionIndex: z.number().int().min(0),
		hasNext: z.boolean(),
	})
	.strict();

// Test submission payload with strict bounds
export const testSubmissionSchema = z
	.object({
		sessionId: z.string().uuid(),
		testId: z.number().int().positive(),
		answers: z.record(z.number().int(), z.number().int().min(0).max(3)),
		timeSpent: z.number().int().min(0).max(36000), // 10 minutes max per test
	})
	.strict();

// Test submission result
export const testSubmissionResultSchema = z
	.object({
		status: z.enum(["success", "error"]),
		saved: z.boolean(),
		score: z.number().min(0).max(100),
		correctCount: z.number().int().min(0),
		wrongCount: z.number().int().min(0),
		passed: z.boolean(),
	})
	.strict();

// Paginated tests response
export const paginatedTestsResponseSchema = z
	.object({
		tests: z.array(testMetadataSchema),
		meta: z.object({
			page: z.number().int().min(1),
			limit: z.number().int().min(1).max(100),
			totalPages: z.number().int().min(1),
			totalCount: z.number().int().min(0),
		}),
	})
	.strict();

// Parse JSON with schema validation
export async function parseJson<T>(res: Response, schema?: z.ZodType<T>): Promise<T> {
	const raw: unknown = await res.json();
	if (schema) {
		const result = schema.safeParse(raw);
		if (!result.success) {
			throw new ApiError("Unexpected API response payload", HTTP_BAD_GATEWAY);
		}
		return result.data;
	}
	return raw as T;
}

// Narrow error body or return null
export function parseErrorBody(raw: unknown): ErrorBody | null {
	const parsed = errorBodySchema.safeParse(raw);
	return parsed.success ? parsed.data : null;
}
