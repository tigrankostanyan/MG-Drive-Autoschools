import { useMemo } from "react";
import type { GroupItem } from "@/lib/api/types";

export interface GroupTabOption {
	id: string;
	label: string;
	min?: number;
	max?: number;
}

const STEP_TEN = 10;
const STEP_TWENTY = 20;
const STEP_THIRTY = 30;

export function useGroupTabs(groups: GroupItem[]): GroupTabOption[] {
	return useMemo(() => {
		const maxNum = groups.reduce((max, g) => Math.max(max, g.number), 0);
		const result: GroupTabOption[] = [{ id: "all", label: `Բոլորը (${groups.length})` }];
		if (maxNum > STEP_TEN) {
			result.push({ id: "1-10", label: "1 — 10", min: 1, max: STEP_TEN });
		}
		if (maxNum > STEP_TEN) {
			const upper20 = Math.min(maxNum, STEP_TWENTY);
			result.push({
				id: "11-20",
				label: `11 — ${upper20}`,
				min: 11,
				max: STEP_TWENTY,
			});
		}
		if (maxNum > STEP_TWENTY) {
			const upper30 = Math.min(maxNum, STEP_THIRTY);
			result.push({
				id: "21-30",
				label: `21 — ${upper30}`,
				min: 21,
				max: STEP_THIRTY,
			});
		}
		if (maxNum > STEP_THIRTY) {
			result.push({
				id: "31+",
				label: `31 — ${maxNum}`,
				min: 31,
				max: maxNum,
			});
		}
		return result;
	}, [groups]);
}
