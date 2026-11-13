import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import * as React from "react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
	"inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-[13px] font-bold cursor-pointer transition-all active:scale-[0.98] outline-none focus:outline-none focus-visible:outline-none border-0 disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 select-none",
	{
		variants: {
			variant: {
				default:
					"relative overflow-hidden rounded-full bg-gradient-to-r from-primary via-blue-600 to-primary bg-[length:200%_auto] hover:bg-right text-white font-bold tracking-wider shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/35 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all duration-300 before:absolute before:inset-0 before:-translate-x-full hover:before:translate-x-full before:bg-gradient-to-r before:from-transparent before:via-white/25 before:to-transparent before:transition-transform before:duration-700 cursor-pointer",
				primary:
					"relative overflow-hidden rounded-full bg-gradient-to-r from-primary via-blue-600 to-primary bg-[length:200%_auto] hover:bg-right text-white font-bold tracking-wider shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/35 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all duration-300 before:absolute before:inset-0 before:-translate-x-full hover:before:translate-x-full before:bg-gradient-to-r before:from-transparent before:via-white/25 before:to-transparent before:transition-transform before:duration-700 cursor-pointer",
				secondary:
					"rounded-full bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-white font-bold tracking-wider shadow-xs hover:bg-slate-200/80 dark:hover:bg-slate-700 hover:-translate-y-0.5 transition-all duration-200",
				outline:
					"relative overflow-hidden rounded-full border border-slate-200/90 dark:border-slate-700 bg-white/90 dark:bg-slate-900/90 text-slate-800 dark:text-white font-bold tracking-wider shadow-xs hover:border-primary/50 hover:bg-slate-50 dark:hover:bg-slate-800 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 cursor-pointer",
				ghost:
					"rounded-full hover:bg-primary/10 hover:text-primary text-slate-700 dark:text-slate-300 font-bold tracking-wider transition-colors duration-200",
				danger:
					"relative overflow-hidden rounded-full bg-red-500 text-white font-bold tracking-wider shadow-[0_4px_14px_0_rgba(239,68,68,0.39)] hover:bg-red-600 hover:shadow-[0_6px_20px_rgba(239,68,68,0.23)] hover:-translate-y-0.5 transition-all duration-200",
				locked:
					"rounded-full border border-slate-200/90 dark:border-slate-800 bg-slate-100/90 dark:bg-slate-800/90 text-slate-500 dark:text-slate-400 font-bold tracking-wider cursor-not-allowed select-none opacity-80 hover:none active:scale-100",
			},
			size: {
				default: "h-11 px-7 py-2.5 text-[13px]",
				sm: "h-9.5 rounded-full px-5 text-xs",
				lg: "h-12.5 2xl:h-13.5 rounded-full px-8 2xl:px-9 text-[13px] 2xl:text-[13.5px]",
				icon: "h-11 w-11 rounded-full p-0 flex items-center justify-center",
			},
		},
		defaultVariants: {
			variant: "default",
			size: "default",
		},
	},
);

export interface ButtonProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement>,
		VariantProps<typeof buttonVariants> {
	asChild?: boolean;
	isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
	(
		{ className, variant, size, asChild = false, isLoading = false, children, disabled, ...props },
		ref,
	) => {
		if (asChild) {
			return (
				<Slot className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props}>
					{children}
				</Slot>
			);
		}

		const isLocked = variant === "locked";

		return (
			<button
				className={cn(buttonVariants({ variant, size, className }))}
				ref={ref}
				disabled={disabled || isLoading || isLocked}
				aria-disabled={disabled || isLoading || isLocked ? true : undefined}
				aria-busy={isLoading ? true : undefined}
				{...props}
			>
				{isLoading && <Loader2 className="animate-spin mr-1" />}
				{children}
			</button>
		);
	},
);
Button.displayName = "Button";

export { Button, buttonVariants };
