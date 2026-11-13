import { createFileRoute } from "@tanstack/react-router";
import * as React from "react";
import { CourseCard } from "@/components/learning/CourseCard";
import { CourseRegistrationModal } from "@/components/learning/CourseRegistrationModal";
import { CoursesHeader } from "@/components/learning/CoursesHeader";
import { COURSE_PLANS } from "@/components/learning/course-plans";
import { ListPageSkeleton } from "@/components/ui/page-skeleton";
import { pageSeo } from "@/lib/seo";

export const Route = createFileRoute("/courses")({
	pendingComponent: ListPageSkeleton,
	pendingMs: 0,
	head: () =>
		pageSeo({
			title: "Դասընթացներ — MG Drive",
			description:
				"MG Drive-ի ուսումնական ծրագրեր՝ տեսական դասընթացներ, գործնական վարում և քննական պատրաստություն։",
			path: "/courses",
		}),
	component: CoursesPage,
});

function CoursesPage() {
	const [isModalOpen, setIsModalOpen] = React.useState(false);
	const [selectedPackage, setSelectedPackage] = React.useState("տեսական");

	const handleRegisterClick = (packageValue: string) => {
		setSelectedPackage(packageValue);
		setIsModalOpen(true);
	};

	return (
		<div className="min-h-screen bg-slate-50/60 dark:bg-slate-950 pt-10 sm:pt-14 pb-20 sm:pb-24">
			<div className="container">
				<CoursesHeader />

				<div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
					{COURSE_PLANS.map((plan) => (
						<CourseCard key={plan.id} plan={plan} onRegister={handleRegisterClick} />
					))}
				</div>
			</div>

			<CourseRegistrationModal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				selectedPackage={selectedPackage}
			/>
		</div>
	);
}
