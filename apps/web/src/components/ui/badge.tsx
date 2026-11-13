import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
	"inline-flex items-center gap-1.5 rounded-full border text-[11px] font-mono font-bold uppercase tracking-wider tabular-nums select-none transition-colors",
	{
		variants: {
			variant: {
				default: "border-primary/20 bg-primary/10 text-primary",
				primary: "border-primary/20 bg-primary/10 text-primary",
				secondary:
					"border-slate-200/80 bg-slate-100/80 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300",
				neutral:
					"border-slate-200/80 bg-slate-100/80 text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300",
				active:
					"border-blue-200/80 bg-blue-50 text-primary dark:border-blue-800/80 dark:bg-blue-950/40 dark:text-blue-400",
				in_progress:
					"border-blue-200/80 bg-blue-50 text-primary dark:border-blue-800/80 dark:bg-blue-950/40 dark:text-blue-400",
				completed:
					"border-emerald-200/80 bg-emerald-50 text-emerald-700 dark:border-emerald-800/80 dark:bg-emerald-950/40 dark:text-emerald-400",
				success:
					"border-emerald-200/80 bg-emerald-50 text-emerald-700 dark:border-emerald-800/80 dark:bg-emerald-950/40 dark:text-emerald-400",
				locked:
					"border-slate-200/90 bg-slate-100/90 text-slate-500 dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-400",
				warning:
					"border-amber-200/80 bg-amber-50 text-amber-700 dark:border-amber-800/80 dark:bg-amber-950/40 dark:text-amber-400",
				destructive:
					"border-rose-200/80 bg-rose-50 text-rose-700 dark:border-rose-800/80 dark:bg-rose-950/40 dark:text-rose-400",
				danger:
					"border-rose-200/80 bg-rose-50 text-rose-700 dark:border-rose-800/80 dark:bg-rose-950/40 dark:text-rose-400",
				outline: "border-slate-200 text-slate-800 dark:border-slate-700 dark:text-slate-200",
				pill: "border-primary/25 bg-primary/[0.06] backdrop-blur-md text-primary font-black uppercase tracking-wider shadow-xs",
				gradient:
					"border-transparent bg-gradient-to-r from-primary via-blue-600 to-primary text-white font-bold uppercase tracking-wider shadow-md shadow-primary/30",
			},
			size: {
				default: "h-6.5 px-2.5",
				sm: "h-5.5 px-2 text-[10px]",
				lg: "h-7.5 px-3.5 text-xs font-bold",
				pill: "px-3.5 py-1.5 h-auto text-[11.5px]",
			},
		},
		defaultVariants: {
			variant: "default",
			size: "default",
		},
	},
);

export interface BadgeProps
	extends React.HTMLAttributes<HTMLSpanElement>,
		VariantProps<typeof badgeVariants> {
	icon?: React.ReactNode;
}

function Badge({ className, variant, size, icon, children, ...props }: BadgeProps) {
	return (
		<span className={cn(badgeVariants({ variant, size }), className)} {...props}>
			{icon && <span className="size-3.5 flex items-center justify-center shrink-0">{icon}</span>}
			{children}
		</span>
	);
}

export { Badge, badgeVariants };
