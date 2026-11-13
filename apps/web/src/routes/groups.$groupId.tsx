import { createFileRoute, notFound, useNavigate } from "@tanstack/react-router";
import { useAuthModal } from "@/components/auth/auth-modal-context";
import { QuizPageSkeleton } from "@/components/ui/page-skeleton";
import { useGroupRunner } from "@/features/groups";
import { useSession } from "@/hooks/use-session";
import {
	fetchGroup,
	fetchGroupMetadata,
	fetchGroupProgress,
	fetchGroupQuestions,
} from "@/lib/api/groups";
import type { GroupData } from "@/lib/api/types";
import { getSession } from "@/lib/auth-guard";
import { privateSeo } from "@/lib/seo";
import { GroupHeaderCard } from "./groups/-components/GroupHeaderCard";
import { GroupProgressToolbar } from "./groups/-components/GroupProgressToolbar";
import { GroupQuestionList } from "./groups/-components/GroupQuestionList";

const GROUP_QUESTIONS_PER_PAGE = 25;

export const Route = createFileRoute("/groups/$groupId")({
	head: () =>
		privateSeo(
			"Խմբի հարցեր — MG Drive",
			"Լրացրեք խմբի հարցերը և տեսեք ճիշտ պատասխանների բացատրությունը։",
		),
	pendingComponent: QuizPageSkeleton,
	pendingMs: 0,
	loader: async ({ params: { groupId } }) => {
		try {
			const session = await getSession();
			const isAuthenticated = session.status === "ok";
			const [gRes, qs, prog, allGroupsRes] = await Promise.all([
				fetchGroup(groupId),
				isAuthenticated
					? fetchGroupQuestions(groupId, 1, GROUP_QUESTIONS_PER_PAGE)
					: Promise.resolve({ questions: [], total: 0 }),
				isAuthenticated
					? fetchGroupProgress(groupId).catch(() => ({ data: {} }))
					: Promise.resolve({ data: {} }),
				fetchGroupMetadata().catch(() => null),
			]);
			if (!gRes?.data) throw notFound();
			const allGroups = [...(allGroupsRes?.data ?? [])].sort(
				(a: GroupData, b: GroupData) => a.number - b.number,
			);
			return {
				group: gRes.data,
				questions: qs.questions,
				total: qs.total,
				prog: prog?.data ?? {},
				allGroups,
			};
		} catch (e: unknown) {
			if (e === notFound || (e as { routerCode?: string })?.routerCode === "NOT_FOUND")
				throw notFound();
			throw e;
		}
	},
	component: GroupPage,
});

function GroupPage() {
	const { groupId } = Route.useParams();
	const loaderData = Route.useLoaderData();
	const { user, ready } = useSession();
	const { openAuthModal } = useAuthModal();
	const navigate = useNavigate();

	const runner = useGroupRunner(groupId, loaderData);

	// Wait for the client session store before deciding on the auth gate.
	if (!ready) return <QuizPageSkeleton />;
	if (!user) {
		return (
			<div className="w-full min-h-[calc(100dvh-5rem)] bg-[#F8FAFC] dark:bg-[#0B0F19] py-6 sm:py-10 pb-16 sm:pb-24 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
				<div className="text-center space-y-4 max-w-md">
					<h2 className="text-xl font-bold text-slate-900 dark:text-white">
						Մուտք գործել անվճար հաշիվ
					</h2>
					<p className="text-sm text-slate-600 dark:text-slate-400">
						Այս խմբի հարցերը բացառած են միայն մուտք գործած օգտատերերի համար։
					</p>
					<button
						type="button"
						onClick={() => navigate({ to: "/groups" })}
						className="text-sm text-primary underline underline-offset-2 hover:text-primary/80"
					>
						Վերադառնալ խմբերի ցուցադրությանը
					</button>
					<button
						type="button"
						onClick={openAuthModal}
						className="w-full px-6 py-2.5 rounded-full bg-primary text-white font-medium hover:bg-primary/90 transition-colors"
					>
						Մուտք գործել
					</button>
				</div>
			</div>
		);
	}

	return (
		<div className="w-full min-h-[calc(100dvh-5rem)] bg-[#F8FAFC] dark:bg-[#0B0F19] py-6 sm:py-10 pb-16 sm:pb-24 px-4 sm:px-6 lg:px-8">
			<div className="w-full max-w-[1300px] mx-auto space-y-6 sm:space-y-8">
				<GroupHeaderCard runner={runner} />
				<GroupProgressToolbar runner={runner} />
				<GroupQuestionList runner={runner} />
			</div>
		</div>
	);
}
