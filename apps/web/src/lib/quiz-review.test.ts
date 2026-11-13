import { describe, expect, it } from "vitest";
import type { QuestionData } from "./api";
import { filterReviewQuestions } from "./quiz";

describe("filterReviewQuestions", () => {
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
		{
			id: 2,
			row_id: 2,
			table_name: "q",
			question: "Q2",
			correctAnswerIndex: 2,
			number: 2,
			options: ["A", "B", "C", "D"],
		},
	];

	it("should return all questions when filter is 'all'", () => {
		const result = filterReviewQuestions(questions, {}, "all");
		expect(result).toHaveLength(2);
	});

	it("should return only correct answers when filter is 'correct'", () => {
		const answers = { 1: 0, 2: 1 };
		const result = filterReviewQuestions(questions, answers, "correct");
		expect(result).toHaveLength(2);
	});

	it("should return only incorrect answers when filter is 'incorrect'", () => {
		const answers = { 1: 0, 2: 1 };
		const result = filterReviewQuestions(questions, answers, "incorrect");
		expect(result).toHaveLength(0);
	});

	it("should preserve original index", () => {
		const result = filterReviewQuestions(questions, {}, "all");
		expect(result[0].originalIndex).toBe(0);
		expect(result[1].originalIndex).toBe(1);
	});
});
