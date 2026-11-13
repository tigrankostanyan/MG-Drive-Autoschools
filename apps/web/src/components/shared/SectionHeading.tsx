import type * as React from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export interface SectionHeadingProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
	eyebrow?: string;
	eyebrowIcon?: React.ReactNode;
	title: React.ReactNode;
	description?: React.ReactNode;
	align?: "left" | "center" | "right";
}

export function SectionHeading({
	eyebrow,
	eyebrowIcon,
	title,
	description,
	align = "center",
	className,
	...props
}: SectionHeadingProps) {
	const isCenter = align === "center";
	const isRight = align === "right";

	return (
		<div
			className={cn(
				"mb-12 lg:mb-16",
				isCenter && "text-center max-w-2xl mx-auto",
				isRight && "text-right ml-auto max-w-2xl",
				!isCenter && !isRight && "text-left max-w-xl xl:max-w-2xl",
				className,
			)}
			{...props}
		>
			{eyebrow && (
				<div className={cn("mb-3 sm:mb-4", isCenter && "flex justify-center")}>
					<Badge
						variant="pill"
						icon={
							eyebrowIcon || <span className="size-1.5 rounded-full bg-primary animate-pulse" />
						}
					>
						{eyebrow}
					</Badge>
				</div>
			)}

			<h2 className="text-3xl sm:text-4xl lg:text-[42px] 2xl:text-[48px] font-black text-slate-950 dark:text-white leading-[1.14] tracking-tight">
				{title}
			</h2>

			{description && (
				<p
					className={cn(
						"mt-3.5 sm:mt-4 text-[15px] sm:text-base 2xl:text-[17px] leading-relaxed text-slate-600 dark:text-slate-300 font-medium",
						isCenter && "max-w-xl mx-auto",
					)}
				>
					{description}
				</p>
			)}
		</div>
	);
}
