import type { TabType } from "@/components/admin/types";

export const TOPBAR_TITLES: Partial<Record<TabType, string>> = {
	dashboard: "Dashboard",
	"student-analytics": "Ուսանողների Անալիտիկա",
	"student-groups": "Ուսանողական խմբեր",
	tests: "Թեստեր",
	groups: "Խմբեր",
	faq: "ՀՏՀ հարցեր",
	students: "Ուսանողներ",
	registrations: "Գրանցման Հայտեր",
	settings: "Կարգավորումներ",
};

export const TOPBAR_SUBTITLES: Partial<Record<TabType, string>> = {
	dashboard: "MG Drive վարման դպրոցի կառավարման համակարգ և տվյալներ",
	"student-analytics": "Ուսանողների առաջադիմության, փորձերի և սխալների վերլուծություն",
	"student-groups": "Ուսանողների խմբերի կառավարում",
	tests: "Քննական տոմսերի և շեմերի կարգավորում",
	groups: "Խմբերի և դրանց հարցերի կառավարում",
	students: "Գրանցված ուսանողների առաջադիմության վերահսկում",
	registrations: "Կայքից ստացված նոր դիմումներ և հայտեր",
	settings: "Կոնտակտային տվյալների և կայքի կարգավորումներ",
};
