import { Loader2, ShieldCheck } from "lucide-react";
import { MfaRecoveryCodes } from "./MfaRecoveryCodes";

export function MfaDisabledPanel({
	recoveryCodes,
	busy,
	onEnroll,
	onCopy,
}: {
	recoveryCodes: string[] | null;
	busy: boolean;
	onEnroll: () => void;
	onCopy: (value: string) => void;
}) {
	return (
		<div className="mt-8 space-y-4">
			{recoveryCodes && <MfaRecoveryCodes codes={recoveryCodes} onCopy={onCopy} />}
			<button
				type="button"
				onClick={onEnroll}
				disabled={busy}
				className="flex items-center justify-center gap-2 rounded-2xl bg-[image:var(--gradient-accent)] px-8 py-3.5 text-sm font-bold text-white shadow-xl shadow-accent/25 transition-all hover:scale-[1.02] disabled:pointer-events-none disabled:opacity-70"
			>
				{busy ? <Loader2 className="size-5 animate-spin" /> : <ShieldCheck className="size-4" />}
				Միացնել MFA-ն
			</button>
		</div>
	);
}
