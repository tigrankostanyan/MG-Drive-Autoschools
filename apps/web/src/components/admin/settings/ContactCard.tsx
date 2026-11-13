import { Clock, Facebook, Instagram, Mail, MapPin, Phone, Settings2 } from "lucide-react";
import { AdminCard } from "@/components/admin/AdminCard";
import { IconField } from "@/components/admin/AdminFields";
import { SaveButton } from "@/components/admin/SaveButton";
import type { ContactFormErrors } from "@/hooks/use-contact-settings-form";

export function ContactCard({
	phone,
	onPhoneChange,
	email,
	onEmailChange,
	address,
	onAddressChange,
	facebook,
	onFacebookChange,
	instagram,
	onInstagramChange,
	hours,
	onHoursChange,
	errors,
	saving,
	onSave,
}: {
	phone: string;
	onPhoneChange: (value: string) => void;
	email: string;
	onEmailChange: (value: string) => void;
	address: string;
	onAddressChange: (value: string) => void;
	facebook: string;
	onFacebookChange: (value: string) => void;
	instagram: string;
	onInstagramChange: (value: string) => void;
	hours: string;
	onHoursChange: (value: string) => void;
	errors: ContactFormErrors;
	saving: boolean;
	onSave: () => void;
}) {
	return (
		<AdminCard
			icon={Settings2}
			iconClassName="bg-[image:var(--gradient-accent)] shadow-lg shadow-accent/30"
			stripClassName="bg-[image:var(--gradient-accent)] opacity-10"
			title="Կոնտակտային Տվյալներ"
			description="Կառավարեք ձեր կազմակերպության հիմնական կոնտակտները, որոնք կերևան կայքի տարբեր բաժիններում։"
			footer={<SaveButton saving={saving} label="Պահպանել Փոփոխությունները" onClick={onSave} />}
		>
			<div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
				<IconField
					label="Հեռախոսահամար"
					icon={Phone}
					type="tel"
					autoComplete="tel"
					value={phone}
					error={errors.phone}
					onChange={(e) => onPhoneChange(e.target.value)}
				/>
				<IconField
					label="Էլ․ Փոստ"
					icon={Mail}
					type="email"
					autoComplete="email"
					value={email}
					error={errors.email}
					onChange={(e) => onEmailChange(e.target.value)}
				/>
				<IconField
					label="Հասցե"
					icon={MapPin}
					containerClassName="md:col-span-2"
					autoComplete="street-address"
					value={address}
					error={errors.address}
					onChange={(e) => onAddressChange(e.target.value)}
				/>
				<IconField
					label="Facebook Էջ"
					icon={Facebook}
					accent="facebook"
					value={facebook}
					onChange={(e) => onFacebookChange(e.target.value)}
				/>
				<IconField
					label="Instagram Էջ"
					icon={Instagram}
					accent="instagram"
					value={instagram}
					onChange={(e) => onInstagramChange(e.target.value)}
				/>
				<IconField
					label="Աշխատանքային Ժամեր"
					icon={Clock}
					containerClassName="md:col-span-2"
					value={hours}
					onChange={(e) => onHoursChange(e.target.value)}
				/>
			</div>
		</AdminCard>
	);
}
