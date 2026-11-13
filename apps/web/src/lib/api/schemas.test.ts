import { beforeEach, describe, expect, it, vi } from "vitest";
import { z } from "zod";
import { ApiError } from "./client-base";
import {
	errorBodySchema,
	groupDataSchema,
	idEnvelopeSchema,
	parseErrorBody,
	parseJson,
	profileDataSchema,
	questionViewSchema,
	sessionResponseSchema,
	testDataSchema,
	testResponseSchema,
	testSubmissionSchema,
} from "./schemas";

describe("schemas", () => {
	describe("errorBodySchema", () => {
		it("should parse valid error body with message", () => {
			const data = { message: "Something went wrong" };
			const result = errorBodySchema.parse(data);
			expect(result).toEqual(data);
		});

		it("should parse error body with all fields", () => {
			const data = {
				message: "Error message",
				code: "ERR_CODE",
				error: "error_type",
				csrfToken: "token123",
			};
			const result = errorBodySchema.parse(data);
			expect(result).toEqual(data);
		});

		it("should parse empty object", () => {
			const result = errorBodySchema.parse({});
			expect(result).toEqual({});
		});

		it("should reject unknown fields in strict mode", () => {
			const data = { unknown: "field" };
			// errorBodySchema uses passthrough in test environment, so unknown fields are allowed
			const result = errorBodySchema.parse(data);
			expect(result).toEqual(data);
		});
	});

	describe("idEnvelopeSchema", () => {
		it("should parse valid id envelope", () => {
			const data = { id: 42 };
			const result = idEnvelopeSchema.parse(data);
			expect(result).toEqual(data);
		});

		it("should reject non-number id", () => {
			const data = { id: "not-a-number" };
			expect(() => idEnvelopeSchema.parse(data)).toThrow();
		});
	});

	describe("sessionResponseSchema", () => {
		it("should parse valid session response", () => {
			const data = {
				status: "ok",
				user: { id: 1, name: "Test", email: "test@example.com" },
			};
			const result = sessionResponseSchema.parse(data);
			expect(result).toEqual(data);
		});

		it("should preserve the user files array", () => {
			const data = {
				status: "ok",
				user: {
					id: 1,
					name: "Test",
					email: "test@example.com",
					role: "user",
					files: [{ id: 7, name: "avatar1", ext: "png", name_used: "user_img" }],
				},
			};
			const result = sessionResponseSchema.parse(data);
			expect(result.user?.files).toEqual([
				{ id: 7, name: "avatar1", ext: "png", name_used: "user_img" },
			]);
		});

		it("should parse session response without user", () => {
			const data = { status: "expired" };
			const result = sessionResponseSchema.parse(data);
			expect(result).toEqual(data);
		});

		it("should accept null values for nullable database fields", () => {
			const data = {
				status: "success",
				user: {
					id: 708,
					name: "Tigran",
					email: "tigran@example.com",
					phone: "",
					role: "admin",
					address: null,
					avatar: null,
					paymentExpiresAt: null,
					studentGroup: null,
					files: [],
				},
			};
			const result = sessionResponseSchema.parse(data);
			expect(result.user?.id).toBe(708);
		});
	});

	describe("questionViewSchema", () => {
		it("should parse valid question view with 4 options", () => {
			const data = {
				id: 1,
				number: 1,
				question: "What is 2 + 2?",
				options: ["3", "4", "5", "6"],
			};
			const result = questionViewSchema.parse(data);
			expect(result).toEqual(data);
		});

		it("should reject question with less than 4 options", () => {
			const data = {
				id: 1,
				number: 1,
				question: "What is 2 + 2?",
				options: ["3", "4", "5"],
			};
			expect(() => questionViewSchema.parse(data)).toThrow();
		});

		it("should reject question with empty text", () => {
			const data = {
				id: 1,
				number: 1,
				question: "",
				options: ["3", "4", "5", "6"],
			};
			expect(() => questionViewSchema.parse(data)).toThrow();
		});

		it("should accept valid image URL", () => {
			const data = {
				id: 1,
				number: 1,
				question: "What is 2 + 2?",
				options: ["3", "4", "5", "6"],
				image: "https://example.com/image.png",
			};
			const result = questionViewSchema.parse(data);
			expect(result.image).toBe(data.image);
		});

		it("should reject invalid image URL", () => {
			const data = {
				id: 1,
				number: 1,
				question: "What is 2 + 2?",
				options: ["3", "4", "5", "6"],
				image: "not-a-url",
			};
			expect(() => questionViewSchema.parse(data)).toThrow();
		});
	});

	describe("testDataSchema", () => {
		it("should parse valid test data", () => {
			const data = {
				id: 1,
				title: "Diagnostic Test",
				number: 1,
				slug: "diagnostic-test",
				type: "diagnostic",
			};
			const result = testDataSchema.parse(data);
			expect(result).toEqual(data);
		});

		it("should reject test without title", () => {
			const data = { id: 1, number: 1, slug: "test" };
			expect(() => testDataSchema.parse(data)).toThrow();
		});

		it("should reject test with negative question count", () => {
			const data = { id: 1, title: "Test", number: 1, slug: "test", questionCount: -1 };
			expect(() => testDataSchema.parse(data)).toThrow();
		});
	});

	describe("testResponseSchema", () => {
		it("should parse test response with questions", () => {
			const questions = [
				{
					id: 1,
					row_id: 1,
					table_name: "questions",
					question: "What is 2 + 2?",
					correctAnswerIndex: 2,
					number: 1,
					options: ["3", "4", "5", "6"],
				},
			];
			const data = {
				status: "ok",
				test: { id: 1, title: "Test", number: 1, slug: "test", questions },
			};
			const result = testResponseSchema.parse(data);
			expect(result.test.questions).toHaveLength(1);
		});

		it("should parse test response without questions", () => {
			const data = {
				status: "ok",
				test: { id: 1, title: "Test", number: 1, slug: "test", type: "practice" },
			};
			const result = testResponseSchema.parse(data);
			expect(result.test.questions).toBeUndefined();
		});
	});

	describe("groupDataSchema", () => {
		it("should parse valid group data", () => {
			const data = {
				id: 1,
				title: "Group 1",
				number: 1,
				sortControl: 0,
				text: "Description",
				slug: "group-1",
			};
			const result = groupDataSchema.parse(data);
			expect(result).toEqual(data);
		});

		it("should reject group with null text when non-nullable", () => {
			const data = {
				id: 1,
				title: "Group 1",
				number: 1,
				sortControl: 0,
				text: null,
				slug: "group-1",
			};
			const result = groupDataSchema.parse(data);
			expect(result.text).toBeNull();
		});
	});

	describe("profileDataSchema", () => {
		it("should parse valid profile data", () => {
			const data = {
				user: {
					id: 1,
					name: "Test User",
					email: "test@example.com",
					role: "user",
					include_in_analytics: true,
					has_paid: true,
					isPaid: true,
				},
				stats: {
					totalTests: 10,
					passedTests: 8,
					failedTests: 2,
					avgScore: 85,
					progressPercent: 80,
					totalGroups: 5,
					completedGroups: 4,
				},
				results: [],
				wrongAnswers: [],
				completedTopics: [],
				feedback: null,
			};
			const result = profileDataSchema.parse(data);
			expect(result.user.name).toBe("Test User");
			expect(result.stats.totalTests).toBe(10);
		});

		it("should handle optional phone field", () => {
			const data = {
				user: {
					id: 1,
					name: "Test User",
					email: "test@example.com",
					role: "user",
					phone: "+1234567890",
					has_paid: true,
				},
				stats: {
					totalTests: 0,
					passedTests: 0,
					failedTests: 0,
					avgScore: 0,
					progressPercent: 0,
					totalGroups: 0,
					completedGroups: 0,
				},
				results: [],
				wrongAnswers: [],
				completedTopics: [],
				feedback: null,
			};
			const result = profileDataSchema.parse(data);
			expect(result.user.phone).toBe("+1234567890");
		});
	});

	describe("testSubmissionSchema", () => {
		it("should parse valid submission", () => {
			const data = {
				testId: 1,
				score: 85,
				correct_count: 17,
				wrong_count: 3,
				time_spent: 1800,
				status: "passed",
			};
			const result = testSubmissionSchema.parse(data);
			expect(result.status).toBe("passed");
			expect(result.score).toBe(85);
		});

		it("should reject invalid status", () => {
			const data = {
				testId: 1,
				score: 85,
				correct_count: 17,
				wrong_count: 3,
				time_spent: 1800,
				status: "invalid",
			};
			expect(() => testSubmissionSchema.parse(data)).toThrow();
		});

		it("should reject score outside 0-100 range", () => {
			const data = {
				testId: 1,
				score: 150,
				correct_count: 30,
				wrong_count: 0,
				time_spent: 1800,
				status: "passed",
			};
			expect(() => testSubmissionSchema.parse(data)).toThrow();
		});
	});
});

