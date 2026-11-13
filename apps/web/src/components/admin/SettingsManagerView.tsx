import type { Dispatch, SetStateAction } from "react";
import { useContactSettingsForm } from "@/hooks/use-contact-settings-form";
import { useMenuItems } from "@/hooks/use-menu-items";
import type { HeroSettingItem } from "@/lib/api/hero-setting";
import type { ContactItem } from "@/lib/api/types";
import { HeroSettingsCard } from "./HeroSettingsCard";
import { MfaSettingsCard } from "./MfaSettingsCard";
import { ContactCard } from "./settings/ContactCard";
import { MenuCard } from "./settings/MenuCard";

export function SettingsManagerView({
	contact,
	onChange,
	heroSetting,
	onHeroChange,
}: {
	contact: ContactItem | null;
	onChange: Dispatch<SetStateAction<ContactItem | null>>;
	heroSetting?: HeroSettingItem | null;
	onHeroChange?: Dispatch<SetStateAction<HeroSettingItem | null>>;
}) {
	const {
		phone,
		setPhone,
		email,
		setEmail,
		address,
		setAddress,
		facebook,
		setFacebook,
		instagram,
		setInstagram,
		hours,
		setHours,
		errors,
		saving,
		handleSave,
	} = useContactSettingsForm(contact, onChange);

	const { menuItems, addMenuItem, updateMenuItem, removeMenuItem } = useMenuItems();

	return (
		<div className="grid grid-cols-1 xl:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out">
			<ContactCard
				phone={phone}
				onPhoneChange={setPhone}
				email={email}
				onEmailChange={setEmail}
				address={address}
				onAddressChange={setAddress}
				facebook={facebook}
				onFacebookChange={setFacebook}
				instagram={instagram}
				onInstagramChange={setInstagram}
				hours={hours}
				onHoursChange={setHours}
				errors={errors}
				saving={saving}
				onSave={handleSave}
			/>

			<MenuCard
				menuItems={menuItems}
				onAdd={addMenuItem}
				onUpdate={updateMenuItem}
				onRemove={removeMenuItem}
			/>

			<HeroSettingsCard heroSetting={heroSetting} onHeroChange={onHeroChange} />
			<MfaSettingsCard />
		</div>
	);
}
