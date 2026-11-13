import { lazy } from "react";

/**
 * Code-splitting registry for the admin tabs. Each `lazy` wrapper defers the
 * actual module import until the tab is opened, so this module stays tiny.
 */
export const DashboardView = lazy(() =>
	import("./DashboardView").then((m) => ({ default: m.DashboardView })),
);
export const StudentAnalyticsManagerView = lazy(() =>
	import("./StudentAnalyticsManagerView").then((m) => ({
		default: m.StudentAnalyticsManagerView,
	})),
);
export const StudentGroupsManagerView = lazy(() =>
	import("./StudentGroupsManagerView").then((m) => ({
		default: m.StudentGroupsManagerView,
	})),
);
export const GroupQuestionsManagerView = lazy(() =>
	import("./GroupQuestionsManagerView").then((m) => ({
		default: m.GroupQuestionsManagerView,
	})),
);
export const TestsManagerView = lazy(() =>
	import("./TestsManagerView").then((m) => ({ default: m.TestsManagerView })),
);
export const StudentsManagerView = lazy(() =>
	import("./StudentsManagerView").then((m) => ({
		default: m.StudentsManagerView,
	})),
);
export const RegistrationsManagerView = lazy(() =>
	import("./RegistrationsManagerView").then((m) => ({
		default: m.RegistrationsManagerView,
	})),
);
export const SettingsManagerView = lazy(() =>
	import("./SettingsManagerView").then((m) => ({
		default: m.SettingsManagerView,
	})),
);
export const FaqManagerView = lazy(() =>
	import("./FaqManagerView").then((m) => ({ default: m.FaqManagerView })),
);
