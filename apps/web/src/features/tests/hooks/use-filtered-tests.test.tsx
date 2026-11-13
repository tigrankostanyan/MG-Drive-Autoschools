import { renderHook } from "@testing-library/react";
import type { TestData } from "@/lib/api/types";
import { TEST_TABS, useFilteredTests } from "./use-filtered-tests";

describe("useFilteredTests", () => {
	const mockTests: TestData[] = [
		{ id: 1, number: 1, title: "Սկզբունք գանձ", slug: "diagnostic-1" },
		{ id: 2, number: 2, title: "Առաջին ատյան", slug: "practice-1" },
		{ id: 3, number: 3, title: "Միջին ատյան", slug: "practice-2" },
		{ id: 4, number: 4, title: "Ավարտ թեստ", slug: "final-1" },
		{ id: 5, number: 5, title: "Ժամանակ 30 մին", slug: "timed-1" },
	];

	it("should return all tests when tab is 'all' and no search query", () => {
		const { result } = renderHook(() => useFilteredTests(mockTests, "all", ""));
		expect(result.current).toHaveLength(5);
	});

	it("should filter tests by tab range", () => {
		const { result } = renderHook(() => useFilteredTests(mockTests, "1-15", ""));
		expect(result.current).toHaveLength(5);
		expect(result.current[0].number).toBe(1);
	});

	it("should filter tests by search query (number match)", () => {
		const { result } = renderHook(() => useFilteredTests(mockTests, "all", "2"));
		expect(result.current).toHaveLength(1);
		expect(result.current[0].number).toBe(2);
	});

	it("should return empty array when no matches", () => {
		const { result } = renderHook(() => useFilteredTests(mockTests, "all", "999"));
		expect(result.current).toHaveLength(0);
	});
});

describe("TEST_TABS", () => {
	it("should have 5 tabs defined", () => {
		expect(TEST_TABS).toHaveLength(5);
	});

	it("should include 'all' tab as default", () => {
		expect(TEST_TABS[0].id).toBe("all");
	});
});
