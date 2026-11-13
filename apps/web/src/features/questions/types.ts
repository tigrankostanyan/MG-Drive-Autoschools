export type OptionsLayout = "grid" | "stack";

export type QuestionForm = {
	question: string;
	correctAnswerIndex: number;
	number: number;
	options: string[];
};
