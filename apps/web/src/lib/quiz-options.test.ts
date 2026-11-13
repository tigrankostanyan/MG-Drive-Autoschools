import { describe, expect, it } from "vitest";
import { normalizeQuestionOptions } from "./quiz";

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
