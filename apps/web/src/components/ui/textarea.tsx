import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { cn } from "@/lib/utils";

const textareaVariants = cva(
	"w-full rounded-2xl border bg-white dark:bg-slate-900 p-4 text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-400 outline-none transition-all disabled:cursor-not-allowed disabled:opacity-50 resize-y min-h-[100px]",
	{
		variants: {
			variant: {
				default:
					"border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 focus:border-primary focus:ring-2 focus:ring-primary/20",
				error: "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20",
			},
		},
		defaultVariants: {
			variant: "default",
		},
	},
);

export interface TextareaProps
	extends React.TextareaHTMLAttributes<HTMLTextAreaElement>,
		VariantProps<typeof textareaVariants> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
	({ className, variant, ...props }, ref) => {
		return (
			<textarea className={cn(textareaVariants({ variant, className }))} ref={ref} {...props} />
		);
	},
);
Textarea.displayName = "Textarea";

export { Textarea, textareaVariants };
