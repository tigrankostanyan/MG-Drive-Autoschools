import { useMemo } from "react";
import type { GroupItem } from "@/lib/api/types";
import type { GroupTabOption } from "./use-groups-search";

export function useFilteredGroups(
	groups: GroupItem[],
	tabs: GroupTabOption[],
	activeTab: string,
	searchQuery: string,
): GroupItem[] {
	return useMemo(() => {
		const raw = searchQuery.trim().toLowerCase();
		if (!raw) {
			const currentTab = tabs.find((t) => t.id === activeTab);
			if (!currentTab || currentTab.id === "all") return groups;
			return groups.filter((g) => {
				const num = g.number;
				const min = currentTab.min ?? 1;
				const max = currentTab.max ?? groups.length;
				return num >= min && num <= max;
			});
		}

		const numMatch = raw.match(/\d+/);
		const targetNum = numMatch ? parseInt(numMatch[0], 10) : null;

		const stripped = raw.replace(/(?:խումբ|xumb|group|թեմա|№|#|-|րդ)/gi, "").trim();

		const matches = groups.filter((g) => {
			if (targetNum !== null && g.number === targetNum) return true;
			if (targetNum !== null && String(g.number).startsWith(String(targetNum))) return true;
			if (String(g.number).includes(raw)) return true;

			const titleLower = g.title?.toLowerCase() ?? "";
			const textLower = g.text?.toLowerCase() ?? "";
			if (titleLower.includes(raw) || textLower.includes(raw)) return true;

			const representations = [
				`խումբ ${g.number}`,
				`խումբ #${g.number}`,
				`խումբ № ${g.number}`,
				`խումբ №${g.number}`,
				`xumb ${g.number}`,
				`group ${g.number}`,
				`թեմա ${g.number}`,
			];
			if (representations.some((r) => r.includes(raw) || raw.includes(r))) return true;

			if (stripped) {
				if (String(g.number) === stripped || String(g.number).includes(stripped)) return true;
				if (titleLower.includes(stripped) || textLower.includes(stripped)) return true;
			}

			if (Array.isArray(g.questions) && g.questions.length > 0) {
				const matchedQuestion = g.questions.some((qItem) => {
					const qText = qItem.question?.toLowerCase() ?? "";
					return qText.includes(raw) || (stripped && qText.includes(stripped));
				});
				if (matchedQuestion) return true;
			}

			const tokens = raw.split(/\s+/).filter(Boolean);
			if (tokens.length > 1) {
				const allTokensMatch = tokens.every((token) => {
					const clean = token.replace(/[#№-]/g, "").trim();
					if (!clean) return true;
					if (String(g.number) === clean) return true;
					if (titleLower.includes(clean) || textLower.includes(clean)) return true;
					if (g.questions?.some((q) => q.question?.toLowerCase().includes(clean))) return true;
					return false;
				});
				if (allTokensMatch) return true;
			}

			if (!stripped && !targetNum && /(?:խումբ|xumb|group|թեմա)/i.test(raw)) {
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
	}, [groups, tabs, activeTab, searchQuery]);
}
