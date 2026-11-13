import { describe, expect, it } from "vitest";
import { PASS_THRESHOLD_PERCENT, TEST_MINUTES, TEST_TOTAL_SECONDS } from "./quiz";

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
