import { Link } from "@tanstack/react-router";
import { ArrowUpRight, CheckCircle2, Timer, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatProfileDate, type ProfileResult } from "@/lib/api/profile";

export function TestsTabHistoryTable({ testResults }: { testResults: ProfileResult[] }) {
	return (
		<div>
			<div className="mb-4 flex items-center justify-between">
				<div>
					<h3 className="text-lg font-black text-slate-900">Թեստերի պատմություն</h3>
					<p className="text-xs text-slate-500 font-medium">
						Ձեր բոլոր անցած քննական թեստերի մանրամասն արդյունքները
					</p>
				</div>
				<Link
					to="/tests"
					className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 hover:underline cursor-pointer"
				>
					<span>Բոլոր թեստերը</span>
					<ArrowUpRight className="size-3.5" />
				</Link>
			</div>

			<div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xs">
				<div className="overflow-x-auto">
					<table className="w-full text-left text-sm">
						<thead>
							<tr className="border-b border-slate-100 bg-slate-50/70">
								<th className="px-6 py-3.5 text-xs font-bold text-slate-500">Թեստ</th>
								<th className="px-6 py-3.5 text-xs font-bold text-slate-500">Արդյունք</th>
								<th className="px-6 py-3.5 text-xs font-bold text-slate-500">Ճիշտ / Սխալ</th>
								<th className="px-6 py-3.5 text-xs font-bold text-slate-500">Կարգավիճակ</th>
								<th className="px-6 py-3.5 text-xs font-bold text-slate-500">Տևողություն</th>
								<th className="px-6 py-3.5 text-xs font-bold text-slate-500">Ամսաթիվ</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-slate-100">
							{testResults.length === 0 && (
								<tr>
									<td
										colSpan={6}
										className="px-6 py-12 text-center text-sm font-semibold text-slate-500"
									>
										Դեռ հանձնած թեստ չկա։{" "}
										<Link to="/tests" className="text-blue-600 font-bold hover:underline">
											Սկսել առաջին թեստը
										</Link>
									</td>
								</tr>
							)}
							{testResults.map((r) => (
								<tr key={r.id} className="transition-colors hover:bg-slate-50/50">
									<td className="px-6 py-4 font-bold text-slate-900">{r.testTitle}</td>
									<td className="px-6 py-4">
										<span
											className={`font-black text-sm ${
												r.status === "passed" ? "text-emerald-600" : "text-rose-600"
											}`}
										>
											{r.score}%
										</span>
									</td>
									<td className="px-6 py-4 text-slate-600 font-semibold">
										<span className="text-emerald-600 font-bold">{r.correctCount}</span>
										<span className="mx-1 text-slate-300">/</span>
										<span className="text-rose-600 font-bold">{r.wrongCount}</span>
									</td>
									<td className="px-6 py-4">
										<Badge
											variant={r.status === "passed" ? "completed" : "destructive"}
											icon={
												r.status === "passed" ? (
													<CheckCircle2 className="size-3.5" />
												) : (
													<XCircle className="size-3.5" />
												)
											}
										>
											{r.status === "passed" ? "Հանձնված" : "Չհանձնված"}
										</Badge>
									</td>
									<td className="px-6 py-4 text-slate-500 font-medium text-xs">
										<span className="inline-flex items-center gap-1">
											<Timer className="size-3.5 text-slate-400" />
											{r.timeSpent != null ? `${r.timeSpent} րոպե` : "—"}
										</span>
									</td>
									<td className="px-6 py-4 text-slate-400 font-medium text-xs">
										{formatProfileDate(r.createdAt)}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
}
