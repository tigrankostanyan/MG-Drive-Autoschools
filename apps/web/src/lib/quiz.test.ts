import { describe, expect, it } from "vitest";
import { VITE_MEDIA_BASE } from "./env";
import {
	buildTestResult,
	countCorrect,
	filterReviewQuestions,
	findNextTest,
	formatTimeSpent,
	isAnswerCorrect,
	isTestPassed,
	normalizeQuestionOptions,
	PASS_THRESHOLD_PERCENT,
	type QuestionData,
	TEST_MINUTES,
	TEST_TOTAL_SECONDS,
	toCardQuestion,
} from "./quiz";

describe("quiz utilities", () => {
	describe("normalizeQuestionOptions", () => {
		it("should return empty array for undefined input", () => {
			expect(normalizeQuestionOptions(undefined)).toEqual([]);
		});

		it("should parse JSON string to string array", () => {
			const result = normalizeQuestionOptions('["Option A", "Option B", "Option C", "Option D"]');
			expect(result).toEqual(["Option A", "Option B", "Option C", "Option D"]);
		});

		it("should return string array as-is", () => {
			const result = normalizeQuestionOptions(["A", "B", "C", "D"]);
			expect(result).toEqual(["A", "B", "C", "D"]);
		});

		it("should handle object options with hy and text", () => {
			const options = [{ hy: "Հայերեն", text: "English" }, { text: "Solo Text" }, "Plain String"];
			const result = normalizeQuestionOptions(options);
			expect(result).toEqual(["Հայերեն", "Solo Text", "Plain String"]);
		});

		it("should degrade to empty array for malformed JSON", () => {
			const result = normalizeQuestionOptions("{ invalid json }");
			expect(result).toEqual([]);
		});

		it("should degrade to empty array for non-array JSON", () => {
			const result = normalizeQuestionOptions('"not an array"');
			expect(result).toEqual([]);
		});

		it("should handle mixed valid and invalid objects", () => {
			const options = [{ hy: "Valid", text: "Backup" }, { invalid: "object" }, 123, null];
			const result = normalizeQuestionOptions(options);
			expect(result).toEqual(["Valid", "", "123", ""]);
		});
	});

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

	describe("isAnswerCorrect", () => {
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

		it("should count correct answers", () => {
			expect(countCorrect(questions, { 1: 0 })).toBe(1);
			expect(countCorrect(questions, { 1: 1 })).toBe(0);
		});

		it("should handle empty question list", () => {
			expect(countCorrect([], { 1: 0 })).toBe(0);
		});
	});

	describe("isTestPassed", () => {
		it(`should pass when score >= ${PASS_THRESHOLD_PERCENT}%`, () => {
			expect(isTestPassed(8, 10)).toBe(true);
			expect(isTestPassed(4, 5)).toBe(true);
		});

		it("should fail when score < 80%", () => {
			expect(isTestPassed(7, 10)).toBe(false);
			expect(isTestPassed(6, 10)).toBe(false);
		});

		it("should handle edge case of 0 questions", () => {
			expect(isTestPassed(0, 0)).toBe(false);
		});
	});

	describe("formatTimeSpent", () => {
		it("should format seconds to minutes and seconds", () => {
			expect(formatTimeSpent(0)).toBe("0 վրկ");
			expect(formatTimeSpent(59)).toBe("59 վրկ");
			expect(formatTimeSpent(60)).toBe("1 ռ 0 վրկ");
			expect(formatTimeSpent(1800)).toBe("30 ռ 0 վրկ");
		});
	});

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

	describe("findNextTest", () => {
		const tests = [
			{ id: 1, title: "Test 1", number: 1, slug: "test-1" },
			{ id: 2, title: "Test 2", number: 2, slug: "test-2" },
			{ id: 3, title: "Test 3", number: 3, slug: "test-3" },
		];

		it("should find next test by id", () => {
			expect(findNextTest(tests, 1)?.id).toBe(2);
			expect(findNextTest(tests, 2)?.id).toBe(3);
		});

		it("should return null if current is last", () => {
			expect(findNextTest(tests, 3)).toBeNull();
		});

		it("should return null if current id not found", () => {
			expect(findNextTest(tests, 999)).toBeNull();
		});

		it("should return null for undefined input", () => {
			expect(findNextTest(undefined, 1)).toBeNull();
		});
	});

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
});

describe("constants", () => {
	it("should have correct TEST_MINUTES value", () => {
		expect(TEST_MINUTES).toBe(30);
	});

	it("should have correct TEST_TOTAL_SECONDS value", () => {
		expect(TEST_TOTAL_SECONDS).toBe(1800);
	});

	it("should have correct PASS_THRESHOLD_PERCENT value", () => {
		expect(PASS_THRESHOLD_PERCENT).toBe(80);
	});
});
