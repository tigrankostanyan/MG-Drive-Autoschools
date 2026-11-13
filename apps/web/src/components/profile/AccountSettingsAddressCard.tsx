import { Building2, Globe2, Hash, MapPin } from "lucide-react";
import { Card } from "@/components/ui/card";
import { FormField } from "@/components/ui/form-field";
import { IconBox } from "@/components/ui/icon-box";
import { Input } from "@/components/ui/input";
import type { AccountFieldErrors } from "./data";

interface AccountSettingsAddressCardProps {
	formData: { city: string; state: string; zip: string; country: string };
	errors?: AccountFieldErrors | undefined;
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function AccountSettingsAddressCard({
	formData,
	errors,
	onChange,
}: AccountSettingsAddressCardProps) {
	return (
		<Card variant="subtle" padding="lg">
			<div className="flex items-center gap-2.5 pb-4 mb-6 border-b border-slate-200/70">
				<IconBox variant="secondary" size="md" shape="rounded">
					<MapPin className="size-4.5" />
				</IconBox>
				<div>
					<h3 className="text-base font-black text-slate-900">Հասցե և Տեղակայություն</h3>
					<p className="text-xs text-slate-500 font-medium">
						Քաղաքը, մարզը և փոստային տվյալները վկայականի համար
					</p>
				</div>
			</div>

			<div className="grid gap-5 md:grid-cols-2">
				{/* City */}
				<FormField label="Քաղաք" error={errors?.city}>
					<Input
						type="text"
						name="city"
						autoComplete="address-level2"
						value={formData.city}
						onChange={onChange}
						placeholder="Երևան"
						icon={<Building2 className="size-4" />}
					/>
				</FormField>

				{/* State / Province */}
				<FormField label="Մարզ / Շրջան" error={errors?.state}>
					<Input
						type="text"
						name="state"
						autoComplete="address-level1"
						value={formData.state}
						onChange={onChange}
						placeholder="Երևան / Շիրակ"
						icon={<MapPin className="size-4" />}
					/>
				</FormField>

				{/* Postal code */}
				<FormField label="Փոստային դասիչ" error={errors?.zip}>
					<Input
						type="text"
						name="zip"
						autoComplete="postal-code"
						value={formData.zip}
						onChange={onChange}
						placeholder="0001"
						icon={<Hash className="size-4" />}
					/>
				</FormField>

				{/* Country */}
				<FormField label="Երկիր" error={errors?.country}>
					<Input
						type="text"
						name="country"
						autoComplete="country-name"
						value={formData.country}
						onChange={onChange}
						placeholder="Հայաստան"
						icon={<Globe2 className="size-4" />}
					/>
				</FormField>
			</div>
		</Card>
	);
}
