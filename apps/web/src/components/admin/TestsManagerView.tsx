import { type Dispatch, type SetStateAction, useState } from "react";
import { QuestionsPanel, useQuestionManager } from "@/features/questions";
import type { TestData } from "@/lib/api/types";
import { TestsListView } from "./tests/TestsListView";
import { useTestsList } from "./tests/useTestsList";

export function TestsManagerView({
	tests,
	onChange,
}: {
	tests: TestData[];
	onChange: Dispatch<SetStateAction<TestData[]>>;
}) {
	const [expandedTestId, setExpandedTestId] = useState<number | null>(null);
	const list = useTestsList({ tests, onChange });
	const editor = useQuestionManager({
		tableName: "tests",
		expandedId: expandedTestId,
		setExpandedId: setExpandedTestId,
	});

	return (
		<div className="space-y-6">
			{expandedTestId ? (
				<QuestionsPanel
					rowId={expandedTestId}
					title={`Թեստ #${expandedTestId}-ի Հարցաշարը`}
					emptyText="Այս թեստում հարցեր չկան"
					radioName="testCorrectAnswer"
					optionsLayout="stack"
					editor={editor}
					onBack={() => setExpandedTestId(null)}
				/>
			) : (
				<TestsListView list={list} loadTestQuestions={editor.loadQuestions} />
			)}
		</div>
	);
}
