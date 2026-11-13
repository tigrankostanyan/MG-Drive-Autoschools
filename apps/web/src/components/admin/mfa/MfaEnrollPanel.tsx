import { Copy, KeyRound, Loader2, ShieldCheck } from "lucide-react";
import { inputClass } from "./inputClass";

export function MfaEnrollPanel({
	secret,
	code,
	busy,
	onCodeChange,
	onVerify,
	onCancel,
	onCopy,
}: {
	secret: string;
	code: string;
	busy: boolean;
	onCodeChange: (value: string) => void;
	onVerify: () => void;
	onCancel: () => void;
	onCopy: (value: string) => void;
}) {
	return (
		<div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
			<div className="space-y-3">
				<p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
					Գաղտնի բանալին
				</p>
				<div className="flex items-center gap-2">
					<code className="flex-1 break-all rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-3.5 font-mono text-sm text-slate-700 dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-200">
						{secret}
					</code>
					<button
						type="button"
						onClick={() => onCopy(secret)}
						className="grid size-12 shrink-0 place-items-center rounded-2xl border border-slate-200 text-slate-500 transition-colors hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/60"
						aria-label="Պատճենել"
					>
						<Copy className="size-4" />
					</button>
				</div>
				<div className="flex items-start gap-2 rounded-2xl border border-amber-200 bg-amber-50/60 px-4 py-3 dark:border-amber-900/50 dark:bg-amber-950/30">
					<KeyRound className="mt-0.5 size-4 shrink-0 text-amber-600 dark:text-amber-400" />
					<p className="text-[13px] font-medium leading-relaxed text-amber-800 dark:text-amber-200">
						Ավելացրե՛ք բանալին Google Authenticator / Authy հավելվածում (կամ մուտքագրե՛ք ձեռքով),
						ապա հաստատե՛ք հավելվածի ցուցադրած կոդով։
					</p>
				</div>
			</div>
			<div className="space-y-3">
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
					onClick={onVerify}
					disabled={busy}
					className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[image:var(--gradient-accent)] px-8 py-3.5 text-sm font-bold text-white shadow-xl shadow-accent/25 transition-all hover:scale-[1.02] disabled:pointer-events-none disabled:opacity-70"
				>
					{busy ? <Loader2 className="size-5 animate-spin" /> : <ShieldCheck className="size-4" />}
					Հաստատել և միացնել
				</button>
				<button
					type="button"
					onClick={onCancel}
					className="w-full rounded-2xl px-8 py-2.5 text-sm font-bold text-slate-500 transition-colors hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
				>
					Չեղարկել
				</button>
			</div>
		</div>
	);
}
