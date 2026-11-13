import type * as React from "react";

export interface CardMetaItem {
	icon?: React.ReactNode;
	value: string | number;
	label?: string;
}

export interface CardMetaProps {
	items: CardMetaItem[];
	className?: string;
}

export function CardMeta({ items, className = "" }: CardMetaProps) {
	if (!items || items.length === 0) return null;

	return (
		<div
			className={`flex items-center gap-3 text-xs font-medium text-slate-500 select-none ${className}`}
		>
			{items.map((item) => (
				<span
					key={`${item.label ?? ""}-${item.value}`}
					className="flex items-center gap-1.5 tabular-nums"
				>
					{item.icon && (
						<span className="size-3.5 text-slate-400 shrink-0 flex items-center justify-center">
							{item.icon}
						</span>
					)}
					<span>
						{item.value} {item.label && <span className="text-slate-400">{item.label}</span>}
					</span>
				</span>
			))}
		</div>
	);
}
