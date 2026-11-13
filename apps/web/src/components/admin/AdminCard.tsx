import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

/** Shared admin card shell: gradient strip, icon header, optional footer. */
export function AdminCard({
	icon: Icon,
	iconClassName,
	stripClassName,
	title,
	description,
	headerAction,
	footer,
	className = "",
	children,
}: {
	icon: LucideIcon;
	iconClassName: string;
	stripClassName: string;
	title: string;
	description?: string;
	headerAction?: ReactNode;
	footer?: ReactNode;
	className?: string;
	children: ReactNode;
}) {
	return (
		<div
			className={`relative overflow-hidden flex flex-col h-full rounded-3xl border border-slate-200/80 bg-white shadow-xl shadow-slate-200/40 dark:border-slate-800 dark:bg-[#0B0F17] dark:shadow-none ${className}`}
		>
			<div className={`absolute inset-x-0 top-0 h-32 ${stripClassName}`} />
			<div className="relative p-6 md:p-8 flex flex-col flex-1">
				<div
					className={
						headerAction
							? "flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
							: "flex items-center gap-4"
					}
				>
					<div className="flex items-center gap-4">
						<div
							className={`flex size-14 items-center justify-center rounded-2xl text-white ${iconClassName}`}
						>
							<Icon className="size-6" />
						</div>
						<div>
							<h2 className="text-xl font-extrabold text-slate-900 dark:text-white">{title}</h2>
							{description && (
								<p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{description}</p>
							)}
						</div>
					</div>
					{headerAction}
				</div>
				{children}
				{footer && (
					<div className="mt-auto flex justify-end border-t border-slate-100 pt-6 dark:border-slate-800">
						{footer}
					</div>
				)}
			</div>
		</div>
	);
}
