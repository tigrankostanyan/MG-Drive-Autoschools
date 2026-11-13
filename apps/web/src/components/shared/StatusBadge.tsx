import { Lock } from "lucide-react";
import type * as React from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export type StatusBadgeState =
	| "available"
	| "in_progress"
	| "completed"
	| "locked"
	| "active"
	| "neutral"
	| "informational"
	| "warning"
	| "danger";

export interface StatusBadgeProps {
	state?: StatusBadgeState;
	text: string;
	className?: string;
	icon?: React.ReactNode;
}

const stateToVariantMap: Record<
	string,
	"neutral" | "in_progress" | "completed" | "locked" | "primary" | "warning" | "destructive"
> = {
	available: "neutral",
	neutral: "neutral",
	in_progress: "in_progress",
	active: "in_progress",
	completed: "completed",
	locked: "locked",
	informational: "primary",
	warning: "warning",
	danger: "destructive",
};

export function StatusBadge({ state = "available", text, className, icon }: StatusBadgeProps) {
	const variant = stateToVariantMap[state] || "neutral";
	const lockIcon = state === "locked" ? <Lock className="size-3" /> : icon;

	return (
		<Badge variant={variant} icon={lockIcon} className={cn("tabular-nums", className)}>
			<span>{text}</span>
		</Badge>
	);
}
