import { Link } from "@tanstack/react-router";
import { Award, Sparkles, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useSession } from "@/hooks/use-session";

export function CoursesHeader() {
	const { user } = useSession();
	const canAccessGroupsTests = user?.role === "student" || user?.role === "admin";

	return (
		<div className="mb-10 sm:mb-14">
			<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
				<div>
					<div className="mb-2.5">
						<Badge variant="pill" icon={<Sparkles className="size-3.5 text-primary" />}>
							Ուսումնական ծրագրեր
						</Badge>
					</div>
					<h1 className="text-3xl sm:text-4xl lg:text-[42px] font-black tracking-tight text-slate-950 dark:text-white leading-tight">
						Մեր Դասընթացները
					</h1>
					<p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-2xl font-medium leading-relaxed">
						Ընտրեք ձեր նախընտրած ծրագիրը՝ տեսական նախապատրաստում, գործնական վարում կամ ամբողջական
						փաթեպ։
					</p>
				</div>
				{canAccessGroupsTests && (
					<div className="flex items-center gap-3 shrink-0">
						<Button asChild variant="outline" size="sm">
							<Link to="/groups">
								<Users className="size-3.5 text-primary" />
								<span>Թեմատիկ խմբեր</span>
							</Link>
						</Button>
						<Button asChild variant="outline" size="sm">
							<Link to="/tests">
								<Award className="size-3.5 text-primary" />
								<span>Քննական թեստեր</span>
							</Link>
						</Button>
					</div>
				)}
			</div>
		</div>
	);
}
