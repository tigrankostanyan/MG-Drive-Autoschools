import { describe, expect, it } from "vitest";
import { findNextTest } from "./quiz";

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
