import type { GroupData, QuestionData } from "@/lib/api/types";
import type { RevealMap } from "@/lib/quiz";

export type GroupLoaderData = {
	group: GroupData;
	questions: QuestionData[];
	total: number;
	prog: Record<string, number>;
	allGroups: GroupData[];
};

export interface GroupRunner {
	group: GroupData;
	questions: QuestionData[];
	answers: Record<number, number>;
	page: number;
	perPage: number;
	showAll: boolean;
	reviewMode: boolean;
	qLoading: boolean;
	totalPages: number;
	answered: number;
	totalCorrect: number;
	examTotal: number;
	nextGroup: GroupData | null;
	revealMap: RevealMap;
	pageSizes: number[];
	handleSelect: (qId: number, idx: number) => void;
	handlePage: (p: number) => void;
	toggleShowAll: () => void;
	handlePerPage: (pp: number) => void;
	handleFinish: () => Promise<void>;
	handleExitReview: () => void;
	resetAnswers: () => void;
}
