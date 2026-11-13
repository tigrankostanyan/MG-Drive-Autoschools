import { CheckCircle2, MessageSquareQuote, Star } from "lucide-react";
import type { ProfileData } from "@/lib/api/profile";
import { formatProfileDate } from "@/lib/api/profile";

type OverviewFeedback = NonNullable<ProfileData>["feedback"] | null;

const STAR_KEYS = ["star-1", "star-2", "star-3", "star-4", "star-5"];

export function OverviewTabFeedback({ feedback }: { feedback: OverviewFeedback }) {
	return (
		<div>
			<div className="mb-4">
				<h3 className="text-lg font-black text-slate-900">Հրահանգչի Գնահատական և Դիտարկում</h3>
				<p className="text-xs text-slate-500 font-medium">
					Ձեր գործնական վարման արդյունքների պաշտոնական կարծիքը
				</p>
			</div>

			{feedback?.comment ? (
				<div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xs">
					<div className="grid md:grid-cols-[240px_1fr]">
						<div className="flex flex-col items-center justify-center gap-2 border-b border-slate-100 bg-gradient-to-b from-slate-50/80 to-slate-100/50 p-6 text-center md:border-b-0 md:border-r">
							<div className="relative">
								<div className="grid size-16 place-items-center rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-2xl font-black text-white shadow-md shadow-blue-500/20">
									{(feedback.name || "Հ").charAt(0)}
								</div>
								<div className="absolute -bottom-1 -right-1 grid size-6 place-items-center rounded-full bg-emerald-500 text-white border-2 border-white">
									<CheckCircle2 className="size-3.5" />
								</div>
							</div>

							<div>
								<p className="mt-2 text-sm font-black text-slate-900">
									{feedback.name || "Հրահանգիչ"}
								</p>
								<p className="text-[11px] font-bold text-blue-600">
									{feedback.type || "Գլխավոր Հրահանգիչ"}
								</p>
							</div>

							<div className="mt-1 flex gap-1 text-amber-400">
								{STAR_KEYS.map((starKey, i) => (
									<Star
										key={starKey}
										className={`size-4 ${
											i < (feedback.rating ?? 0)
												? "fill-amber-400 text-amber-400"
												: "text-slate-200"
										}`}
									/>
								))}
							</div>
						</div>

						<div className="p-6 md:p-8 flex flex-col justify-between">
							<div>
								<div className="flex items-center justify-between">
									<span className="text-xs font-bold uppercase tracking-wider text-slate-400">
										Վերջին դիտարկումը
									</span>
									<span className="text-xs font-semibold text-slate-400">
										{formatProfileDate(feedback.date)}
									</span>
								</div>
								<p className="mt-3 text-sm sm:text-base leading-relaxed text-slate-700 font-medium italic">
									"{feedback.comment}"
								</p>
							</div>
						</div>
					</div>
				</div>
			) : (
				<div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/60 p-8 text-center">
					<MessageSquareQuote className="mx-auto size-8 text-slate-300" />
					<p className="mt-3 text-sm font-bold text-slate-700">Դեռ գնահատական չկա</p>
					<p className="mt-1 text-xs font-medium text-slate-500">
						Հրահանգչի դիտարկումը կհայտնվի գործնական դասից հետո։
					</p>
				</div>
			)}
		</div>
	);
}
