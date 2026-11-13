import { type Dispatch, type SetStateAction, useState } from "react";
import { toast } from "sonner";
import type { HeroSettingItem } from "@/lib/api/hero-setting";
import { updateHeroSetting } from "@/lib/api/hero-setting";
import { serverErrorText } from "@/lib/api-errors";

/**
 * Owns the Hero-section admin form state and its save request, so the
 * `HeroSettingsCard` component stays a pure presentational view.
 */
export function useHeroSettingsForm(
	heroSetting: HeroSettingItem | null | undefined,
	onHeroChange: Dispatch<SetStateAction<HeroSettingItem | null>> | undefined,
) {
	const [heroForm, setHeroForm] = useState<Partial<HeroSettingItem>>({
		title: heroSetting?.title || "",
		subtitle: heroSetting?.subtitle || "",
		primary_button_text: heroSetting?.primary_button_text || "",
		secondary_button_text: heroSetting?.secondary_button_text || "",
		stat_students_value: heroSetting?.stat_students_value || "",
		stat_students_label: heroSetting?.stat_students_label || "",
		stat_success_value: heroSetting?.stat_success_value || "",
		stat_success_label: heroSetting?.stat_success_label || "",
		stat_first_try_value: heroSetting?.stat_first_try_value || "",
		stat_first_try_label: heroSetting?.stat_first_try_label || "",
		stat_questions_value: heroSetting?.stat_questions_value || "",
		stat_questions_label: heroSetting?.stat_questions_label || "",
		stat_experience_value: heroSetting?.stat_experience_value || "",
		stat_experience_label: heroSetting?.stat_experience_label || "",
	});
	const [saving, setSaving] = useState(false);

	const setField = (key: string, value: string) => setHeroForm((f) => ({ ...f, [key]: value }));

	const handleSave = async () => {
		if (saving) return;
		setSaving(true);
		try {
			const res = await updateHeroSetting(heroForm);
			toast.success("Գլխավոր էջի տվյալները պահպանվեցին");
			onHeroChange?.(res.data);
		} catch (err) {
			toast.error(serverErrorText(err, "Պահպանման սխալ"));
		} finally {
			setSaving(false);
		}
	};

	return { heroForm, saving, setField, handleSave };
}
