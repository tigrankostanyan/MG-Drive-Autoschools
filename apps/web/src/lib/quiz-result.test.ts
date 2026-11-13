import { describe, expect, it } from "vitest";
import type { QuestionData } from "./api";
import { buildTestResult } from "./quiz";

describe("buildTestResult", () => {
	const questions: QuestionData[] = [
		{
			id: 1,
			row_id: 1,
			table_name: "q",
			question: "Q1",
			correctAnswerIndex: 1,
			number: 1,
			options: ["A", "B", "C", "D"],
		},
	];

	it("should build correct result payload", () => {
		const result = buildTestResult({
			testId: 1,
			questions,
			answers: { 1: 0 },
			totalSeconds: 1800,
			timeLeftSeconds: 600,
		});

		expect(result).toEqual({
			testId: 1,
			score: 100,
			correct_count: 1,
			wrong_count: 0,
			time_spent: 1200,
			status: "passed",
		});
	});

	it("should mark test as passed when score >= 80%", () => {
		const result = buildTestResult({
			testId: 1,
			questions,
			answers: { 1: 0 },
			totalSeconds: 1800,
			timeLeftSeconds: 0,
		});

		expect(result.status).toBe("passed");
		expect(result.score).toBe(100);
	});

	it("should calculate time spent correctly", () => {
		const result = buildTestResult({
			testId: 1,
			questions: [],
			answers: {},
			totalSeconds: 1800,
			timeLeftSeconds: 0,
		});

		expect(result.time_spent).toBe(1800);
	});
});
