import { useState } from "react";
import { useAsyncSubmit } from "@/hooks/use-async-submit";
import { updateMe } from "@/lib/api/auth";
import type { UserItem } from "@/lib/api/types";
import { notify } from "@/lib/notify";
import { AccountSettingsAddressCard } from "./AccountSettingsAddressCard";
import { AccountSettingsFooter } from "./AccountSettingsFooter";
import { AccountSettingsPersonalCard } from "./AccountSettingsPersonalCard";
import { type AccountFieldErrors, accountFormSchema, parseAddress } from "./data";

export function AccountSettingsTab({ currentUser }: { currentUser: UserItem | null }) {
	const fullName = currentUser?.name || "Արամ Պետրոսյան";
	const [firstNameInitial, ...lastNames] = fullName.split(" ");
	const lastNameInitial = lastNames.join(" ") || "Պետրոսյան";
	const email = currentUser?.email || "aram@example.com";
	const phone = currentUser?.phone || "";
	const address = parseAddress(currentUser?.address);

	const [formData, setFormData] = useState({
		firstName: firstNameInitial ?? "",
		lastName: lastNameInitial,
		phone,
		...address,
	});
	const [fieldErrors, setFieldErrors] = useState<AccountFieldErrors>({});

	const { isSubmitting, error, clearError, run } = useAsyncSubmit({
		fallbackError: "Տվյալները չհաջողվեց պահպանել։ Խնդրում ենք փորձել կրկին։",
		onSuccess: () => {
			setFieldErrors({});
			notify.success("Տվյալները հաջողությամբ պահպանվեցին");
		},
	});

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
		setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
	};

	const handleSave = () => {
		clearError();
		const parsed = accountFormSchema.safeParse(formData);
		if (!parsed.success) {
			const flat = parsed.error.flatten().fieldErrors;
			setFieldErrors({
				firstName: flat.firstName?.[0],
				lastName: flat.lastName?.[0],
				phone: flat.phone?.[0],
			});
			return;
		}
		const { firstName, lastName, phone, city, state, zip, country } = parsed.data;
		void run(() =>
			updateMe({
				name: `${firstName} ${lastName}`.trim(),
				phone,
				address: JSON.stringify({ city, state, zip, country }),
			}),
		);
	};

	return (
		<div className="animate-in fade-in slide-in-from-bottom-3 duration-500 space-y-8 max-w-4xl">
			{/* Personal Info Card */}
			<AccountSettingsPersonalCard
				formData={formData}
				email={email}
				errors={fieldErrors}
				onChange={handleChange}
			/>

			{/* Address & Location Card */}
			<AccountSettingsAddressCard
				formData={formData}
				errors={fieldErrors}
				onChange={handleChange}
			/>

			{error && (
				<p role="alert" className="text-sm font-medium text-red-600 dark:text-red-400">
					{error}
				</p>
			)}

			{/* Footer Actions & Security badge */}
			<AccountSettingsFooter isSaving={isSubmitting} onSave={handleSave} />
		</div>
	);
}
