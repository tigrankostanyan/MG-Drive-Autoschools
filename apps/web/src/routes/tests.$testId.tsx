import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useAuthModal } from "@/components/auth/auth-modal-context";
import { QuizPageSkeleton } from "@/components/ui/page-skeleton";
import { useSession } from "@/hooks/use-session";
import { fetchAllTests, fetchTest } from "@/lib/api/tests";
import type { QuestionData, TestData } from "@/lib/api/types";
import { normalizeQuestion, normalizeQuestionOptions } from "@/lib/quiz";
import { privateSeo } from "@/lib/seo";
import { TestRunnerView } from "./tests.$testId/-components/TestRunnerView";

export const Route = createFileRoute("/tests/$testId")({
	pendingComponent: QuizPageSkeleton,
	pendingMs: 0,
	head: () =>
		privateSeo(
			"Քննական թեստ — MG Drive",
			"Անցեք քննական թեստը ժամանակի սահմանափակմամբ և տեսեք արդյունքը։",
		),
	loader: async ({ params: { testId } }) => {
		try {
			const [testRes, allTestsRes] = await Promise.all([
				fetchTest(testId),
				fetchAllTests().catch(() => null),
			]);
			const d = testRes.data;
			if (!d) throw new Error("not_found");
			const qs = d.questions ?? [];
			const mapped = qs.map((q: QuestionData) =>
				normalizeQuestion({
					...q,
					options: normalizeQuestionOptions(q.options),
				}),
			);
			const allTests = (allTestsRes?.data ?? []).sort(
				(a: TestData, b: TestData) => a.number - b.number,
			);
			return { test: d, questions: mapped, allTests };
		} catch (e: unknown) {
			if (
				(e instanceof Error && e.message === "not_found") ||
				(e as { routerCode?: string })?.routerCode === "NOT_FOUND"
			)
				throw new Error("not_found");
			throw e;
		}
	},
	component: TestRunnerWrapper,
});

function TestRunnerWrapper() {
	const { testId } = Route.useParams();
	const loaderData = Route.useLoaderData();
	const { user, ready } = useSession();
	const { openAuthModal } = useAuthModal();
	const navigate = useNavigate();

	// Wait for the client session store before deciding on the auth gate, so the
	// branch does not flip between the SSR placeholder and the client session.
	if (!ready) return <QuizPageSkeleton />;

	if (!user) {
		return (
			<div className="w-full min-h-[calc(100dvh-5rem)] bg-[#F8FAFC] dark:bg-[#0B0F19] py-6 sm:py-10 pb-16 sm:pb-24 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
				<div className="text-center space-y-4 max-w-md">
					<h2 className="text-xl font-bold text-slate-900 dark:text-white">
						Մուտք գործել անվճար հաշիվ
					</h2>
					<p className="text-sm text-slate-600 dark:text-slate-400">
						Այս թեստը բացառած է միայն մուտք գործած օգտատերերի համար։
					</p>
					<button
						type="button"
						onClick={() => navigate({ to: "/tests" })}
						className="text-sm text-primary underline underline-offset-2 hover:text-primary/80"
					>
						Վերադառնալ թեստերի ցուցադրությանը
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

	return <TestRunnerView key={testId} loaderData={loaderData} />;
}
