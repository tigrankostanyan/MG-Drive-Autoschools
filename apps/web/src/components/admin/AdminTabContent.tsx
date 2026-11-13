import type { AdminPanel } from "@/hooks/use-admin-panel";
import {
	DashboardView,
	FaqManagerView,
	GroupQuestionsManagerView,
	RegistrationsManagerView,
	SettingsManagerView,
	StudentAnalyticsManagerView,
	StudentGroupsManagerView,
	StudentsManagerView,
	TestsManagerView,
} from "./lazy-views";
import type { TabType } from "./types";

type Props = {
	tab: TabType;
	panel: AdminPanel;
	onSelectTab: (tab: TabType) => void;
};

/** Renders the manager view for the active tab. Must stay inside a Suspense boundary. */
export function AdminTabContent({ tab, panel, onSelectTab }: Props) {
	if (tab === "dashboard") {
		return (
			<DashboardView
				stats={panel.stats}
				groups={panel.groups}
				tests={panel.tests}
				registrations={panel.registrations}
				onSelectTab={onSelectTab}
			/>
		);
	}
	if (tab === "student-analytics") {
		return <StudentAnalyticsManagerView studentGroups={panel.studentGroups} />;
	}
	if (tab === "student-groups") {
		return (
			<StudentGroupsManagerView
				studentGroups={panel.studentGroups}
				onChange={panel.setStudentGroups}
				onSelectTab={onSelectTab}
			/>
		);
	}
	if (tab === "tests") {
		return <TestsManagerView tests={panel.tests} onChange={panel.setTests} />;
	}
	if (tab === "groups") {
		return (
			<GroupQuestionsManagerView
				groups={panel.groups}
				onChange={panel.setGroups}
				onReload={panel.reloadGroups}
			/>
		);
	}
	if (tab === "students") {
		return <StudentsManagerView students={panel.students} onChange={panel.setStudents} />;
	}
	if (tab === "registrations") {
		return (
			<RegistrationsManagerView
				registrations={panel.registrations}
				onChange={panel.setRegistrations}
			/>
		);
	}
	if (tab === "settings") {
		return (
			<SettingsManagerView
				contact={panel.contact}
				onChange={panel.setContact}
				heroSetting={panel.heroSetting}
				onHeroChange={panel.setHeroSetting}
			/>
		);
	}
	if (tab === "faq") {
		return (
			<FaqManagerView
				faqs={panel.faqs}
				categories={panel.faqCategories}
				onChange={panel.setFaqs}
				onCategoriesChange={panel.setFaqCategories}
			/>
		);
	}
	return null;
}
