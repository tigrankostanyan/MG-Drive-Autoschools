export const ITEMS_PER_PAGE_SMALL = 12;
export const ITEMS_PER_PAGE_MEDIUM = 24;
export const ITEMS_PER_PAGE_LARGE = 48;
export const ITEMS_PER_PAGE_XLARGE = 96;

export const QUESTIONS_ITEMS_PER_PAGE_OPTIONS = [
	ITEMS_PER_PAGE_SMALL,
	ITEMS_PER_PAGE_MEDIUM,
	ITEMS_PER_PAGE_LARGE,
	ITEMS_PER_PAGE_XLARGE,
];

export const DEFAULT_QUESTIONS_ITEMS_PER_PAGE = ITEMS_PER_PAGE_SMALL;

export const INITIAL_QUESTION_FORM = {
	question: "",
	correctAnswerIndex: 0,
	options: ["", "", "", ""],
};
