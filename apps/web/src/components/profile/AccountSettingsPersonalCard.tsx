import { Lock, Mail, Phone, User } from "lucide-react";
import { Card } from "@/components/ui/card";
import { FormField } from "@/components/ui/form-field";
import { IconBox } from "@/components/ui/icon-box";
import { Input } from "@/components/ui/input";
import type { AccountFieldErrors } from "./data";

interface AccountSettingsPersonalCardProps {
	formData: { firstName: string; lastName: string; phone: string };
	email: string;
	errors?: AccountFieldErrors | undefined;
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function AccountSettingsPersonalCard({
	formData,
	email,
	errors,
	onChange,
}: AccountSettingsPersonalCardProps) {
	return (
		<Card variant="subtle" padding="lg">
			<div className="flex items-center gap-2.5 pb-4 mb-6 border-b border-slate-200/70">
				<IconBox variant="primary" size="md" shape="rounded">
					<User className="size-4.5" />
				</IconBox>
				<div>
					<h3 className="text-base font-black text-slate-900">Անձնական տվյալներ</h3>
					<p className="text-xs text-slate-500 font-medium">
						Ձեր անունը, կոնտակտային տվյալները և էլ․ հասցեն
					</p>
				</div>
			</div>

			<div className="grid gap-5 md:grid-cols-2">
				{/* First Name */}
				<FormField label="Անուն" required error={errors?.firstName}>
					<Input
						type="text"
						name="firstName"
						autoComplete="given-name"
						value={formData.firstName}
						onChange={onChange}
						placeholder="Անուն"
						icon={<User className="size-4" />}
					/>
				</FormField>

				{/* Last Name */}
				<FormField label="Ազգանուն" required error={errors?.lastName}>
					<Input
						type="text"
						name="lastName"
						autoComplete="family-name"
						value={formData.lastName}
						onChange={onChange}
						placeholder="Ազգանուն"
						icon={<User className="size-4" />}
					/>
				</FormField>

				{/* Phone */}
				<FormField label="Հեռախոսահամար" error={errors?.phone}>
					<Input
						type="tel"
						name="phone"
						inputMode="tel"
						autoComplete="tel"
						value={formData.phone}
						onChange={onChange}
						placeholder="091 234567 կամ +374 91 234567"
						icon={<Phone className="size-4" />}
					/>
				</FormField>

				{/* Email (Readonly) */}
				<div className="space-y-1.5 w-full">
					<div className="flex items-center justify-between">
						<label htmlFor="account-email" className="text-xs font-bold text-slate-700">
							Էլ․ հասցե
						</label>
						<span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
							<Lock className="size-2.5" /> Չի փոփոխվում
						</span>
					</div>
					<Input
						id="account-email"
						type="email"
						autoComplete="email"
						value={email}
						readOnly
						aria-readonly="true"
						icon={<Mail className="size-4" />}
						className="bg-slate-100/70 text-slate-500 cursor-not-allowed shadow-inner"
					/>
				</div>
			</div>
		</Card>
	);
}
