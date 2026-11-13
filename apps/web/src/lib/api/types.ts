export type StudentRecord = {
	id: number;
	name: string;
	email: string;
	phone?: string;
	groupId?: number;
};

export type StudentGroupAccess = {
	grantStudentAccess?: boolean;
	activeFrom?: string | null;
	activeUntil?: string | null;
};

export type StudentGroupData = StudentGroupAccess & {
	id: number;
	title: string;
	grantStudentAccess: boolean;
	sortControl?: number;
	date?: string;
	studentCount?: number;
};

export type GroupData = {
	id: number;
	title: string;
	number: number;
	sortControl: number;
	text: string | null;
	slug: string;
	date?: string;
	questions?: QuestionData[];
	questionCount?: number;
};

export type GroupItem = GroupData & {
	questions?: { question: string }[];
};

export type TestData = {
	id: number;
	title: string;
	number: number;
	slug: string;
	type?: string;
};

export type FileItem = {
	id?: number;
	name: string;
	ext: string;
	name_used?: string;
};

export type QuestionView = {
	id: number;
	number: number;
	question: string;
	options: string[];
	image?: string;
	files?: FileItem[];
	imageUrl?: string | null;
};

export type FileData = {
	id: number;
	name: string;
	ext: string;
	name_used?: string;
	sizes?: { large?: string; small?: string };
};

export type QuestionOption = string | { hy?: string; text?: string };
export type QuestionOptions = string | QuestionOption[] | null;

export type QuestionData = {
	id: number;
	row_id: number;
	table_name: string;
	question: string;
	correctAnswerIndex?: number;
	number: number;
	options: QuestionOptions;
	explanation?: string;
	date?: string;
	createdAt?: string;
	updatedAt?: string;
	files?: FileData[];
	owner?: { type: string; data: { number?: number } };
	imageUrl?: string | null;
};

export type AnswerCheckResult = {
	id: number;
	found: boolean;
	correct?: boolean;
	correctAnswerIndex?: number;
	explanation?: string;
};

export type Paginated<T> = {
	data: T[];
	meta: { page: number; limit: number; totalPages: number; totalCount: number };
};

export type AuthResponse = {
	status: string;
	token: string;
	user: {
		id: number;
		name: string;
		email: string;
		role: string;
		phone: string;
		[key: string]: unknown;
	};
	reload: boolean;
};

export type UserItem = {
	id: number;
	name: string;
	email: string;
	phone?: string;
	role: string;
	address?: string;
	include_in_analytics?: boolean;
	has_paid?: boolean;
	isPaid?: boolean;
	paymentExpiresAt?: string | null;
	avatar?: string;
	sortControl?: number;
	createdAt?: string;
	files?: FileItem[];
	studentGroup?: StudentGroupAccess | null;
};

export type AdminMenuItemData = {
	id: number;
	tabKey: string;
	sortControl: number;
};

export type RegistrationItem = {
	id: number;
	name: string;
	phone: string;
	email?: string;
	message?: string;
	course_type?: string;
	createdAt?: string;
};

export type ContactItem = {
	id?: number;
	phone?: string;
	email?: string;
	address?: string;
	companyName?: string;
	facebook?: string;
	instagram?: string;
	telegram?: string;
	map_iframe?: string;
	working_hours?: string;
};

export type FaqItemData = {
	id: number;
	question: string;
	answer: string;
	category?: string;
	date?: string;
};

// SECURE
export type TestSessionResponse = {
	sessionId: string;
	testId: number;
	questionCount: number;
	timeLimitSeconds: number;
};

export type QuestionStreamResponse = {
	question: QuestionView;
	nextQuestionIndex: number;
	hasNext: boolean;
};

export type TestSubmissionResult = {
	status: "success" | "error";
	saved: boolean;
	score: number;
	correctCount: number;
	wrongCount: number;
	passed: boolean;
};

export type ProfileResult = {
	id: number;
	testId: number;
	groupId: number | null;
	testTitle: string;
	groupTitle: string | null;
	score: number;
	correctCount: number;
	wrongCount: number;
	timeSpent: number | null;
	status: "passed" | "failed" | string;
	createdAt: string;
};

export type ProfileCompletedTopic = {
	groupId: number;
	title: string;
	answeredCount: number;
	totalQuestions: number;
};

export type ProfileFeedback = {
	id: number;
	rating: number | null;
	name: string | null;
	type: string | null;
	comment: string | null;
	date: string | null;
};

export type ProfileData = {
	user: UserItem;
	stats: {
		totalTests: number;
		passedTests: number;
		failedTests: number;
		avgScore: number;
		progressPercent: number;
		totalGroups: number;
		completedGroups: number;
	};
	results: ProfileResult[];
	wrongAnswers: ProfileResult[];
	completedTopics: ProfileCompletedTopic[];
	feedback: ProfileFeedback | null;
};

export type ProfileProgressGroup = {
	groupId: number;
	title: string;
	number: number | null;
	answeredCount: number;
	totalQuestions: number;
	hasProgress: boolean;
	updatedAt: string | null;
};

export type ProfileProgress = {
	progressPercent: number;
	completedGroups: number;
	totalGroups: number;
	groups: ProfileProgressGroup[];
};
