import type * as React from "react";

export interface PageHeaderProps {
	badge?: string;
	title: string;
	description?: string;
	actions?: React.ReactNode;
	className?: string;
}

export function PageHeader({
	badge,
	title,
	description,
	actions,
	className = "",
}: PageHeaderProps) {
	return (
		<div
			className={`w-full flex flex-col md:flex-row md:items-end md:justify-between gap-4 ${className}`}
		>
			<div>
				{badge && (
					<div className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/[0.06] backdrop-blur-md px-3.5 py-1.5 mb-3 shadow-xs select-none">
						<span className="size-1.5 rounded-full bg-primary animate-pulse" />
						<span className="text-[11.5px] font-black uppercase tracking-wider text-primary">
							{badge}
						</span>
					</div>
				)}
				<h1 className="mt-1 text-3xl sm:text-4xl lg:text-[42px] font-black tracking-tight text-slate-950 dark:text-white leading-tight">
					{title}
				</h1>
				{description && (
					<p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-2xl font-medium leading-relaxed">
						{description}
					</p>
				)}
			</div>

			{actions && <div className="shrink-0">{actions}</div>}
		</div>
	);
}
