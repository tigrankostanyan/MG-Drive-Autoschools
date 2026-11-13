import { TextCursorInput } from "lucide-react";
import type { Dispatch, SetStateAction } from "react";
import { useHeroSettingsForm } from "@/hooks/use-hero-settings-form";
import type { HeroSettingItem } from "@/lib/api/hero-setting";
import { AdminCard } from "./AdminCard";
import { PlainField, TextAreaField } from "./AdminFields";
import { SaveButton } from "./SaveButton";

const STAT_FIELDS = [
	{
		value: "stat_students_value",
		label: "stat_students_label",
		title: "Ցուցանիշ 1",
	},
	{
		value: "stat_success_value",
		label: "stat_success_label",
		title: "Ցուցանիշ 2",
	},
	{
		value: "stat_first_try_value",
		label: "stat_first_try_label",
		title: "Ցուցանիշ 3",
	},
	{
		value: "stat_questions_value",
		label: "stat_questions_label",
		title: "Ցուցանիշ 4",
	},
] as const;

export function HeroSettingsCard({
	heroSetting,
	onHeroChange,
}: {
	heroSetting: HeroSettingItem | null | undefined;
	onHeroChange: Dispatch<SetStateAction<HeroSettingItem | null>> | undefined;
}) {
	const { heroForm, saving, setField, handleSave } = useHeroSettingsForm(heroSetting, onHeroChange);

	return (
		<AdminCard
			icon={TextCursorInput}
			iconClassName="bg-gradient-to-br from-orange-400 to-red-600 shadow-lg shadow-orange-500/30"
			stripClassName="bg-gradient-to-r from-orange-500 to-red-500 opacity-5"
			title="Գլխավոր Էջի Տեքստեր և Ցուցանիշներ"
			description="Այս բաժնում կարող եք փոփոխել գլխավոր էջի (Hero Section) վերնագիրը, ենթավերնագիրը, կոճակները և վիճակագրական տվյալները:"
			className="xl:col-span-2"
			footer={
				<SaveButton
					saving={saving}
					label="Պահպանել Գլխավոր Էջը"
					className="bg-gradient-to-r from-orange-500 to-red-500 shadow-orange-500/25 hover:shadow-orange-500/30"
					onClick={handleSave}
				/>
			}
		>
			<div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-6">
				<div className="space-y-4">
					<h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 border-b border-slate-100 dark:border-slate-800 pb-2">
						Հիմնական տեքստեր
					</h3>
					<PlainField
						label="Գլխավոր վերնագիր"
						value={heroForm.title}
						onChange={(e) => setField("title", e.target.value)}
					/>
					<TextAreaField
						label="Ենթավերնագիր"
						rows={3}
						value={heroForm.subtitle}
						onChange={(e) => setField("subtitle", e.target.value)}
					/>
					<div className="grid grid-cols-2 gap-4">
						<PlainField
							label="Կոճակ 1 (Գլխավոր)"
							value={heroForm.primary_button_text}
							onChange={(e) => setField("primary_button_text", e.target.value)}
						/>
						<PlainField
							label="Կոճակ 2 (Երկրորդական)"
							value={heroForm.secondary_button_text}
							onChange={(e) => setField("secondary_button_text", e.target.value)}
						/>
					</div>
				</div>

				<div className="space-y-4">
					<h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 border-b border-slate-100 dark:border-slate-800 pb-2">
						Վիճակագրություն
					</h3>
					<div className="grid grid-cols-2 gap-4">
						{STAT_FIELDS.map((s) => (
							<StatPair
								key={s.value}
								title={s.title}
								value={heroForm[s.value]}
								label={heroForm[s.label]}
								onValue={(v) => setField(s.value, v)}
								onLabel={(v) => setField(s.label, v)}
							/>
						))}
					</div>
				</div>
			</div>
		</AdminCard>
	);
}

function StatPair({
	title,
	value,
	label,
	onValue,
	onLabel,
}: {
	title: string;
	value: string | undefined;
	label: string | undefined;
	onValue: (v: string) => void;
	onLabel: (v: string) => void;
}) {
	return (
		<>
			<PlainField
				label={`${title} (Արժեք)`}
				value={value}
				onChange={(e) => onValue(e.target.value)}
			/>
			<PlainField
				label={`${title} (Տեքստ)`}
				value={label}
				onChange={(e) => onLabel(e.target.value)}
			/>
		</>
	);
}
