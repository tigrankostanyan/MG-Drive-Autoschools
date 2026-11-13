import { Loader2 } from "lucide-react";
import { useMfaSettings } from "@/hooks/use-mfa-settings";
import { MfaDisabledPanel } from "./mfa/MfaDisabledPanel";
import { MfaDisablePanel } from "./mfa/MfaDisablePanel";
import { MfaEnrollPanel } from "./mfa/MfaEnrollPanel";
import { MfaHeader } from "./mfa/MfaHeader";

// TOTP second factor (AUTH-04): enroll, verify, disable, show codes once.
export function MfaSettingsCard() {
	const {
		status,
		pendingEnrollment,
		recoveryCodes,
		code,
		setCode,
		password,
		setPassword,
		busy,
		copy,
		handleEnroll,
		handleVerify,
		handleDisable,
		cancelEnrollment,
	} = useMfaSettings();

	return (
		<div className="relative overflow-hidden flex flex-col h-full rounded-3xl border border-slate-200/80 bg-white shadow-xl shadow-slate-200/40 dark:border-slate-800 dark:bg-[#0B0F17] dark:shadow-none xl:col-span-2">
			<div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-r from-sky-500 to-blue-600 opacity-5" />
			<div className="relative p-6 md:p-8 flex flex-col flex-1">
				<MfaHeader status={status} />

				{!status ? (
					<div className="mt-8 flex items-center gap-3 text-sm text-slate-500">
						<Loader2 className="size-4 animate-spin" />
						Կարգավիճակը բեռնվում է...
					</div>
				) : status.enabled ? (
					<MfaDisablePanel
						password={password}
						code={code}
						busy={busy}
						enrolledAt={status.enrolledAt}
						onPasswordChange={setPassword}
						onCodeChange={setCode}
						onDisable={handleDisable}
					/>
				) : pendingEnrollment ? (
					<MfaEnrollPanel
						secret={pendingEnrollment.secret}
						code={code}
						busy={busy}
						onCodeChange={setCode}
						onVerify={handleVerify}
						onCancel={cancelEnrollment}
						onCopy={copy}
					/>
				) : (
					<MfaDisabledPanel
						recoveryCodes={recoveryCodes}
						busy={busy}
						onEnroll={handleEnroll}
						onCopy={copy}
					/>
				)}
			</div>
		</div>
	);
}
