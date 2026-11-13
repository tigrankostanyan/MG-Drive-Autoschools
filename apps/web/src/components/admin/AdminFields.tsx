import type { LucideIcon } from "lucide-react";
import type { InputHTMLAttributes, TextareaHTMLAttributes } from "react";
import { useId } from "react";
import {
	ACCENTS,
	type Accent,
	errorAttributes,
	FIELD_BASE,
	FIELD_ERROR,
	FieldError,
	FieldLabel,
} from "./fields/FieldPrimitives";

const errorClass = (error?: string | undefined) => (error ? FIELD_ERROR : "");

/** Input with a leading lucide icon. */
export function IconField({
	label,
	icon: Icon,
	accent = "accent",
	bold = false,
	error,
	className = "",
	containerClassName = "",
	...props
}: {
	label: string;
	icon: LucideIcon;
	accent?: Accent;
	bold?: boolean;
	error?: string | undefined;
	containerClassName?: string;
} & InputHTMLAttributes<HTMLInputElement>) {
	const fieldId = useId();
	const errorId = `${fieldId}-error`;
	return (
		<div className={`space-y-1.5 ${containerClassName}`}>
			<FieldLabel id={props.id ?? fieldId}>{label}</FieldLabel>
			<div className="group relative flex items-center">
				<Icon
					className={`absolute left-4 size-5 text-slate-400 transition-colors ${ACCENTS[accent].icon}`}
				/>
				<input
					{...props}
					{...errorAttributes(error, errorId)}
					id={props.id ?? fieldId}
					className={`${FIELD_BASE} pl-12 pr-4 ${bold ? "font-bold" : "font-medium"} ${ACCENTS[accent].field} ${errorClass(error)} ${className}`}
				/>
			</div>
			<FieldError id={errorId}>{error}</FieldError>
		</div>
	);
}

/** Input with a leading static prefix (e.g. currency or duration marks). */
export function PrefixField({
	label,
	prefix,
	error,
	className = "",
	containerClassName = "",
	...props
}: {
	label: string;
	prefix: string;
	error?: string | undefined;
	containerClassName?: string;
} & InputHTMLAttributes<HTMLInputElement>) {
	const fieldId = useId();
	const errorId = `${fieldId}-error`;
	return (
		<div className={`space-y-1.5 ${containerClassName}`}>
			<FieldLabel id={props.id ?? fieldId}>{label}</FieldLabel>
			<div className="relative flex items-center">
				<span className="pointer-events-none absolute left-4 text-lg font-bold text-slate-400">
					{prefix}
				</span>
				<input
					{...props}
					{...errorAttributes(error, errorId)}
					id={props.id ?? fieldId}
					className={`${FIELD_BASE} pl-12 pr-4 font-bold ${ACCENTS.indigo.field} ${errorClass(error)} ${className}`}
				/>
			</div>
			<FieldError id={errorId}>{error}</FieldError>
		</div>
	);
}

/** Plain input without a leading icon. */
export function PlainField({
	label,
	accent = "orange",
	error,
	className = "",
	containerClassName = "",
	...props
}: {
	label: string;
	accent?: Accent;
	error?: string | undefined;
	className?: string;
	containerClassName?: string;
} & InputHTMLAttributes<HTMLInputElement>) {
	const fieldId = useId();
	const errorId = `${fieldId}-error`;
	return (
		<div className={`space-y-1.5 ${containerClassName}`}>
			<FieldLabel id={props.id ?? fieldId}>{label}</FieldLabel>
			<input
				{...props}
				{...errorAttributes(error, errorId)}
				id={props.id ?? fieldId}
				className={`${FIELD_BASE} px-4 font-medium ${ACCENTS[accent].field} ${errorClass(error)} ${className}`}
			/>
			<FieldError id={errorId}>{error}</FieldError>
		</div>
	);
}

/** Multi-line text area without a leading icon. */
export function TextAreaField({
	label,
	accent = "orange",
	error,
	className = "",
	containerClassName = "",
	...props
}: {
	label: string;
	accent?: Accent;
	error?: string | undefined;
	className?: string;
	containerClassName?: string;
} & TextareaHTMLAttributes<HTMLTextAreaElement>) {
	const fieldId = useId();
	const errorId = `${fieldId}-error`;
	return (
		<div className={`space-y-1.5 ${containerClassName}`}>
			<FieldLabel id={props.id ?? fieldId}>{label}</FieldLabel>
			<textarea
				{...props}
				{...errorAttributes(error, errorId)}
				id={props.id ?? fieldId}
				className={`${FIELD_BASE} px-4 resize-none ${ACCENTS[accent].field} ${errorClass(error)} ${className}`}
			/>
			<FieldError id={errorId}>{error}</FieldError>
		</div>
	);
}
