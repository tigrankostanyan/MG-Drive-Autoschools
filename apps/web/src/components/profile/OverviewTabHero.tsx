import { Link } from "@tanstack/react-router";
import { ArrowRight, BookOpen, Sparkles, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CircularProgress } from "./CircularProgress";

interface OverviewTabHeroProps {
	progressPercent: number;
	displayName: string;
	allTopicsDone: boolean;
}

export function OverviewTabHero({
	progressPercent,
	displayName,
	allTopicsDone,
}: OverviewTabHeroProps) {
	return (
		<div className="relative overflow-hidden rounded-3xl bg-slate-950/95 p-6 sm:p-8 text-white shadow-[0_20px_50px_-10px_rgba(0,0,0,0.45)] border border-white/10">
			{/* Subtle top reflection line matching hero dock */}
			<div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-white/25 to-transparent pointer-events-none" />

			{/* Glow Spheres */}
			<div className="absolute -right-16 -top-16 size-64 rounded-full bg-blue-600/20 blur-3xl pointer-events-none" />
			<div className="absolute left-1/3 -bottom-16 size-56 rounded-full bg-indigo-600/20 blur-3xl pointer-events-none" />

			<div className="relative z-10 flex flex-col items-center gap-8 lg:flex-row lg:justify-between">
				<div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
					<div className="relative p-2 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 shadow-inner">
						<CircularProgress percent={progressPercent} size={120} />
					</div>

					<div>
						<div className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/15 px-3 py-1 text-xs font-bold text-blue-300 backdrop-blur-sm border border-blue-400/25 mb-2">
							<Sparkles className="size-3 text-amber-300" />
							<span>Ուսումնական առաջընթաց · {progressPercent}%</span>
						</div>
						<h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
							Բարի վերադարձ, {displayName.split(" ")[0]}!
						</h2>
						<p className="mt-1.5 max-w-md text-xs sm:text-sm leading-relaxed text-slate-300 font-medium">
							{allTopicsDone ? (
								<>
									Դուք ավարտել եք դասընթացի{" "}
									<span className="font-black text-amber-300">100%-ը</span>։ Շարունակեք կրկնել
									թեստերը՝ արդյունքը պահպանելու համար։
								</>
							) : (
								<>
									Դուք ավարտել եք դասընթացի{" "}
									<span className="font-black text-amber-300">{progressPercent}%-ը</span>։
									Շարունակեք նույն տեմպով՝ քննությանը լիարժեք պատրաստ լինելու համար։
								</>
							)}
						</p>

						<div className="mt-5 flex flex-wrap items-center justify-center sm:justify-start gap-3">
							<Button asChild variant="primary" size="sm">
								<Link to="/groups">
									<BookOpen className="size-4" />
									<span>Շարունակել ուսուցումը</span>
									<ArrowRight className="size-4" />
								</Link>
							</Button>
							<Button
								asChild
								variant="outline"
								size="sm"
								className="border-white/20 bg-white/10 text-white hover:bg-white/20 hover:text-white hover:border-white/30 rounded-full"
							>
								<Link to="/tests">
									<Trophy className="size-4 text-amber-300" />
									<span>Սկսել քննական թեստ</span>
								</Link>
							</Button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
