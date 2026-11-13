import { HelpCircle } from "lucide-react";
import type * as React from "react";
import { Card } from "@/components/ui/card";
import { IconBox } from "@/components/ui/icon-box";
import { cn } from "@/lib/utils";

export interface EmptyStateProps {
	icon?: React.ReactNode;
	title: string;
	description?: string;
	action?: React.ReactNode;
	className?: string;
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
	return (
		<Card className={cn("p-8 sm:p-12 text-center", className)}>
			<div className="flex justify-center mb-4">
				<IconBox variant="primary" size="lg">
					{icon || <HelpCircle className="size-6 stroke-[2]" />}
				</IconBox>
			</div>
			<h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">{title}</h3>
			{description && (
				<p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
					{description}
				</p>
			)}
			{action && <div className="mt-6">{action}</div>}
		</Card>
	);
}
