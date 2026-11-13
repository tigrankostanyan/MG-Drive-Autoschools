import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { cn } from "@/lib/utils";

const iconBoxVariants = cva(
	"grid place-items-center shrink-0 transition-all select-none [&_svg]:shrink-0",
	{
		variants: {
			variant: {
				primary:
					"bg-primary/10 border border-primary/20 text-primary dark:bg-primary/20 dark:border-primary/30 dark:text-blue-400 shadow-xs",
				gradient:
					"bg-gradient-to-br from-primary/15 to-primary/5 border border-primary/20 text-primary shadow-xs",
				secondary:
					"bg-slate-100 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 text-slate-600 dark:text-slate-300 shadow-xs",
				success:
					"bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100/90 dark:border-emerald-800/80 text-emerald-600 dark:text-emerald-400 shadow-xs",
				warning:
					"bg-amber-50 dark:bg-amber-950/40 border border-amber-100/90 dark:border-amber-800/80 text-amber-600 dark:text-amber-400 shadow-xs",
				danger:
					"bg-rose-50 dark:bg-rose-950/40 border border-rose-100/90 dark:border-rose-800/80 text-rose-600 dark:text-rose-400 shadow-xs",
				glass:
					"bg-white/10 dark:bg-black/30 border border-white/15 dark:border-white/10 text-white backdrop-blur-md shadow-inner",
				white:
					"bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-700 text-slate-800 dark:text-white shadow-xs",
				dock: "bg-blue-500/15 border border-blue-400/25 text-blue-400 shadow-sm",
			},
			size: {
				sm: "size-8 rounded-lg [&_svg]:size-4",
				md: "size-10 sm:size-11 rounded-xl sm:rounded-2xl [&_svg]:size-5",
				lg: "size-11 sm:size-12 rounded-xl sm:rounded-2xl [&_svg]:size-5 sm:[&_svg]:size-5.5",
				xl: "size-13 sm:size-14 rounded-2xl [&_svg]:size-6 sm:[&_svg]:size-6.5",
			},
			shape: {
				rounded: "",
				circle: "!rounded-full",
			},
		},
		defaultVariants: {
			variant: "primary",
			size: "md",
			shape: "rounded",
		},
	},
);

export interface IconBoxProps
	extends React.HTMLAttributes<HTMLDivElement>,
		VariantProps<typeof iconBoxVariants> {}

const IconBox = React.forwardRef<HTMLDivElement, IconBoxProps>(
	({ className, variant, size, shape, ...props }, ref) => (
		<div
			ref={ref}
			className={cn(iconBoxVariants({ variant, size, shape, className }))}
			{...props}
		/>
	),
);
IconBox.displayName = "IconBox";

export { IconBox, iconBoxVariants };
