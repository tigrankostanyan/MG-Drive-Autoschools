import { Link } from "@tanstack/react-router";
import { AlertOctagon, ArrowRight, CheckCircle2, RefreshCw, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { IconBox } from "@/components/ui/icon-box";
import type { ProfileData } from "@/lib/api/profile";
import { formatProfileDate } from "@/lib/api/profile";

export function WrongAnswersTab({ profile }: { profile: ProfileData | null }) {
	const wrongAnswers = profile?.wrongAnswers ?? [];

	return (
		<div className="animate-in fade-in slide-in-from-bottom-3 duration-500 space-y-6">
			{/* Alert / Motivation Banner */}
			<div className="rounded-2xl border border-rose-200 bg-gradient-to-r from-rose-50 via-rose-50/60 to-orange-50/50 p-5 flex items-start gap-4">
				<IconBox variant="danger" size="md" shape="rounded" className="shrink-0">
					<AlertOctagon className="size-5" />
				</IconBox>
				<div>
					<h4 className="text-sm font-black text-rose-900">
						Սխալների վերլուծություն և կրկնություն
					</h4>
					<p className="mt-1 text-xs text-rose-700 font-medium leading-relaxed">
						Այստեղ հավաքված են այն թեստերը, որտեղ թույլ եք տվել սխալներ։ Դրանց կրկնությունը 2 անգամ
						արագացնում է իրական քննության բարեհաջող հանձնումը։
					</p>
				</div>
			</div>

			{wrongAnswers.length === 0 ? (
				<div className="rounded-2xl border border-dashed border-emerald-200 bg-emerald-50/50 p-8 text-center">
					<CheckCircle2 className="mx-auto size-8 text-emerald-500" />
					<p className="mt-3 text-sm font-bold text-emerald-900">Սխալ պատասխաններ չկան</p>
					<p className="mt-1 text-xs font-medium text-emerald-700/80">
						Հիանալի է․ շարունակեք նույն մակարդակով։
					</p>
				</div>
			) : (
				<div className="grid gap-5 sm:grid-cols-2">
					{wrongAnswers.map((w) => (
						<Card
							key={w.id}
							variant="interactive"
							padding="lg"
							className="group flex flex-col justify-between hover:border-rose-300"
						>
							<div>
								<div className="flex items-start justify-between">
									<div className="flex items-center gap-3.5">
										<IconBox
											variant="danger"
											size="lg"
											shape="rounded"
											className="border border-rose-100"
										>
											<XCircle className="size-6" />
										</IconBox>
										<div>
											<p className="text-base font-black text-slate-900 group-hover:text-rose-600 transition-colors">
												{w.testTitle}
											</p>
											<p className="mt-0.5 text-xs font-semibold text-slate-400">
												{formatProfileDate(w.createdAt)}
											</p>
										</div>
									</div>
									<span className="text-2xl font-black text-rose-600">{w.score}%</span>
								</div>

								<div className="mt-4 rounded-xl bg-slate-50 p-3 flex items-center justify-between text-xs font-bold">
									<span className="text-slate-500">Սխալ պատասխաններ՝</span>
									<span className="text-rose-600 font-black">{w.wrongCount} հարց</span>
								</div>
							</div>

							<Button asChild variant="danger" size="default" className="mt-5 w-full">
								<Link to="/tests/$testId" params={{ testId: String(w.testId) }}>
									<RefreshCw className="size-4" />
									<span>Կրկնել սխալները</span>
									<ArrowRight className="size-4 ml-1" />
								</Link>
							</Button>
						</Card>
					))}
				</div>
			)}
		</div>
	);
}
