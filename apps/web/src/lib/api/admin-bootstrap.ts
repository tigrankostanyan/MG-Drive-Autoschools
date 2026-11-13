import { fetchMenuItems } from "@/lib/api/admin-menu";
import { fetchContactInfo } from "@/lib/api/contact";
import { fetchFaqCategories, fetchFaqs } from "@/lib/api/faq";
import { fetchGroupMetadata } from "@/lib/api/groups";
import type { HeroSettingItem } from "@/lib/api/hero-setting";
import { getHeroSetting } from "@/lib/api/hero-setting";
import { fetchRegistrations } from "@/lib/api/registrations";
import { fetchAllStudentGroups } from "@/lib/api/student-groups";
import { fetchAllTests } from "@/lib/api/tests";
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
import { fetchUsers } from "@/lib/api/users";

export type AdminBootstrap = {
	groups: GroupData[];
	tests: TestData[];
	students: UserItem[];
	registrations: RegistrationItem[];
	contact: ContactItem | null;
	faqs: FaqItemData[];
	faqCategories: string[];
	studentGroups: StudentGroupData[];
	menuItems: AdminMenuItemData[];
	heroSetting: HeroSettingItem | null;
};

function pick<T>(result: PromiseSettledResult<{ data: T | null }>, fallback: T): T {
	return result.status === "fulfilled" ? (result.value.data ?? fallback) : fallback;
}

/**
 * Loads every admin section in parallel. Each endpoint is independent, so one
 * failure degrades that section only instead of blanking the whole panel.
 */
export async function fetchAdminBootstrap(): Promise<AdminBootstrap> {
	const [
		groups,
		tests,
		students,
		registrations,
		contact,
		faqs,
		categories,
		studentGroups,
		menuItems,
		hero,
	] = await Promise.allSettled([
		fetchGroupMetadata(),
		fetchAllTests(),
		fetchUsers(),
		fetchRegistrations(),
		fetchContactInfo(),
		fetchFaqs(),
		fetchFaqCategories(),
		fetchAllStudentGroups(),
		fetchMenuItems(),
		getHeroSetting(),
	]);

	return {
		groups: pick(groups, []),
		tests: pick(tests, []),
		students: pick(students, []),
		registrations: pick(registrations, []),
		contact: pick(contact, null),
		faqs: pick(faqs, []),
		faqCategories: pick(categories, []),
		studentGroups: pick(studentGroups, []),
		menuItems: pick(menuItems, []),
		heroSetting: pick(hero, null),
	};
}
