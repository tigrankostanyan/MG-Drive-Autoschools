import { Copy, TriangleAlert } from "lucide-react";

export function MfaRecoveryCodes({
	codes,
	onCopy,
}: {
	codes: string[];
	onCopy: (value: string) => void;
}) {
	return (
		<div className="rounded-2xl border border-amber-200 bg-amber-50/60 p-4 dark:border-amber-900/50 dark:bg-amber-950/30">
			<p className="flex items-center gap-2 text-sm font-bold text-amber-900 dark:text-amber-200">
				<TriangleAlert className="size-4" />
				Վերականգնման կոդեր — ցուցադրվում են միայն մեկ անգամ
			</p>
			<div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-5">
				{codes.map((c) => (
					<code
						key={c}
						className="rounded-xl bg-white px-3 py-2 text-center font-mono text-xs font-bold text-slate-700 shadow-sm dark:bg-slate-900 dark:text-slate-200"
					>
						{c}
					</code>
				))}
			</div>
			<button
				type="button"
				onClick={() => onCopy(codes.join("\n"))}
				className="mt-3 flex items-center gap-2 text-[13px] font-bold text-amber-800 underline underline-offset-4 dark:text-amber-300"
			>
				<Copy className="size-3.5" />
				Պատճենել բոլորը
			</button>
		</div>
	);
}
