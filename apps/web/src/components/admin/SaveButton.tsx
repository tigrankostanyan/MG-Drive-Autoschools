import { Loader2, Save } from "lucide-react";
import type { ButtonHTMLAttributes } from "react";

/** Primary save button with spinner state. */
export function SaveButton({
	saving,
	label,
	className = "bg-[image:var(--gradient-accent)] shadow-accent/25 hover:shadow-accent/30",
	...props
}: {
	saving: boolean;
	label: string;
	className?: string;
} & ButtonHTMLAttributes<HTMLButtonElement>) {
	return (
		<button
			{...props}
			type={props.type ?? "button"}
			disabled={saving}
			aria-busy={saving ? true : undefined}
			className={`group relative flex items-center justify-center gap-2 overflow-hidden rounded-2xl px-8 py-3.5 font-bold text-white shadow-xl transition-all hover:scale-[1.02] hover:shadow-2xl disabled:pointer-events-none disabled:opacity-70 ${className}`}
		>
			<div className="absolute inset-0 bg-white/20 opacity-0 transition-opacity group-hover:opacity-100" />
			{saving ? <Loader2 className="size-5 animate-spin" /> : <Save className="size-5" />}
			<span>{label}</span>
		</button>
	);
}
