import type { StudentRecord } from "@/lib/api/types";

export type TabType =
	| "dashboard"
	| "student-analytics"
	| "student-groups"
	| "tests"
	| "groups"
	| "students"
	| "registrations"
	| "faq"
	| "settings";

export type UserData = StudentRecord;
