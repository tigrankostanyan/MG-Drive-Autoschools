import { describe, expect, it } from "vitest";
import type { QuestionData } from "./api";
import { VITE_MEDIA_BASE } from "./env";
import { toCardQuestion } from "./quiz";

describe("toCardQuestion", () => {
	const mockQuestion: QuestionData = {
		id: 1,
		row_id: 1,
		table_name: "questions",
		question: "What is 2 + 2?",
		correctAnswerIndex: 2,
		number: 1,
		options: ["Wrong", "Wrong", "Correct", "Wrong"],
		explanation: "Because 2+2=4",
	};

	it("should convert question data to card format", () => {
		const result = toCardQuestion(mockQuestion, 0);
		expect(result).toEqual({
			id: 1,
			text: "What is 2 + 2?",
			options: ["Wrong", "Wrong", "Correct", "Wrong"],
			correct: 1,
			explanation: "Because 2+2=4",
			imageUrl: null,
			number: 1,
		});
	});

	it("should adjust correct index to 0-based", () => {
		const result = toCardQuestion(mockQuestion, 0);
		expect(result.correct).toBe(1);
	});

	it("should add image URL when file is present", () => {
		const questionWithFile = { ...mockQuestion, files: [{ id: 1, name: "image1", ext: "png" }] };
		const result = toCardQuestion(questionWithFile, 0);
		expect(result.imageUrl).toBe(`${VITE_MEDIA_BASE}/images/questions/large/image1.png`);
	});

	it("should use index for card numbering", () => {
		const result = toCardQuestion(mockQuestion, 5);
		expect(result.number).toBe(6);
	});
});
