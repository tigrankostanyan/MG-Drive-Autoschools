import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { cn } from "@/lib/utils";

const inputVariants = cva(
	"w-full rounded-2xl border bg-white dark:bg-slate-900 px-4 text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-400 outline-none transition-all disabled:cursor-not-allowed disabled:opacity-50",
	{
		variants: {
			variant: {
				default:
					"border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 focus:border-primary focus:ring-2 focus:ring-primary/20",
				ghost:
					"border-transparent bg-transparent hover:border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20",
				error: "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20",
			},
			inputSize: {
				default: "h-12",
				sm: "h-10 text-xs rounded-xl",
				lg: "h-13 text-base rounded-2xl",
			},
		},
		defaultVariants: {
			variant: "default",
			inputSize: "default",
		},
	},
);

export interface InputProps
	extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">,
		VariantProps<typeof inputVariants> {
	icon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
	({ className, type, variant, inputSize, icon, ...props }, ref) => {
		if (icon) {
			return (
				<div className="relative w-full">
					<div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 [&_svg]:size-4">
						{icon}
					</div>
					<input
						type={type}
						className={cn(inputVariants({ variant, inputSize }), "pl-10", className)}
						ref={ref}
						{...props}
					/>
				</div>
			);
		}

		return (
			<input
				type={type}
				className={cn(inputVariants({ variant, inputSize, className }))}
				ref={ref}
				{...props}
			/>
		);
	},
);
Input.displayName = "Input";

export { Input, inputVariants };
