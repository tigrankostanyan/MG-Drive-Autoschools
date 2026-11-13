import { z } from "zod";
import { idEnvelopeSchema } from "./schemas";

const listMeta = z
	.object({
		page: z.number(),
		limit: z.number(),
		totalPages: z.number(),
		totalCount: z.number(),
	})
	.passthrough();

/** Generic paginated response envelope. Use with z.infer to derive item types. */
export const paginatedResponseSchema = <T extends z.ZodType>(itemSchema: T) =>
	z.object({ data: z.array(itemSchema), meta: listMeta }).passthrough();

/** Generic data list envelope. Use with z.infer to derive item types. */
export const dataListResponseSchema = <T extends z.ZodType>(itemSchema: T) =>
	z.object({ data: z.array(itemSchema) }).passthrough();

/** Generic tests response envelope. Use with z.infer to derive item types. */
export const testsResponseSchema = <T extends z.ZodType>(itemSchema: T) =>
	z.object({ tests: z.array(itemSchema) }).passthrough();

export const questionsResponseSchema = z
	.object({
		questions: z.array(
			z.object({ id: z.number(), row_id: z.number(), table_name: z.string() }).passthrough(),
		),
	})
	.passthrough();

export const usersResponseSchema = z.object({ users: z.array(idEnvelopeSchema) }).passthrough();

export const faqsResponseSchema = z.object({ faqs: z.array(idEnvelopeSchema) }).passthrough();

export const faqCategoriesResponseSchema = z
	.object({ categories: z.array(z.string()) })
	.passthrough();

export const registrationsResponseSchema = z
	.object({ registrations: z.array(idEnvelopeSchema) })
	.passthrough();

/** `{ data, summary }` dashboard analytics envelope. */
export const dashboardAnalyticsResponseSchema = z
	.object({
		data: z
			.object({
				activityData: z.array(
					z.object({ date: z.string(), tests: z.number(), passes: z.number() }).passthrough(),
				),
				categoryData: z.array(
					z
						.object({
							name: z.string(),
							value: z.number(),
							color: z.string(),
						})
						.passthrough(),
				),
			})
			.passthrough(),
	})
	.passthrough();
