import { BookOpen, FileCheck, HelpCircle, TrendingUp, Users } from "lucide-react";

export function StatCards({
	stats,
}: {
	stats: {
		students: number;
		groups: number;
		tests: number;
		questions: number;
		leads: number;
		passRate: string;
	};
}) {
	return (
		<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
			<div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-500 to-teal-600 p-6 text-white shadow-xl shadow-emerald-500/20 transition-transform duration-300 hover:-translate-y-1">
				<div className="flex items-center justify-between">
					<p className="text-xs font-bold uppercase tracking-wider text-emerald-100">
						Ընդհանուր Ուսանողներ
					</p>
					<div className="grid size-10 place-items-center rounded-2xl bg-white/20 backdrop-blur-md">
						<Users className="size-5 text-white" />
					</div>
				</div>
				<p className="mt-4 text-3xl font-black">{stats.students}</p>
				<div className="mt-4 flex items-center justify-between border-t border-white/20 pt-3 text-xs text-emerald-100">
					<span className="flex items-center gap-1 font-semibold">
						<TrendingUp className="size-3.5" /> +14.2% աճ
					</span>
					<span>Ակտիվ ուսում</span>
				</div>
			</div>
			<div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-blue-600 to-blue-800 p-6 text-white shadow-xl shadow-primary/25 transition-transform duration-300 hover:-translate-y-1">
				<div className="flex items-center justify-between">
					<p className="text-xs font-bold uppercase tracking-wider text-blue-100">Տեսական Խմբեր</p>
					<div className="grid size-10 place-items-center rounded-2xl bg-white/20 backdrop-blur-md">
						<BookOpen className="size-5 text-white" />
					</div>
				</div>
				<p className="mt-4 text-3xl font-black">{stats.groups} Խումբ</p>
				<div className="mt-4 flex items-center justify-between border-t border-white/20 pt-3 text-xs text-blue-100">
					<span>24 դասընթաց</span>
					<span className="font-semibold">100% ծածկույթ</span>
				</div>
			</div>
			<div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[rgba(71,61,255,1)] via-[rgba(64,64,145,1)] to-[rgba(41,64,163,1)] p-6 text-white shadow-xl shadow-purple-500/20 transition-transform duration-300 hover:-translate-y-1">
				<div className="flex items-center justify-between">
					<p className="text-xs font-bold uppercase tracking-wider text-purple-100">Թեստեր</p>
					<div className="grid size-10 place-items-center rounded-2xl bg-white/20 backdrop-blur-md">
						<FileCheck className="size-5 text-white" />
					</div>
				</div>
				<p className="mt-4 text-3xl font-black">{stats.tests} Թեստ</p>
				<div className="mt-4 flex items-center justify-between border-t border-white/20 pt-3 text-xs text-purple-100">
					<span>Հանձնման մակարդակ</span>
					<span className="font-bold text-white">{stats.passRate}</span>
				</div>
			</div>
			<div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-500 via-orange-500 to-rose-600 p-6 text-white shadow-xl shadow-orange-500/20 transition-transform duration-300 hover:-translate-y-1">
				<div className="flex items-center justify-between">
					<p className="text-xs font-bold uppercase tracking-wider text-amber-100">
						Հարցերի Շտեմարան
					</p>
					<div className="grid size-10 place-items-center rounded-2xl bg-white/20 backdrop-blur-md">
						<HelpCircle className="size-5 text-white" />
					</div>
				</div>
				<p className="mt-4 text-3xl font-black">{stats.questions}</p>
				<div className="mt-4 flex items-center justify-between border-t border-white/20 pt-3 text-xs text-amber-100">
					<span>Նորացված 2026</span>
					<span className="font-semibold">{stats.leads} Նոր Հայտ</span>
				</div>
			</div>
		</div>
	);
}
