import { useMemo, useState } from "react";
import type { AdminBootstrap } from "@/lib/api/admin-bootstrap";
import { fetchAllGroups } from "@/lib/api/groups";
import type { HeroSettingItem } from "@/lib/api/hero-setting";
import type {
	AdminMenuItemData,
	ContactItem,
	FaqItemData,
	GroupData,
	RegistrationItem,
	StudentGroupData,
	TestData,
	UserItem,
} from "@/lib/api/types";

const PASS_RATE_PLACEHOLDER = "94.8%";

// Owns the admin panel data: the loader result becomes editable local state so
export function useAdminPanel(initial: AdminBootstrap) {
	const [groups, setGroups] = useState<GroupData[]>(initial.groups);
	const [tests, setTests] = useState<TestData[]>(initial.tests);
	const [students, setStudents] = useState<UserItem[]>(initial.students);
	const [registrations, setRegistrations] = useState<RegistrationItem[]>(initial.registrations);
	const [faqs, setFaqs] = useState<FaqItemData[]>(initial.faqs);
	const [faqCategories, setFaqCategories] = useState<string[]>(initial.faqCategories);
	const [contact, setContact] = useState<ContactItem | null>(initial.contact);
	const [studentGroups, setStudentGroups] = useState<StudentGroupData[]>(initial.studentGroups);
	const [menuItems, setMenuItems] = useState<AdminMenuItemData[]>(initial.menuItems);
	const [heroSetting, setHeroSetting] = useState<HeroSettingItem | null>(initial.heroSetting);

	// Fallback for drag-reorder failures only; the view owns its own optimistic state.
	const reloadGroups = async () => {
		const res = await fetchAllGroups();
		if (res.data) setGroups(res.data);
	};

	const stats = useMemo(
		() => ({
			students: students.length,
			groups: groups.length,
			tests: tests.length,
			questions: groups.reduce((sum, g) => sum + (g.questionCount ?? 0), 0),
			leads: registrations.length,
			passRate: PASS_RATE_PLACEHOLDER,
		}),
		[students, groups, tests, registrations],
	);

	return {
		groups,
		setGroups,
		tests,
		setTests,
		students,
		setStudents,
		registrations,
		setRegistrations,
		faqs,
		setFaqs,
		faqCategories,
		setFaqCategories,
		contact,
		setContact,
		studentGroups,
		setStudentGroups,
		menuItems,
		setMenuItems,
		heroSetting,
		setHeroSetting,
		reloadGroups,
		stats,
	};
}

export type AdminPanel = ReturnType<typeof useAdminPanel>;
