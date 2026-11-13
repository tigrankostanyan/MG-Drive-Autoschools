import { useCallback, useState } from "react";
import { toast } from "sonner";
import { fetchGroupQuestions } from "@/lib/api/groups";
import type { QuestionData } from "@/lib/api/types";

const ALL_QUESTIONS_LIMIT = 9999;

/**
 * Question fetching for a group run: paginated loads plus the "load
 * everything" switch that review mode needs.
 */
export function useGroupQuestions(
	groupId: string,
	initialQuestions: QuestionData[],
	perPage: number,
) {
	const [questions, setQuestions] = useState<QuestionData[]>(initialQuestions);
	const [total, setTotal] = useState(0);
	const [qLoading, setQLoading] = useState(false);

	const loadQuestions = useCallback(
		async (p: number, all: boolean, pp?: number) => {
			setQLoading(true);
			try {
				const limit = all ? ALL_QUESTIONS_LIMIT : (pp ?? perPage);
				const result = await fetchGroupQuestions(groupId, all ? 1 : p, limit);
				setQuestions(result.questions);
				setTotal(result.total);
			} catch {
				// The previous page stays on screen, so tell the user why it did not
				// change instead of failing silently.
				toast.error("Խնդիր առաջացավ", {
					description: "Հնարավոր չէ բեռնել հարցերը:",
				});
			} finally {
				setQLoading(false);
			}
		},
		[groupId, perPage],
	);

	const loadAllQuestions = useCallback(async () => {
		setQLoading(true);
		try {
			const result = await fetchGroupQuestions(groupId, 1, ALL_QUESTIONS_LIMIT);
			setQuestions(result.questions);
			setTotal(result.total);
		} catch {
			toast.error("Խնդիր առաջացավ", {
				description: "Հնարավոր չէ բեռնել բոլոր հարցերը:",
			});
		} finally {
			setQLoading(false);
		}
	}, [groupId]);

	return { questions, total, qLoading, loadQuestions, loadAllQuestions };
}
