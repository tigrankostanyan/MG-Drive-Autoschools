import { Loader2, ShieldCheck, ShieldOff } from "lucide-react";
import { formatDate } from "@/lib/format";
import { inputClass } from "./inputClass";

export function MfaDisablePanel({
	password,
	code,
	busy,
	enrolledAt,
	onPasswordChange,
	onCodeChange,
	onDisable,
}: {
	password: string;
	code: string;
	busy: boolean;
	enrolledAt: string | null | undefined;
	onPasswordChange: (value: string) => void;
	onCodeChange: (value: string) => void;
	onDisable: () => void;
}) {
	return (
		<div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
			<div className="space-y-4">
				<div className="flex items-start gap-2 rounded-2xl border border-emerald-200 bg-emerald-50/60 px-4 py-3 dark:border-emerald-900/50 dark:bg-emerald-950/30">
					<ShieldCheck className="mt-0.5 size-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
					<p className="text-[13px] font-medium leading-relaxed text-emerald-800 dark:text-emerald-200">
						MFA-ն ակտիվ է{enrolledAt ? ` (${formatDate(enrolledAt)})` : ""}։ Անջատելու համար
						անհրաժեշտ է գաղտնաբառը և ընթացիկ կոդը։
					</p>
				</div>
			</div>
			<div className="space-y-3">
				<input
					type="password"
					autoComplete="current-password"
					value={password}
					onChange={(e) => onPasswordChange(e.target.value)}
					placeholder="Գաղտնաբառ"
					className={inputClass}
				/>
				<input
					type="text"
					inputMode="numeric"
					maxLength={6}
					value={code}
					onChange={(e) => onCodeChange(e.target.value.replace(/\D/g, ""))}
					placeholder="6-նիշ կոդ"
					className={inputClass}
				/>
				<button
					type="button"
					onClick={onDisable}
					disabled={busy}
					className="flex w-full items-center justify-center gap-2 rounded-2xl bg-rose-600 px-8 py-3.5 text-sm font-bold text-white shadow-xl shadow-rose-600/20 transition-all hover:scale-[1.02] hover:bg-rose-700 disabled:pointer-events-none disabled:opacity-70"
				>
					{busy ? <Loader2 className="size-5 animate-spin" /> : <ShieldOff className="size-4" />}
					Անջատել MFA-ն
				</button>
			</div>
		</div>
	);
}
