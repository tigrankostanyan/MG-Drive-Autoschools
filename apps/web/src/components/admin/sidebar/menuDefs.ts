import {
	BookOpen,
	ClipboardList,
	FileCheck,
	FileQuestion,
	HelpCircle,
	LayoutDashboard,
	type LucideIcon,
	TrendingUp,
	Users,
} from "lucide-react";
import type {
	GroupData,
	RegistrationItem,
	StudentGroupData,
	TestData,
	UserItem,
} from "@/lib/api/types";

/*
  Tabs shown in the sortable sidebar menu, in their default order.
  `settings` is excluded on purpose: it is pinned in the sidebar footer.
 */
export const MENU_TAB_KEYS = [
	"dashboard",
	"student-analytics",
	"student-groups",
	"tests",
	"groups",
	"students",
	"registrations",
	"faq",
] as const;

export type MenuTabKey = (typeof MENU_TAB_KEYS)[number];

export function isMenuTabKey(key: string): key is MenuTabKey {
	return (MENU_TAB_KEYS as readonly string[]).includes(key);
}

export type MenuDef = {
	label: string;
	icon: LucideIcon;
	badge?: number;
	isPillBadge?: boolean;
};

export function buildMenuDefs({
	groups,
	tests,
	students,
	registrations,
	studentGroups,
}: {
	groups: GroupData[];
	tests: TestData[];
	students: UserItem[];
	registrations: RegistrationItem[];
	studentGroups: StudentGroupData[];
}): Record<MenuTabKey, MenuDef> {
	return {
		dashboard: { label: "Ընդհանուր", icon: LayoutDashboard },
		"student-analytics": {
			label: "Անալիտիկա",
			icon: TrendingUp,
		},
		"student-groups": {
			label: "Ուս. խմբեր",
			icon: BookOpen,
			badge: studentGroups.length,
		},
		tests: { label: "Թեստեր", icon: FileCheck, badge: tests.length },
		groups: { label: "Խմբեր", icon: FileQuestion, badge: groups.length },
		students: { label: "Ուսանողներ", icon: Users, badge: students.length },
		registrations: {
			label: "Հայտեր",
			icon: ClipboardList,
			badge: registrations.length,
			isPillBadge: true,
		},
		faq: { label: "ՀՏՀ հարցեր", icon: HelpCircle },
	};
}
