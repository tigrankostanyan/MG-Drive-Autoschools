import { useMemo } from "react";
import type { TestData } from "@/lib/api/types";

export interface TestTabOption {
	id: string;
	label: string;
	min?: number;
	max?: number;
}

export const TEST_TABS: TestTabOption[] = [
	{ id: "all", label: "Բոլորը (50)" },
	{ id: "1-15", label: "1 — 15", min: 1, max: 15 },
	{ id: "16-30", label: "16 — 30", min: 16, max: 30 },
	{ id: "31-45", label: "31 — 45", min: 31, max: 45 },
	{ id: "46-50", label: "46 — 50", min: 46, max: 50 },
];

export function useFilteredTests(
	tests: TestData[],
	activeTab: string,
	searchQuery: string,
): TestData[] {
	return useMemo(() => {
		const raw = searchQuery.trim().toLowerCase();
		if (!raw) {
			const currentTab = TEST_TABS.find((t) => t.id === activeTab);
			if (!currentTab || currentTab.id === "all") return tests;
			return tests.filter((t) => {
				const num = t.number;
				return num >= (currentTab.min ?? 1) && num <= (currentTab.max ?? tests.length);
			});
		}

		const numMatch = raw.match(/\d+/);
		const targetNum = numMatch ? parseInt(numMatch[0], 10) : null;

		const stripped = raw.replace(/(?:թեստ|տեստ|test|տոմս|հարց|№|#|-|րդ)/gi, "").trim();

		const matches = tests.filter((t) => {
			if (targetNum !== null && t.number === targetNum) return true;
			if (targetNum !== null && String(t.number).startsWith(String(targetNum))) return true;
			if (String(t.number).includes(raw)) return true;

			const titleLower = t.title?.toLowerCase() ?? "";
			if (titleLower && (titleLower.includes(raw) || raw.includes(titleLower))) return true;

			const representations = [
				`թեստ ${t.number}`,
				`թեստ № ${t.number}`,
				`թեստ №${t.number}`,
				`թեստ #${t.number}`,
				`տեստ ${t.number}`,
				`test ${t.number}`,
				`տոմս ${t.number}`,
			];
			if (representations.some((r) => r.includes(raw) || raw.includes(r))) return true;

			if (stripped && (String(t.number) === stripped || String(t.number).includes(stripped))) {
				return true;
			}

			if (!stripped && !targetNum && /(?:թեստ|տեստ|test|տոմս)/i.test(raw)) {
				return true;
			}

			return false;
		});

		if (targetNum !== null) {
			return [...matches].sort((a, b) => {
				if (a.number === targetNum && b.number !== targetNum) return -1;
				if (b.number === targetNum && a.number !== targetNum) return 1;
				return a.number - b.number;
			});
		}

		return matches;
	}, [tests, activeTab, searchQuery]);
}
