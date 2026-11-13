import { describe, expect, it } from "vitest";
import type { QuestionData } from "./api";
import { countCorrect, isAnswerCorrect } from "./quiz";

describe("isAnswerCorrect and countCorrect", () => {
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

	describe("isAnswerCorrect", () => {
		it("should return true for correct answer", () => {
			expect(isAnswerCorrect(questions[0], { 1: 0 })).toBe(true);
			expect(isAnswerCorrect(questions[0], { 1: 1 })).toBe(false);
		});

		it("should return false for wrong answer", () => {
			const answers: Record<number, number> = { 1: 1 };
			expect(isAnswerCorrect(questions[0], answers)).toBe(false);
		});

		it("should handle missing answer", () => {
			const answers: Record<number, number> = {};
			expect(isAnswerCorrect(questions[0], answers)).toBe(false);
		});
	});

	describe("countCorrect", () => {
		it("should count correct answers", () => {
			expect(countCorrect(questions, { 1: 0 })).toBe(1);
			expect(countCorrect(questions, { 1: 1 })).toBe(0);
		});

		it("should handle empty question list", () => {
			expect(countCorrect([], { 1: 0 })).toBe(0);
		});
	});
});
