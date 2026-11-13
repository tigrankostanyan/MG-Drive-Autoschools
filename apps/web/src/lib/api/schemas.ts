import { z } from "zod";
import { ApiError, type ErrorBody } from "./client-base";

const HTTP_BAD_GATEWAY = 502;

// Use import.meta.env.MODE for Vite SSR/Edge compatibility (Cloudflare Workers)
const isStrictMode = typeof import.meta !== "undefined" && import.meta.env?.MODE === "production";

export const errorBodySchema = z
	.object({
		message: z.string().optional(),
		code: z.string().optional(),
		error: z.string().optional(),
		csrfToken: z.string().optional(),
	})
	[isStrictMode ? "strict" : "passthrough"]();

export const csrfResponseSchema = z
	.object({ csrfToken: z.string().optional() })
	[isStrictMode ? "strict" : "passthrough"]();

export const idEnvelopeSchema = z
	.object({ id: z.number() })
	[isStrictMode ? "strict" : "passthrough"]();

export const sessionUserSchema = z
	.object({
		id: z.number(),
		name: z.string(),
		email: z.string(),
		phone: z.string().nullish(),
		role: z.string().nullish(),
		address: z.string().nullish(),
		include_in_analytics: z.boolean().nullish(),
		has_paid: z.boolean().nullish(),
		isPaid: z.boolean().nullish(),
		paymentExpiresAt: z.string().nullish(),
		avatar: z.string().nullish(),
		sortControl: z.number().nullish(),
		createdAt: z.string().nullish(),
		files: z
			.array(
				z
					.object({
						id: z.number().nullish(),
						name: z.string(),
						ext: z.string(),
						name_used: z.string().nullish(),
					})
					.passthrough(),
			)
			.nullish(),
		studentGroup: z
			.object({
				grantStudentAccess: z.boolean().nullish(),
				activeFrom: z.string().nullish(),
				activeUntil: z.string().nullish(),
			})
			.passthrough()
			.nullish(),
	})
	.passthrough();

export const sessionResponseSchema = z
	.object({ status: z.string().optional(), user: sessionUserSchema.nullish() })
	.passthrough();

export const refreshResponseSchema = z
	.object({ user: sessionUserSchema.nullish(), token: z.string().optional() })
	.passthrough();

export const updateMeResponseSchema = z.object({ user: sessionUserSchema }).passthrough();

export const googleAuthResponseSchema = z.object({ user: sessionUserSchema }).passthrough();

// Question option support (admin side, has multilingual support)
const questionOptionSchema = z.union([
	z.string(),
	z
		.object({
			hy: z.string().optional(),
			text: z.string().optional(),
		})
		.passthrough(),
]);

export const questionOptionSchemaArray = z
	.union([z.string(), z.array(questionOptionSchema)])
	.nullable();

// File data for questions
const fileDataSchema = z.object({
	id: z.number(),
	name: z.string(),
	ext: z.string(),
	name_used: z.string().optional(),
	sizes: z
		.object({
			large: z.string().optional(),
			small: z.string().optional(),
		})
		.passthrough()
		.optional(),
});

// QuestionData (admin side; correctAnswerIndex/explanation only present for admins)
export const questionDataSchema = z
	.object({
		id: z.number(),
		row_id: z.number().optional(),
		table_name: z.string().optional(),
		question: z.string(),
		correctAnswerIndex: z.number().optional(),
		number: z.number(),
		options: questionOptionSchemaArray,
		explanation: z.string().optional(),
		date: z.string().optional(),
		createdAt: z.string().optional(),
		updatedAt: z.string().optional(),
		files: z.array(fileDataSchema).optional(),
		owner: z
			.object({
				type: z.string(),
				data: z.object({
					number: z.number().optional(),
				}),
			})
			.passthrough()
			.optional(),
	})
	.passthrough()
	.strict();

// QuestionView (client side, simplified for test questions)
export const questionViewSchema = z
	.object({
		id: z.number().int(),
		number: z.number().int().min(1),
		question: z.string().min(1, "Question text is required"),
		options: z.array(z.string()).length(4, "Exactly 4 options required"),
		image: z.string().url().optional(),
	})
	.strict();

// TestData
export const testDataSchema = z
	.object({
		id: z.number().int(),
		title: z.string().min(1),
		number: z.number().int().min(1),
		slug: z.string(),
		type: z.string().optional(),
		questionCount: z.number().int().min(0).optional(),
		timeLimit: z.number().optional(),
	})
	.passthrough();

// Test with optional questions (response from fetchTest)
export const testResponseSchema = z
	.object({
		status: z.string().optional(),
		test: z
			.object({
				id: z.number().int(),
				title: z.string(),
				number: z.number().int(),
				slug: z.string(),
				type: z.string().optional(),
				questions: z.array(questionDataSchema).optional(),
			})
			.passthrough(),
	})
	.passthrough();

// Group data schema
export const groupDataSchema = z
	.object({
		id: z.number().int(),
		title: z.string(),
		number: z.number().int(),
		sortControl: z.number(),
		text: z.string().nullable(),
		slug: z.string(),
		date: z.string().optional(),
		questions: z.array(z.object({ id: z.number() }).passthrough()).optional(),
		questionCount: z.number().int().optional(),
	})
	.passthrough();

// Group response envelope schema
export const groupResponseSchema = z
	.object({
		status: z.string().optional(),
		group: groupDataSchema,
	})
	.passthrough();

// Profile data schemas