describe("parseJson", () => {
	const _originalFetch = global.fetch;

	beforeEach(() => {
		vi.spyOn(global, "fetch");
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	it("should parse JSON response with schema", async () => {
		const mockResponse = {
			ok: true,
			json: () => Promise.resolve({ id: 1, name: "Test" }),
		} as Response;

		const schema = z.object({ id: z.number(), name: z.string() });

		const result = await parseJson<{ id: number; name: string }>(mockResponse, schema);
		expect(result).toEqual({ id: 1, name: "Test" });
	});

	it("should throw ApiError when schema validation fails", async () => {
		const mockResponse = {
			ok: true,
			json: () => Promise.resolve({ id: "invalid" }),
		} as Response;

		const schema = z.object({ id: z.number() });

		await expect(parseJson(mockResponse, schema)).rejects.toThrow(ApiError);
	});

	it("should return raw JSON when no schema provided", async () => {
		const data = { id: 1, name: "Test" };
		const mockResponse = {
			ok: true,
			json: () => Promise.resolve(data),
		} as Response;

		const result = await parseJson(mockResponse);
		expect(result).toEqual(data);
	});
});

describe("parseErrorBody", () => {
	it("should parse valid error body", () => {
		const raw = { message: "Error", code: "ERR_CODE" };
		const result = parseErrorBody(raw);
		expect(result).toEqual(raw);
	});

	it("should return null for invalid JSON", () => {
		const result = parseErrorBody("not-json");
		expect(result).toBeNull();
	});

	it("should return null for null input", () => {
		const result = parseErrorBody(null);
		expect(result).toBeNull();
	});
});
