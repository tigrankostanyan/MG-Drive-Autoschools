import { useEffect, useMemo, useState } from "react";
import type { QuestionData } from "@/lib/api/types";
import { DEFAULT_QUESTIONS_ITEMS_PER_PAGE } from "../questionsConstants";

export interface UseQuestionsPaginationProps {
	questions: QuestionData[];
	defaultPerPage?: number;
}

export function useQuestionsPagination({
	questions,
	defaultPerPage = DEFAULT_QUESTIONS_ITEMS_PER_PAGE,
}: UseQuestionsPaginationProps) {
	const [currentPage, setCurrentPage] = useState(1);
	const [itemsPerPage, setItemsPerPage] = useState(defaultPerPage);

	useEffect(() => {
		setCurrentPage(1);
	}, [questions.length]);

	const totalPages = Math.ceil(questions.length / itemsPerPage) || 1;
	const activePage = Math.min(Math.max(1, currentPage), Math.max(1, totalPages));

	useEffect(() => {
		if (currentPage !== activePage) {
			setCurrentPage(activePage);
		}
	}, [currentPage, activePage]);

	const paginatedQuestions = useMemo(() => {
		const startIndex = (activePage - 1) * itemsPerPage;
		return questions.slice(startIndex, startIndex + itemsPerPage);
	}, [questions, activePage, itemsPerPage]);

	return {
		currentPage,
		setCurrentPage,
		itemsPerPage,
		setItemsPerPage,
		totalPages,
		activePage,
		paginatedQuestions,
	};
}
