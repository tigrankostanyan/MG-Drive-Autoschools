import { ArrowLeft, HelpCircle, Loader2, Plus } from "lucide-react";
import { Pagination } from "@/components/ui/pagination";
import { SortableGrid } from "@/components/ui/sortable-grid";
import { normalizeQuestionOptions } from "@/lib/quiz";
import { useQuestionsPagination } from "./hooks/use-questions-pagination";
import { QuestionItemCard } from "./QuestionItemCard";
import { QuestionItemForm } from "./QuestionItemForm";
import {
	DEFAULT_QUESTIONS_ITEMS_PER_PAGE,
	INITIAL_QUESTION_FORM,
	QUESTIONS_ITEMS_PER_PAGE_OPTIONS,
} from "./questionsConstants";
import type { OptionsLayout } from "./types";
import type { QuestionManagerState } from "./useQuestionManager";

interface QuestionsPanelProps {
	rowId: number;
	title: string;
	emptyText: string;
	radioName: string;
	optionsLayout: OptionsLayout;
	editor: QuestionManagerState;
	onBack: () => void;
}

export function QuestionsPanel({
	rowId,
	title,
	emptyText,
	radioName,
	optionsLayout,
	editor,
	onBack,
}: QuestionsPanelProps) {
	const { questions, qLoading, qEditingId, setQEditingId, qForm, setQForm, handleDeleteQuestion } =
		editor;

	const {
		itemsPerPage,
		totalPages,
		activePage,
		setCurrentPage,
		setItemsPerPage,
		paginatedQuestions,
	} = useQuestionsPagination({ questions, defaultPerPage: DEFAULT_QUESTIONS_ITEMS_PER_PAGE });

	const isEditingNew = qEditingId === -1;
	const isEditingHiddenItem =
		qEditingId !== null && !isEditingNew && !paginatedQuestions.some((q) => q.id === qEditingId);

	return (
		<div className="space-y-6">
			<QuestionsHeader
				title={title}
				questionsCount={questions.length}
				onBack={onBack}
				onAdd={() => {
					setQEditingId(-1);
					setQForm({
						...INITIAL_QUESTION_FORM,
						number: questions.length + 1,
					});
				}}
			/>
			{qLoading ? (
				<div className="py-20 text-center">
					<Loader2 className="mx-auto size-8 animate-spin text-accent" />
				</div>
			) : (
				<div className="space-y-4">
					{(isEditingNew || isEditingHiddenItem) && (
						<QuestionItemForm
							qEditingId={qEditingId}
							qForm={qForm}
							setQForm={setQForm}
							radioName={radioName}
							optionsLayout={optionsLayout}
							onCancel={() => setQEditingId(null)}
							onSave={() => editor.handleSaveQuestion(rowId)}
						/>
					)}
					<SortableGrid
						enabled={qEditingId === null}
						items={paginatedQuestions.map((q) => ({
							...q,
							sortControl: q.number,
						}))}
						gridClassName="space-y-4"
						onDragEnd={async (event) => {
							const { active, over } = event;
							if (!over || active.id === over.id) return;
							const oldIndex = questions.findIndex((q) => q.id === active.id);
							const newIndex = questions.findIndex((q) => q.id === over.id);
							if (oldIndex === -1 || newIndex === -1) return;

							const newItems = [...questions];
							const [movedItem] = newItems.splice(oldIndex, 1);
							if (!movedItem) return;
							newItems.splice(newIndex, 0, movedItem);

							const reordered = newItems.map((q, i) => ({
								...q,
								number: i + 1,
							}));
							editor.setQuestions(reordered);
							try {
								await editor.handleReorder(reordered.map((q) => q.id));
							} catch {
								editor.loadQuestions(rowId);
							}
						}}
						renderItem={({ item, enabled, isOverlay, dragHandle }) => {
							if (qEditingId === item.id) {
								return (
									<QuestionItemForm
										key={item.id}
										qEditingId={qEditingId}
										qForm={qForm}
										setQForm={setQForm}
										radioName={radioName}
										optionsLayout={optionsLayout}
										onCancel={() => setQEditingId(null)}
										onSave={() => editor.handleSaveQuestion(rowId)}
									/>
								);
							}
							return (
								<QuestionItemCard
									key={item.id}
									q={item}
									rowId={rowId}
									optionsLayout={optionsLayout}
									enabled={enabled}
									isOverlay={isOverlay}
									dragHandle={dragHandle}
									onEdit={(question) => {
										setQEditingId(question.id);
										setQForm({
											question: question.question,
											correctAnswerIndex: question.correctAnswerIndex ?? 0,
											number: question.number,
											options: normalizeQuestionOptions(question.options),
										});
									}}
									onDelete={handleDeleteQuestion}
									onManualSort={editor.handleManualSortChange}
								/>
							);
						}}
					/>
					{questions.length === 0 && (
						<div className="py-12 text-center text-slate-400">
							<HelpCircle className="mx-auto size-10 opacity-20 mb-3" />
							<p className="font-bold">{emptyText}</p>
						</div>
					)}
					<Pagination
						currentPage={activePage}
						totalPages={totalPages}
						onPageChange={setCurrentPage}
						itemsPerPage={itemsPerPage}
						onItemsPerPageChange={(size) => {
							setItemsPerPage(size);
							setCurrentPage(1);
						}}
						itemsPerPageOptions={QUESTIONS_ITEMS_PER_PAGE_OPTIONS}
					/>
				</div>
			)}
		</div>
	);
}

function QuestionsHeader({
	title,
	questionsCount,
	onBack,
	onAdd,
}: {
	title: string;
	questionsCount: number;
	onBack: () => void;
	onAdd: () => void;
}) {
	return (
		<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-6 dark:border-slate-800">
			<div className="flex items-center gap-4">
				<button
					type="button"
					onClick={onBack}
					className="grid size-11 place-items-center rounded-xl bg-slate-100 text-slate-600 transition-colors hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
				>
					<ArrowLeft className="size-5" />
				</button>
				<div>
					<h2 className="text-xl font-black text-slate-900 dark:text-white">{title}</h2>
					<p className="mt-1 text-sm font-semibold text-slate-500">
						Ԩնդհանուր {questionsCount} հարց
					</p>
				</div>
			</div>
			<button
				type="button"
				onClick={onAdd}
				className="flex items-center gap-2 rounded-xl bg-[image:var(--gradient-accent)] px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-accent/25 transition-all hover:brightness-110"
			>
				<Plus className="size-4.5" /> Ավելացնել Հարց
			</button>
		</div>
	);
}
