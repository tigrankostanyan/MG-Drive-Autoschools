import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";
import { useGroupProgress } from "@/hooks/use-group-progress";
import { useGroupQuestions } from "@/hooks/use-group-questions";
import { checkGroupAnswers } from "@/lib/api/groups";
import type { RevealMap } from "@/lib/quiz";
import type { GroupLoaderData, GroupRunner } from "../types";

const PAGE_SIZE_SMALL = 25;
const PAGE_SIZE_MEDIUM = 50;
const PAGE_SIZE_LARGE = 100;
const PAGE_SIZES = [PAGE_SIZE_SMALL, PAGE_SIZE_MEDIUM, PAGE_SIZE_LARGE];
const DEFAULT_PER_PAGE = PAGE_SIZE_SMALL;

export function useGroupRunner(groupId: string, loaderData: GroupLoaderData): GroupRunner {
	const group = loaderData.group;
	const [answers, setAnswers] = useState<Record<number, number>>(() => {
		const initial: Record<number, number> = {};
		Object.entries(loaderData.prog).forEach(([qId, ans]) => {
			initial[Number(qId)] = ans;
		});
		return initial;
	});
	const [page, setPage] = useState(1);
	const [perPage, setPerPage] = useState(DEFAULT_PER_PAGE);
	const [showAll, setShowAll] = useState(false);
	const [reviewMode, setReviewMode] = useState(false);
	const [revealMap, setRevealMap] = useState<RevealMap>({});

	const { questions, total, qLoading, loadQuestions, loadAllQuestions } = useGroupQuestions(
		groupId,
		loaderData.questions,
		perPage,
	);

	useGroupProgress(groupId, answers);

	const handleSelect = useCallback((qId: number, idx: number) => {
		setAnswers((a) => ({ ...a, [qId]: idx }));
	}, []);

	const handlePage = (p: number) => {
		setPage(p);
		loadQuestions(p, false);
	};

	const toggleShowAll = () => {
		const next = !showAll;
		setShowAll(next);
		if (next) {
			loadQuestions(1, true);
		} else {
			setPage(1);
			loadQuestions(1, false);
		}
	};

	const handlePerPage = (pp: number) => {
		setPerPage(pp);
		setPage(1);
		setShowAll(false);
		loadQuestions(1, false, pp);
	};

	const handleFinish = useCallback(async () => {
		try {
			const results = await checkGroupAnswers(groupId, answers);
			const next: RevealMap = {};
			for (const r of results) {
				if (r.found && r.correctAnswerIndex !== undefined) {
					next[r.id] = {
						correctAnswerIndex: r.correctAnswerIndex,
						explanation: r.explanation,
					};
				}
			}
			setRevealMap(next);
			setReviewMode(true);
			setShowAll(true);
			await loadAllQuestions();
		} catch {
			toast.error("Խնդիր առաջացավ", {
				description: "Հնարավոր չէ ստուգել պատասխանները:",
			});
		}
	}, [answers, groupId, loadAllQuestions]);

	const handleExitReview = () => {
		setReviewMode(false);
		setShowAll(false);
		setPage(1);
		loadQuestions(1, false);
	};

	const resetAnswers = () => {
		setAnswers({});
		setRevealMap({});
	};

	const answered = useMemo(() => Object.keys(answers).length, [answers]);
	const totalCorrect = useMemo(
		() =>
			questions.filter((q) => {
				const reveal = revealMap[q.id];
				return reveal ? answers[q.id] === reveal.correctAnswerIndex - 1 : false;
			}).length,
		[questions, answers, revealMap],
	);
	const examTotal = total > 0 ? total : questions.length;
	const totalPages = Math.ceil(total / perPage);
	const nextGroup = useMemo(() => {
		const allGroups = loaderData.allGroups ?? [];
		const idx = allGroups.findIndex((g) => g.id === group.id);
		if (idx >= 0 && idx < allGroups.length - 1) return allGroups[idx + 1] ?? null;
		return null;
	}, [loaderData.allGroups, group.id]);

	return {
		group,
		questions,
		answers,
		page,
		perPage,
		showAll,
		reviewMode,
		qLoading,
		totalPages,
		answered,
		totalCorrect,
		examTotal,
		nextGroup,
		revealMap,
		pageSizes: PAGE_SIZES,
		handleSelect,
		handlePage,
		toggleShowAll,
		handlePerPage,
		handleFinish,
		handleExitReview,
		resetAnswers,
	};
}
