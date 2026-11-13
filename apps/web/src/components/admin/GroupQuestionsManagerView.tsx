import { type Dispatch, type SetStateAction, useState } from "react";
import { QuestionsPanel, useQuestionManager } from "@/features/questions";
import type { GroupData } from "@/lib/api/types";
import { GroupQuestionsListView } from "./group-questions/GroupQuestionsListView";
import { useGroupList } from "./group-questions/useGroupList";

export function GroupQuestionsManagerView({
	groups,
	onChange,
	onReload,
}: {
	groups: GroupData[];
	onChange: Dispatch<SetStateAction<GroupData[]>>;
	onReload: () => void;
}) {
	const [expandedGroupId, setExpandedGroupId] = useState<number | null>(null);
	const list = useGroupList({ groups, onChange, onReload, expandedGroupId });
	const editor = useQuestionManager({
		tableName: "groups",
		expandedId: expandedGroupId,
		setExpandedId: setExpandedGroupId,
	});

	return (
		<div className="space-y-6">
			{expandedGroupId ? (
				<QuestionsPanel
					rowId={expandedGroupId}
					title={`Խումբ #${expandedGroupId}-ի Հարցաշարը`}
					emptyText="Այս խմբում հարցեր չկան"
					radioName="groupCorrectAnswer"
					optionsLayout="stack"
					editor={editor}
					onBack={() => setExpandedGroupId(null)}
				/>
			) : (
				<GroupQuestionsListView list={list} loadGroupQuestions={editor.loadQuestions} />
			)}
		</div>
	);
}
