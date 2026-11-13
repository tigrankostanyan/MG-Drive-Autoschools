import { Link } from "@tanstack/react-router";
import { Eye, Lock, Play, RotateCw } from "lucide-react";
import { useAuthModal } from "@/components/auth/auth-modal-context";
import { Button } from "@/components/ui/button";
import type { LearningCardAction, LearningCardState } from "./LearningCard.types";

interface LearningCardActionButtonProps {
	effectiveState: LearningCardState;
	actionLabel: string | undefined;
	action: LearningCardAction | undefined;
}

export function LearningCardActionButton({
	effectiveState,
	actionLabel,
	action,
}: LearningCardActionButtonProps) {
	const { openAuthModal } = useAuthModal();

	return (
		<div className="mt-4 pt-3.5 border-t border-slate-100/90 dark:border-slate-800">
			{effectiveState === "locked" ? (
				<Button
					type="button"
					variant="outline"
					onClick={openAuthModal}
					className="w-full gap-2 rounded-full border-blue-200/80 bg-blue-50/60 text-primary hover:bg-primary hover:text-white dark:border-blue-900/60 dark:bg-blue-950/40 dark:text-blue-300 transition-all duration-200 cursor-pointer shadow-none"
					title={action?.lockedTitle || "Անհրաժեշտ է մուտք գործել"}
				>
					<span>{actionLabel || "Սկսել թեստը"}</span>
					<Lock className="size-3.5 opacity-70 shrink-0" />
				</Button>
			) : action?.to ? (
				<Button asChild className="w-full gap-2 group">
					<Link to={action.to} {...(action.params ? { params: action.params } : {})}>
						<span>{actionLabel}</span>
						{effectiveState === "completed" ? (
							<Eye className="size-3.5 transition-transform duration-300 group-hover:scale-110" />
						) : effectiveState === "in_progress" ? (
							<RotateCw className="size-3.5 transition-transform duration-300 group-hover:rotate-45" />
						) : (
							<Play className="size-3.5 fill-current transition-transform duration-300 group-hover:scale-110" />
						)}
					</Link>
				</Button>
			) : (
				<Button onClick={action?.onClick} className="w-full gap-2 group">
					<span>{actionLabel}</span>
					{effectiveState === "completed" ? (
						<Eye className="size-3.5 transition-transform duration-300 group-hover:scale-110" />
					) : effectiveState === "in_progress" ? (
						<RotateCw className="size-3.5 transition-transform duration-300 group-hover:rotate-45" />
					) : (
						<Play className="size-3.5 fill-current transition-transform duration-300 group-hover:scale-110" />
					)}
				</Button>
			)}
		</div>
	);
}
