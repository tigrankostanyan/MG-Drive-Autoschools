import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { cn } from "@/lib/utils";

const cardVariants = cva("rounded-2xl sm:rounded-3xl border text-card-foreground", {
	variants: {
		variant: {
			default:
				"bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 shadow-[0_4px_20px_-4px_rgba(15,23,42,0.06),0_2px_6px_-2px_rgba(15,23,42,0.03)]",
			interactive:
				"bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 shadow-[0_4px_20px_-4px_rgba(15,23,42,0.06),0_2px_6px_-2px_rgba(15,23,42,0.03)] transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-[0_16px_36px_-6px_rgba(4,77,218,0.12),0_4px_12px_-2px_rgba(15,23,42,0.05)]",
			subtle:
				"bg-slate-50/60 dark:bg-slate-900/40 border-slate-200/80 dark:border-slate-800 shadow-xs",
			glass:
				"bg-white/80 dark:bg-slate-900/60 backdrop-blur-md border-slate-200/80 dark:border-slate-800/80 shadow-xs hover:border-primary/30 hover:bg-white dark:hover:bg-slate-900 transition-all duration-300",
			dark: "bg-slate-950/90 dark:bg-slate-950/95 border-white/10 backdrop-blur-xl shadow-[0_20px_50px_-10px_rgba(0,0,0,0.45)] text-white hover:border-primary/40 transition-all duration-300",
		},
		padding: {
			none: "p-0",
			sm: "p-4 sm:p-4.5",
			default: "p-6 sm:p-7",
			lg: "p-7 sm:p-8 2xl:p-9",
		},
	},
	defaultVariants: {
		variant: "default",
		padding: "default",
	},
});

export interface CardProps
	extends React.HTMLAttributes<HTMLDivElement>,
		VariantProps<typeof cardVariants> {}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
	({ className, variant, padding, ...props }, ref) => (
		<div ref={ref} className={cn(cardVariants({ variant, padding, className }))} {...props} />
	),
);
Card.displayName = "Card";

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
	({ className, ...props }, ref) => (
		<div ref={ref} className={cn("flex flex-col space-y-1.5", className)} {...props} />
	),
);
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
	({ className, ...props }, ref) => (
		<h3
			ref={ref}
			className={cn(
				"text-[17px] sm:text-lg font-bold text-slate-950 dark:text-white tracking-tight leading-snug",
				className,
			)}
			{...props}
		/>
	),
);
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<
	HTMLParagraphElement,
	React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
	<p
		ref={ref}
		className={cn(
			"text-[13px] sm:text-[13.5px] text-slate-600 dark:text-slate-400 font-medium leading-relaxed",
			className,
		)}
		{...props}
	/>
));
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
	({ className, ...props }, ref) => (
		<div ref={ref} className={cn("flex-1", className)} {...props} />
	),
);
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
	({ className, ...props }, ref) => (
		<div
			ref={ref}
			className={cn(
				"mt-4 pt-3.5 border-t border-slate-100/90 dark:border-slate-800 flex items-center",
				className,
			)}
			{...props}
		/>
	),
);
CardFooter.displayName = "CardFooter";

export { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, cardVariants };
