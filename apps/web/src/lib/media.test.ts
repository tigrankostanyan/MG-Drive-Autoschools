import { describe, expect, it } from "vitest";
import { VITE_MEDIA_BASE } from "./env";
import { getQuestionImageUrl, getUserImageUrl, pickUserImage } from "./media";

describe("media URL builders", () => {
	describe("getUserImageUrl", () => {
		it("should build a user image URL from name and ext", () => {
			const result = getUserImageUrl({ name: "avatar1", ext: "png" });
			expect(result).toBe(`${VITE_MEDIA_BASE}/images/users/large/avatar1.png`);
		});

		it("should strip a leading dot from the extension", () => {
			const result = getUserImageUrl({ name: "avatar1", ext: ".jpg" });
			expect(result).toBe(`${VITE_MEDIA_BASE}/images/users/large/avatar1.jpg`);
		});

		it("should support the small size", () => {
			const result = getUserImageUrl({ name: "avatar1", ext: "png" }, "small");
			expect(result).toBe(`${VITE_MEDIA_BASE}/images/users/small/avatar1.png`);
		});

		it("should return null when file is missing", () => {
			expect(getUserImageUrl(undefined)).toBeNull();
			expect(getUserImageUrl(null)).toBeNull();
		});

		it("should return null when name or ext is missing", () => {
			expect(getUserImageUrl({ name: "", ext: "png" })).toBeNull();
			expect(getUserImageUrl({ name: "avatar1", ext: "" })).toBeNull();
		});
	});

	describe("getQuestionImageUrl", () => {
		it("should build a question image URL from name and ext", () => {
			const result = getQuestionImageUrl({ name: "q1", ext: "png" });
			expect(result).toBe(`${VITE_MEDIA_BASE}/images/questions/large/q1.png`);
		});
	});

	describe("pickUserImage", () => {
		it("should prefer the file marked as user_img", () => {
			const files = [
				{ name: "other", ext: "png", name_used: "other" },
				{ name: "avatar1", ext: "png", name_used: "user_img" },
			];
			expect(pickUserImage(files)?.name).toBe("avatar1");
		});

		it("should fall back to the first file when none is marked", () => {
			const files = [
				{ name: "first", ext: "png" },
				{ name: "second", ext: "png", name_used: "other" },
			];
			expect(pickUserImage(files)?.name).toBe("first");
		});

		it("should return undefined for empty or missing input", () => {
			expect(pickUserImage([])).toBeUndefined();
			expect(pickUserImage(undefined)).toBeUndefined();
			expect(pickUserImage(null)).toBeUndefined();
		});
	});
});
