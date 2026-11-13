import { useState } from "react";
import { toast } from "sonner";
import { useConfirm } from "@/components/ui/confirm-dialog";
import {
	createQuestion,
	deleteQuestion,
	fetchQuestions,
	reorderQuestions,
	updateQuestion,
} from "@/lib/api/questions";
import type { QuestionData } from "@/lib/api/types";
import { serverErrorText } from "@/lib/api-errors";
import type { QuestionForm } from "./types";

/** Tables whose question sets share the same admin editor. */
export type QuestionTableName = "groups" | "tests";

export function useQuestionManager({
	tableName,
	expandedId,
	setExpandedId,
}: {
	tableName: QuestionTableName;
	expandedId: number | null;
	setExpandedId: (id: number | null) => void;
}) {
	const [questions, setQuestions] = useState<QuestionData[]>([]);
	const [qLoading, setQLoading] = useState(false);
	const [qEditingId, setQEditingId] = useState<number | null>(null);
	const [qForm, setQForm] = useState<QuestionForm>({
		question: "",
		correctAnswerIndex: 0,
		number: 1,
		options: ["", "", "", ""],
	});
	const { confirm } = useConfirm();

	const loadQuestions = async (rowId: number, toggle = false) => {
		if (toggle && expandedId === rowId) {
			setExpandedId(null);
			return;
		}
		if (toggle) {
			setExpandedId(rowId);
		}
		setQLoading(true);
		try {
			const res = await fetchQuestions(rowId, tableName);
			const formatted = (res.data ?? []).map((q) => ({
				...q,
				correctAnswerIndex: (q.correctAnswerIndex ?? 0) > 0 ? (q.correctAnswerIndex ?? 0) - 1 : 0,
			}));
			setQuestions(formatted);
		} catch (err) {
			toast.error(serverErrorText(err, "Հարցերի բեռնման սխալ"));
		} finally {
			setQLoading(false);
		}
	};

	const handleSaveQuestion = async (rowId: number) => {
		if (!qForm.question.trim()) {
			toast.error("Լրացրեք հարցի տեքստը");
			return;
		}
		try {
			const payload = {
				question: qForm.question,
				correctAnswerIndex: qForm.correctAnswerIndex + 1,
				number: qForm.number,
				options: qForm.options.filter((o) => o.trim().length > 0),
			};
			if (qEditingId && qEditingId !== -1) {
				await updateQuestion(qEditingId, payload);
				toast.success("Հարցը թարմացվեց");
			} else {
				await createQuestion({
					row_id: rowId,
					table_name: tableName,
					...payload,
				});
				toast.success("Հարցն ավելացվեց");
			}
			setQEditingId(null);
			loadQuestions(rowId);
		} catch (err) {
			toast.error(serverErrorText(err, "Հարցի պահպանման սխալ"));
		}
	};

	const handleDeleteQuestion = async (qid: number, rowId: number) => {
		const isConfirmed = await confirm({
			title: "Ջնջե՞լ այս հարցը",
			description: "Այս հարցը կջնջվի անվերադարձ:",
			type: "danger",
		});
		if (!isConfirmed) return;
		try {
			await deleteQuestion(qid);
			toast.success("Հարցը ջնջվեց");
			loadQuestions(rowId);
		} catch (err) {
			toast.error(serverErrorText(err, "Ջնջման սխալ"));
		}
	};

	const handleReorder = async (orderedIds: number[]) => {
		if (expandedId === null) return;
		// Errors propagate to useListReorder, which surfaces the toast.
		await reorderQuestions(tableName, expandedId, orderedIds);
	};

	const handleManualSortChange = async (questionId: number, newNumber: number) => {
		if (expandedId === null) return;
		const oldIndex = questions.findIndex((q) => q.id === questionId);
		if (oldIndex === -1) return;

		// Find the item currently at that number, or fallback to index
		let targetIndex = questions.findIndex((q) => q.number === newNumber);
		if (targetIndex === -1) {
			targetIndex = newNumber - 1;
		}
		// Bound the index
		if (targetIndex < 0) targetIndex = 0;
		if (targetIndex >= questions.length) targetIndex = questions.length - 1;
		if (targetIndex === oldIndex) return; // No change

		// Direct swap between the two items
		const newItems = [...questions];
		const oldItem = newItems[oldIndex];
		const targetItem = newItems[targetIndex];
		if (!oldItem || !targetItem) return;
		newItems[oldIndex] = targetItem;
		newItems[targetIndex] = oldItem;

		// Renumber according to the new positions
		const reordered = newItems.map((q, idx) => ({ ...q, number: idx + 1 }));
		setQuestions(reordered);

		try {
			await reorderQuestions(
				tableName,
				expandedId,
				reordered.map((q) => q.id),
			);
			toast.success("Հարցերի տեղերը փոխվեցին");
		} catch (err) {
			toast.error(serverErrorText(err, "Հերթականության պահպանման սխալ"));
			loadQuestions(expandedId); // reload to revert
		}
	};

	return {
		questions,
		setQuestions, // Exported to be used by useListReorder
		qLoading,
		qEditingId,
		setQEditingId,
		qForm,
		setQForm,
		loadQuestions,
		handleSaveQuestion,
		handleDeleteQuestion,
		handleReorder,
		handleManualSortChange,
	};
}

export type QuestionManagerState = ReturnType<typeof useQuestionManager>;
