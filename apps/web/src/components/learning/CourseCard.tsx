import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { IconBox } from "@/components/ui/icon-box";
import { CourseFeaturesList } from "./CourseFeaturesList";
import { CoursePlanDetails } from "./CoursePlanDetails";
import type { CoursePlan } from "./course-plans";

export function CourseCard({
	plan,
	onRegister,
}: {
	plan: CoursePlan;
	onRegister: (packageValue: string) => void;
}) {
	const Icon = plan.icon;
	const isPopular = plan.popular;

	return (
		<div
			className={`relative flex flex-col justify-between rounded-2xl sm:rounded-3xl p-6 sm:p-7 2xl:p-8 transition-all duration-300 hover:-translate-y-1 ${
				isPopular
					? "bg-slate-950/90 dark:bg-slate-950/95 border border-white/10 shadow-[0_20px_50px_-10px_rgba(0,0,0,0.45)] backdrop-blur-xl ring-2 ring-primary/40"
					: "bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-[0_4px_20px_-4px_rgba(15,23,42,0.06)] hover:border-primary/40 hover:shadow-[0_16px_36px_-6px_rgba(4,77,218,0.12)]"
			}`}
		>
			{/* Top edge hairline light reflection for popular card */}
			{isPopular && (
				<div className="absolute inset-0 overflow-hidden rounded-2xl sm:rounded-3xl pointer-events-none">
					<div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />
					<div className="absolute -right-8 -top-8 w-44 h-44 bg-blue-600/15 rounded-full blur-3xl" />
				</div>
			)}

			{isPopular && (
				<Badge
					variant="gradient"
					className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 font-bold text-xs uppercase tracking-wider shadow-lg shadow-primary/30"
				>
					Ամենապահանջված ծրագիր
				</Badge>
			)}

			<div>
				<div className="flex items-center justify-between mb-5">
					{isPopular ? (
						<div className="size-12 rounded-2xl bg-blue-500/15 border border-blue-400/25 flex items-center justify-center text-blue-400 shadow-[0_0_20px_rgba(4,77,218,0.25)]">
							<Icon className="size-6" />
						</div>
					) : (
						<IconBox variant="primary" size="xl">
							<Icon className="size-6.5" />
						</IconBox>
					)}

					<Badge
						variant="outline"
						className={
							isPopular
								? "bg-amber-500/15 text-amber-300 border-amber-400/30 font-bold"
								: plan.badgeColor
						}
					>
						{plan.badge}
					</Badge>
				</div>

				<h3
					className={`text-xl sm:text-2xl font-black tracking-tight ${
						isPopular ? "text-white" : "text-slate-950 dark:text-white"
					}`}
				>
					{plan.title}
				</h3>
				<p
					className={`mt-2 text-xs sm:text-[13.5px] leading-relaxed font-medium min-h-[40px] ${
						isPopular ? "text-slate-300" : "text-slate-600 dark:text-slate-400"
					}`}
				>
					{plan.subtitle}
				</p>

				<CoursePlanDetails plan={plan} isPopular={isPopular} />
				<CourseFeaturesList features={plan.features} isPopular={isPopular} />
			</div>

			<div
				className={`mt-8 pt-4 border-t ${
					isPopular ? "border-white/10" : "border-slate-100 dark:border-slate-800"
				}`}
			>
				{plan.isRegister ? (
					<Button
						size="lg"
						className="w-full gap-2 group rounded-full font-bold uppercase tracking-wider shadow-lg shadow-primary/30 hover:shadow-primary/40 cursor-pointer"
						onClick={() => onRegister(plan.packageValue || "տեսական")}
					>
						<span>{plan.ctaText}</span>
						<ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-1" />
					</Button>
				) : (
					<Button
						asChild
						size="lg"
						className="w-full gap-2 group rounded-full font-bold uppercase tracking-wider cursor-pointer"
					>
						<Link to={plan.ctaLink || "/"}>
							<span>{plan.ctaText}</span>
							<ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-1" />
						</Link>
					</Button>
				)}
			</div>
		</div>
	);
}