// ProfileResult
export const profileResultSchema = z
	.object({
		id: z.number(),
		testId: z.number(),
		groupId: z.number().nullable(),
		testTitle: z.string(),
		groupTitle: z.string().nullable(),
		score: z.number(),
		correctCount: z.number(),
		wrongCount: z.number(),
		timeSpent: z.number().nullable(),
		status: z.string(),
		createdAt: z.string(),
	})
	.passthrough();

// ProfileFeedback
export const profileFeedbackSchema = z
	.object({
		id: z.number(),
		rating: z.number().nullable(),
		name: z.string().nullable(),
		type: z.string().nullable(),
		comment: z.string().nullable(),
		date: z.string().nullable(),
	})
	.passthrough()
	.nullable();

// ProfileCompletedTopic
export const profileCompletedTopicSchema = z
	.object({
		groupId: z.number(),
		title: z.string(),
		answeredCount: z.number(),
		totalQuestions: z.number(),
	})
	.passthrough();

// ProfileStats
export const profileStatsSchema = z
	.object({
		totalTests: z.number(),
		passedTests: z.number(),
		failedTests: z.number(),
		avgScore: z.number(),
		progressPercent: z.number(),
		totalGroups: z.number(),
		completedGroups: z.number(),
	})
	.passthrough();

// ProfileData
export const profileDataSchema = z
	.object({
		user: sessionUserSchema,
		stats: profileStatsSchema,
		results: z.array(profileResultSchema),
		wrongAnswers: z.array(profileResultSchema),
		completedTopics: z.array(profileCompletedTopicSchema),
		feedback: profileFeedbackSchema,
	})
	.passthrough();

// Test session response schemas
export const testSessionResponseSchema = z
	.object({
		status: z.string().optional(),
		sessionId: z.string(),
		testId: z.number().int(),
		questionCount: z.number().int(),
		timeLimitSeconds: z.number().int(),
	})
	.passthrough();

export const questionStreamResponseSchema = z
	.object({
		question: questionViewSchema,
		nextQuestionIndex: z.number().int().min(0),
		hasNext: z.boolean(),
	})
	.passthrough();

export const testSubmissionResultSchema = z
	.object({
		status: z.enum(["success", "error"]),
		saved: z.boolean(),
		score: z.number(),
		correctCount: z.number(),
		wrongCount: z.number(),
		passed: z.boolean(),
	})
	.passthrough();

// Group-related response schemas
export const groupQuestionsResponseSchema = z
	.object({
		status: z.string().optional(),
		data: z.object({
			total: z.number().int(),
			questions: z.array(questionDataSchema),
		}),
	})
	.passthrough();

export const groupProgressResponseSchema = z
	.object({
		status: z.string().optional(),
		answers: z.record(z.number()),
	})
	.passthrough();

export const answerCheckResponseSchema = z
	.object({
		status: z.string().optional(),
		results: z.array(
			z
				.object({
					id: z.number(),
					found: z.boolean(),
					correct: z.boolean().optional(),
					correctAnswerIndex: z.number().optional(),
					explanation: z.string().optional(),
				})
				.passthrough(),
		),
	})
	.passthrough();

// Profile-related response schemas

// Profile progress envelope (matches /profile/progress endpoint)
const profileProgressDataSchema = z
	.object({
		progressPercent: z.number(),
		completedGroups: z.number(),
		totalGroups: z.number(),
		groups: z.array(
			z
				.object({
					groupId: z.number(),
					title: z.string(),
					number: z.number().nullable(),
					answeredCount: z.number(),
					totalQuestions: z.number(),
					hasProgress: z.boolean(),
					updatedAt: z.string().nullable(),
				})
				.passthrough(),
		),
	})
	.passthrough();

export const profileProgressResponseSchema = z
	.object({
		status: z.string().optional(),
		data: profileProgressDataSchema,
	})
	.passthrough();

// Profile response envelope (matches /profile endpoint)
export const profileResponseSchema = z
	.object({
		status: z.string().optional(),
		data: profileDataSchema,
	})
	.passthrough();

// Test schema definitions

export const questionOptionViewSchema = z.object({
	id: z.number().int(),
	text: z.string().min(1, "Option cannot be empty"),
});

export const testQuestionViewSchema = z
	.object({
		id: z.number().int(),
		number: z.number().int().min(1),
		question: z.string().min(1, "Question text is required"),
		options: z.array(z.string()).length(4, "Exactly 4 options required"),
		image: z.string().url().optional(),
	})
	.strict();

export const testMetadataSchema = z
	.object({
		id: z.number().int(),
		title: z.string().min(1),
		number: z.number().int().min(1),
		slug: z.string(),
		questionCount: z.number().int().min(0),
	})
	.strict();

export const testSubmissionSchema = z
	.object({
		testId: z.number().int().positive(),
		score: z.number().min(0).max(100),
		correct_count: z.number().int().min(0),
		wrong_count: z.number().int().min(0),
		time_spent: z.number().int().min(0).max(3600),
		status: z.enum(["passed", "failed"]),
	})
	.strict();

export const testSessionSchema = z
	.object({
		testId: z.number().int().positive(),
	})
	.strict();

export const questionFetchResponseSchema = z
	.object({
		question: testQuestionViewSchema,
		nextQuestionIndex: z.number().int().min(0).optional(),
	})
	.strict();

export async function parseJson<T>(res: Response, schema?: z.ZodType): Promise<T> {
	const raw: unknown = await res.json();
	if (schema) {
		const result = schema.safeParse(raw);
		if (!result.success) {
			throw new ApiError("Unexpected API response payload", HTTP_BAD_GATEWAY);
		}
		return result.data as T;
	}
	return raw as T;
}

export function parseErrorBody(raw: unknown): ErrorBody | null {
	const parsed = errorBodySchema.safeParse(raw);
	return parsed.success ? parsed.data : null;
}
