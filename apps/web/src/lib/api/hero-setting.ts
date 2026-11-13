import { request } from "./client";

export interface HeroSettingItem {
	id: number;
	title: string;
	subtitle: string;
	primary_button_text: string;
	secondary_button_text: string;
	stat_students_value: string;
	stat_students_label: string;
	stat_success_value: string;
	stat_success_label: string;
	stat_first_try_value: string;
	stat_first_try_label: string;
	stat_questions_value: string;
	stat_questions_label: string;
	stat_experience_value: string;
	stat_experience_label: string;
}

export const getHeroSetting = async () => {
	return request<{ data: HeroSettingItem }>("/hero-settings");
};

export const updateHeroSetting = async (data: Partial<HeroSettingItem>) => {
	return request<{ data: HeroSettingItem }>("/hero-settings", {
		method: "PUT",
		body: JSON.stringify(data),
	});
};
