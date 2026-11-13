import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useTestRunner } from "./use-test-runner";

describe("useTestRunner", () => {
	const mockLoaderData = {
		test: { id: 1, title: "Test 1", number: 1, slug: "test-1" },
		questions: [
			{
				id: 1,
				row_id: 1,
				table_name: "questions",
				question: "Question 1",
				correctAnswerIndex: 1,
				number: 1,
				options: ["A", "B", "C", "D"],
			},
			{
				id: 2,
				row_id: 2,
				table_name: "questions",
				question: "Question 2",
				correctAnswerIndex: 2,
				number: 2,
				options: ["A", "B", "C", "D"],
			},
		],
		allTests: [
			{ id: 1, title: "Test 1", number: 1, slug: "test-1" },
			{ id: 2, title: "Test 2", number: 2, slug: "test-2" },
		],
	};

	beforeEach(() => {
		vi.useFakeTimers();
		vi.spyOn(global, "addEventListener");
		vi.spyOn(global, "removeEventListener");
	});

	afterEach(() => {
		vi.useRealTimers();
		vi.restoreAllMocks();
	});

	it("should initialize with correct default values", () => {
		const { result } = renderHook(() => useTestRunner(mockLoaderData));

		expect(result.current.current).toBe(0);
		expect(result.current.answers).toEqual({});
		expect(result.current.finished).toBe(false);
		expect(result.current.left).toBe(1800);
		expect(result.current.reviewFilter).toBe("all");
	});

	it("should select answer and update answers state", () => {
		const { result } = renderHook(() => useTestRunner(mockLoaderData));

		act(() => {
			result.current.selectAnswer(1, 0);
		});

		expect(result.current.answers).toEqual({ 1: 0 });
	});

	it("should navigate to next question on Enter when not finished", () => {
		const { result } = renderHook(() => useTestRunner(mockLoaderData));

		act(() => {
			result.current.selectAnswer(1, 0);
		});

		act(() => {
			const event = new KeyboardEvent("keydown", { key: "Enter" });
			window.dispatchEvent(event);
		});

		expect(result.current.current).toBe(1);
	});

	it("should finish test when reaching last question", async () => {
		const { result } = renderHook(() => useTestRunner(mockLoaderData));

		act(() => {
			result.current.selectAnswer(1, 0);
		});

		act(() => {
			const event = new KeyboardEvent("keydown", { key: "Enter" });
			window.dispatchEvent(event);
		});

		// Navigate to last question
		act(() => {
			result.current.selectAnswer(2, 1);
		});

		act(() => {
			const event = new KeyboardEvent("keydown", { key: "Enter" });
			window.dispatchEvent(event);
		});

		expect(result.current.finished).toBe(true);
	});

	it("should calculate correct and wrong counts", () => {
		const { result } = renderHook(() => useTestRunner(mockLoaderData));

		act(() => {
			result.current.selectAnswer(1, 0);
			result.current.selectAnswer(2, 1);
		});

		expect(result.current.correctCount).toBe(2);
		expect(result.current.wrongCount).toBe(0);
	});

	it("should mark test as passed when score >= 80%", () => {
		const { result } = renderHook(() => useTestRunner(mockLoaderData));

		act(() => {
			result.current.selectAnswer(1, 0);
		});

		// Only 1 of 2 correct = 50% < 80%
		expect(result.current.isPassed).toBe(false);
	});

	it("should mark test as passed when score >= 80%", () => {
		const { result } = renderHook(() => useTestRunner(mockLoaderData));

		act(() => {
			result.current.selectAnswer(1, 0);
			result.current.selectAnswer(2, 1);
		});

		// Both correct = 100% >= 80%
		expect(result.current.correctCount).toBe(2);
		expect(result.current.wrongCount).toBe(0);
		expect(result.current.isPassed).toBe(true);
	});

	it("should not start timer until first answer is selected, then countdown", () => {
		const { result } = renderHook(() => useTestRunner(mockLoaderData));

		expect(result.current.hasStarted).toBe(false);
		expect(result.current.left).toBe(1800);

		// Advancing time before answer does not decrement timer
		act(() => {
			vi.advanceTimersByTime(10 * 1000);
		});
		expect(result.current.left).toBe(1800);

		// First answer selection starts timer
		act(() => {
			result.current.selectAnswer(1, 0);
		});
		expect(result.current.hasStarted).toBe(true);

		// Advancing time now decrements timer
		act(() => {
			vi.advanceTimersByTime(10 * 1000);
		});
		expect(result.current.left).toBe(1790);
	});

	it("should finish test when timer expires", () => {
		vi.setSystemTime(new Date(0));

		const { result } = renderHook(() => useTestRunner(mockLoaderData));

		act(() => {
			result.current.selectAnswer(1, 0);
		});

		act(() => {
			vi.advanceTimersByTime(1800 * 1000);
		});

		expect(result.current.finished).toBe(true);
		expect(result.current.askSave).toBe(true);
	});

	it("should allow changing answer up to 3 times per question and then lock", () => {
		const { result } = renderHook(() => useTestRunner(mockLoaderData));

		// Initial selection (0 changes used)
		act(() => {
			result.current.selectAnswer(1, 0);
		});
		expect(result.current.answers[1]).toBe(0);
		expect(result.current.answerChanges[1] ?? 0).toBe(0);

		// Selecting same option is a no-op
		act(() => {
			result.current.selectAnswer(1, 0);
		});
		expect(result.current.answerChanges[1] ?? 0).toBe(0);

		// 1st change
		act(() => {
			result.current.selectAnswer(1, 1);
		});
		expect(result.current.answers[1]).toBe(1);
		expect(result.current.answerChanges[1]).toBe(1);

		// 2nd change
		act(() => {
			result.current.selectAnswer(1, 2);
		});
		expect(result.current.answers[1]).toBe(2);
		expect(result.current.answerChanges[1]).toBe(2);

		// 3rd change
		act(() => {
			result.current.selectAnswer(1, 3);
		});
		expect(result.current.answers[1]).toBe(3);
		expect(result.current.answerChanges[1]).toBe(3);

		// 4th change attempt: blocked
		act(() => {
			result.current.selectAnswer(1, 0);
		});
		expect(result.current.answers[1]).toBe(3);
		expect(result.current.answerChanges[1]).toBe(3);

		// Question 2 is independent and can still be answered and changed
		act(() => {
			result.current.selectAnswer(2, 0);
		});
		expect(result.current.answers[2]).toBe(0);
		expect(result.current.answerChanges[2] ?? 0).toBe(0);

		act(() => {
			result.current.selectAnswer(2, 1);
		});
		expect(result.current.answers[2]).toBe(1);
		expect(result.current.answerChanges[2]).toBe(1);
	});

	it("should provide next test", () => {
		const { result } = renderHook(() => useTestRunner(mockLoaderData));

		expect(result.current.nextTest).toEqual({ id: 2, title: "Test 2", number: 2, slug: "test-2" });
	});

	it("should return null nextTest when current is last test", () => {
		const lastTestLoaderData = {
			test: { id: 2, title: "Test 2", number: 2, slug: "test-2" },
			questions: [],
			allTests: [{ id: 2, title: "Test 2", number: 2, slug: "test-2" }],
		};

		const { result } = renderHook(() => useTestRunner(lastTestLoaderData));

		expect(result.current.nextTest).toBeNull();
	});

	it("should filter questions correctly for review", () => {
		const { result } = renderHook(() => useTestRunner(mockLoaderData));

		act(() => {
			result.current.selectAnswer(1, 0);
			result.current.selectAnswer(2, 2);
		});

		act(() => {
			result.current.setReviewFilter("incorrect");
		});

		expect(result.current.filteredQuestions).toHaveLength(1);
		expect(result.current.filteredQuestions[0].q.id).toBe(2);
	});

	it("should switch review filter", () => {
		const { result } = renderHook(() => useTestRunner(mockLoaderData));

		act(() => {
			result.current.setReviewFilter("correct");
		});

		expect(result.current.reviewFilter).toBe("correct");
	});

	it("should reset state correctly", () => {
		const { result } = renderHook(() => useTestRunner(mockLoaderData));

		act(() => {
			result.current.selectAnswer(1, 0);
			act(() => {
				result.current.finishRun();
			});
		});

		expect(result.current.finished).toBe(true);

		act(() => {
			result.current.reset();
		});

		expect(result.current.current).toBe(0);
		expect(result.current.answers).toEqual({});
		expect(result.current.answerChanges).toEqual({});
		expect(result.current.hasStarted).toBe(false);
		expect(result.current.finished).toBe(false);
		expect(result.current.left).toBe(1800);
		expect(result.current.reviewFilter).toBe("all");
	});

	it("should finish run programmatically", () => {
		const { result } = renderHook(() => useTestRunner(mockLoaderData));

		act(() => {
			result.current.finishRun();
		});

		expect(result.current.finished).toBe(true);
		expect(result.current.askSave).toBe(true);
	});

	it("should provide formatted time spent", () => {
		const { result } = renderHook(() => useTestRunner(mockLoaderData));

		expect(result.current.formattedTimeSpent).toBe("30:00");

		act(() => {
			result.current.selectAnswer(1, 0);
		});

		act(() => {
			vi.advanceTimersByTime(60 * 1000);
		});

		expect(result.current.formattedTimeSpent).toBe("29:00");
	});

	it("should provide current question", () => {
		const { result } = renderHook(() => useTestRunner(mockLoaderData));

		expect(result.current.question).toEqual(mockLoaderData.questions[0]);
	});

	it("should handle malformed answers", () => {
		const { result } = renderHook(() => useTestRunner(mockLoaderData));

		act(() => {
			result.current.selectAnswer(1, -1);
		});

		expect(result.current.wrongCount).toBe(1);
	});
});
