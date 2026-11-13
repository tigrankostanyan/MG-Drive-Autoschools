import * as React from "react";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export interface FormFieldProps extends React.HTMLAttributes<HTMLDivElement> {
	label?: string | undefined;
	required?: boolean | undefined;
	error?: string | undefined;
	hint?: string | undefined;
	children: React.ReactNode;
}

type FieldControlProps = {
	id?: string | undefined;
	"aria-describedby"?: string | undefined;
	"aria-invalid"?: boolean | "true" | "false" | undefined;
};

export function FormField({
	label,
	required,
	error,
	hint,
	children,
	className,
	...props
}: FormFieldProps) {
	const fieldId = React.useId();
	const hintId = `${fieldId}-hint`;
	const errorId = `${fieldId}-error`;

	const control = React.isValidElement<FieldControlProps>(children) ? children : null;
	const controlId = control?.props.id ?? fieldId;

	const describedBy =
		cn(
			control?.props["aria-describedby"],
			hint && !error ? hintId : undefined,
			error ? errorId : undefined,
		) || undefined;

	return (
		<div className={cn("space-y-1.5 w-full", className)} {...props}>
			{label && (
				<Label
					htmlFor={controlId}
					required={!!required}
					className="text-slate-800 dark:text-slate-200"
				>
					{label}
				</Label>
			)}
			{control
				? React.cloneElement(control, {
						id: controlId,
						"aria-describedby": describedBy,
						"aria-invalid": error ? true : undefined,
					})
				: children}
			{hint && !error && (
				<p id={hintId} className="text-[11.5px] text-slate-500 dark:text-slate-400 font-medium">
					{hint}
				</p>
			)}
			{error && (
				<p
					id={errorId}
					role="alert"
					className="text-xs text-red-500 font-medium animate-in fade-in slide-in-from-top-1"
				>
					{error}
				</p>
			)}
		</div>
	);
}
