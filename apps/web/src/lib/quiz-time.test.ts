import { describe, expect, it } from "vitest";
import { formatTimeSpent, isTestPassed } from "./quiz";

describe("isTestPassed", () => {
	it(`should pass when score >= 80%`, () => {
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
