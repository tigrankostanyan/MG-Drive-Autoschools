import { ShieldCheck } from "lucide-react";
import type { MfaStatus } from "@/lib/api/auth";

export function MfaHeader({ status }: { status: MfaStatus | null }) {
	return (
		<div className="flex items-center gap-4">
			<div className="flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-blue-700 text-white shadow-lg shadow-sky-500/30">
				<ShieldCheck className="size-6" />
			</div>
			<div>
				<h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
					Երկգործոն Նույնականացում (MFA)
				</h2>
				<p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
					Admin հաշվի մուտքը պաշտպանված է TOTP հավելվածի 6-նիշ կոդով։
					{status?.enabled ? " Կարգավիճակ՝ միացված։" : " Կարգավիճակ՝ անջատված։"}
				</p>
			</div>
		</div>
	);
}
