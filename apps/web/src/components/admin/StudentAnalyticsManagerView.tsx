import { Loader2, Power, RotateCcw, Search, Users } from "lucide-react";
import { useMemo, useState } from "react";
import { Pagination } from "@/components/ui/pagination";
import type { StudentGroupData } from "@/lib/api/types";
import { StudentAnalyticsSummaryCards } from "./student-analytics/StudentAnalyticsSummaryCards";
import { StudentAnalyticsTableRow } from "./student-analytics/StudentAnalyticsTableRow";
import { useStudentAnalytics } from "./student-analytics/useStudentAnalytics";

export function StudentAnalyticsManagerView({
	studentGroups = [],
	initialGroupId,
}: {
	studentGroups?: StudentGroupData[];
	initialGroupId?: number | string | undefined;
}) {
	const {
		students,
		summary,
		loading,
		search,
		setSearch,
		selectedGroupId,
		setSelectedGroupId,
		selectedStatus,
		setSelectedStatus,
		expandedStudentId,
		toggleExpand,
		togglingIds,
		bulkToggling,
		allActive,
		handleToggleOne,
		handleBulkToggle,
		reload,
	} = useStudentAnalytics({ initialGroupId });

	// Pagination
	const [currentPage, setCurrentPage] = useState(1);
	const [itemsPerPage, setItemsPerPage] = useState(10);

	const paginatedStudents = useMemo(() => {
		const start = (currentPage - 1) * itemsPerPage;
		return students.slice(start, start + itemsPerPage);
	}, [students, currentPage, itemsPerPage]);

	const totalPages = Math.ceil(students.length / itemsPerPage);

	const selectedGroup = useMemo(() => {
		if (selectedGroupId === "all") return null;
		return studentGroups.find((g) => String(g.id) === String(selectedGroupId));
	}, [selectedGroupId, studentGroups]);

	return (
		<div className="space-y-6">
			{/* Top Bar with Title and Actions matching the screenshot */}
			<div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
				{/* Title and Count Badge */}
				<div className="flex items-center gap-3">
					<h2 className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">
						Ուսանողների Ցանկ
					</h2>
					<span className="grid min-w-[28px] place-items-center rounded-full bg-[#044dda] px-2 py-0.5 text-xs font-black text-white shadow-xs">
						{students.length}
					</span>
				</div>

				{/* Controls: Bulk Toggle, Search, and Filters */}
				<div className="flex flex-wrap items-center gap-2.5">
					{/* Bulk Toggle Button */}
					<button
						type="button"
						disabled={bulkToggling || students.length === 0}
						onClick={() => handleBulkToggle(!allActive)}
						className={`flex items-center gap-2 rounded-2xl border px-3.5 py-2 text-xs font-bold transition-all ${
							allActive
								? "border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100 dark:border-rose-900/40 dark:bg-rose-950/40 dark:text-rose-400"
								: "border-emerald-200 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 dark:border-emerald-900/40 dark:bg-emerald-950/40 dark:text-emerald-400"
						} ${bulkToggling ? "opacity-60 cursor-not-allowed" : ""}`}
					>
						{bulkToggling ? (
							<Loader2 className="size-3.5 animate-spin" />
						) : (
							<Power className="size-3.5" />
						)}
						<span>{allActive ? "Անջատել Բոլորը" : "Միացնել Բոլորը"}</span>
					</button>

					{/* Search Input */}
					<div className="relative min-w-[220px] flex-1 sm:w-64 sm:flex-initial">
						<Search className="absolute left-3.5 top-1/2 size-3.5 -translate-y-1/2 text-slate-400" />
						<input
							type="text"
							value={search}
							onChange={(e) => {
								setSearch(e.target.value);
								setCurrentPage(1);
							}}
							placeholder="Որոնել ուսանողին..."
							className="w-full rounded-2xl border border-slate-200 bg-white py-2 pl-9 pr-3 text-xs font-semibold text-slate-800 placeholder-slate-400 shadow-2xs outline-none transition-colors focus:border-accent dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
						/>
					</div>

					{/* Group Filter */}
					{studentGroups.length > 0 && (
						<div className="relative">
							<select
								value={selectedGroupId}
								onChange={(e) => {
									setSelectedGroupId(e.target.value);
									setCurrentPage(1);
								}}
								className="rounded-2xl border border-slate-200 bg-white py-2 pl-3 pr-8 text-xs font-bold text-slate-700 shadow-2xs outline-none focus:border-accent dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
							>
								<option value="all">Բոլոր Խմբերը</option>
								{studentGroups.map((group) => (
									<option key={group.id} value={group.id}>
										{group.title}
									</option>
								))}
							</select>
						</div>
					)}

					{/* Status Filter */}
					<div className="relative">
						<select
							value={selectedStatus}
							onChange={(e) => {
								setSelectedStatus(e.target.value);
								setCurrentPage(1);
							}}
							className="rounded-2xl border border-slate-200 bg-white py-2 pl-3 pr-8 text-xs font-bold text-slate-700 shadow-2xs outline-none focus:border-accent dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
						>
							<option value="all">Բոլորը</option>
							<option value="improving">Աճող</option>
							<option value="risk">Ռիսկային</option>
							<option value="stagnant">Կայուն</option>
						</select>
					</div>

					{/* Reload button */}
					<button
						type="button"
						onClick={() => void reload()}
						title="Թարմացնել"
						className="grid size-9 place-items-center rounded-2xl border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400"
					>
						<RotateCcw className={`size-3.5 ${loading ? "animate-spin" : ""}`} />
					</button>
				</div>
			</div>

			{/* Group Selection Banner (if filtered by group) */}
			{selectedGroup && (
				<div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-blue-100 bg-blue-50/70 p-4 dark:border-blue-900/40 dark:bg-blue-950/30">
					<div className="flex items-center gap-2.5">
						<div className="grid size-8 place-items-center rounded-xl bg-blue-600 text-white shadow-xs">
							<Users className="size-4" />
						</div>
						<div>
							<h4 className="text-xs font-black text-blue-950 dark:text-blue-200">
								Ընտրված խումբ՝ {selectedGroup.title}
							</h4>
							<p className="text-[11px] font-semibold text-blue-700/80 dark:text-blue-300">
								Խմբի {students.length} ուսանողների առաջադիմություն
							</p>
						</div>
					</div>

					<div className="flex items-center gap-2">
						<button
							type="button"
							onClick={() => handleBulkToggle(true, String(selectedGroup.id))}
							className="rounded-xl bg-blue-600 px-3 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-blue-700 transition-colors"
						>
							Միացնել խմբի ուսանողներին
						</button>
						<button
							type="button"
							onClick={() => handleBulkToggle(false, String(selectedGroup.id))}
							className="rounded-xl border border-blue-200 bg-white px-3 py-1.5 text-xs font-bold text-blue-700 hover:bg-blue-50 dark:border-blue-800 dark:bg-slate-900 dark:text-blue-300"
						>
							Անջատել խմբի ուսանողներին
						</button>
					</div>
				</div>
			)}

			{/* Progress Summary Cards */}
			{summary && (
				<StudentAnalyticsSummaryCards
					summary={summary}
					title={
						selectedGroup
							? `«${selectedGroup.title}» Խմբի առաջընթացի ամփոփում`
							: "ԱՌԱՋԸՆԹԱՑԻ ԱՄՓՈՓՈՒՄ"
					}
				/>
			)}

			{/* Table Container */}
			<div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900/60">
				{loading ? (
					<div className="flex flex-col items-center justify-center py-24 text-slate-400">
						<Loader2 className="size-8 animate-spin text-accent" />
						<p className="mt-3 text-xs font-bold">Բեռնվում է ուսանողների անալիտիկան...</p>
					</div>
				) : paginatedStudents.length === 0 ? (
					<div className="py-20 text-center">
						<Users className="mx-auto size-10 text-slate-300 dark:text-slate-600" />
						<p className="mt-3 text-sm font-bold text-slate-700 dark:text-slate-300">
							Ուսանողներ չեն գտնվել
						</p>
						<p className="mt-1 text-xs font-semibold text-slate-400">
							Փորձեք փոխել որոնման կամ ֆիլտրի պարամետրերը։
						</p>
					</div>
				) : (
					<div className="overflow-x-auto">
						<table className="w-full text-left">
							<thead>
								<tr className="border-b border-slate-100 bg-slate-50/50 text-[11px] font-extrabold uppercase tracking-wider text-slate-400 dark:border-slate-800 dark:bg-slate-800/30">
									<th className="py-4 pl-6 pr-4">ՈՒՍԱՆՈՂ</th>
									<th className="py-4 px-4">ՓՈՐՁԵՐ</th>
									<th className="py-4 px-4">ՎԵՐՋԻՆ ՄԻԱՎՈՐ</th>
									<th className="py-4 px-4">ԱՃԻ ԴԻՆԱՄԻԿԱ</th>
									<th className="py-4 px-4">ԿԱՐԳԱՎԻՃԱԿ</th>
									<th className="py-4 px-4">ԱՆԱԼԻՏԻԿԱ</th>
									<th className="py-4 pr-6 pl-4 text-right">ԳՈՐԾՈՂՈՒԹՅՈՒՆ</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
								{paginatedStudents.map((student) => (
									<StudentAnalyticsTableRow
										key={student.id}
										student={student}
										isExpanded={expandedStudentId === student.id}
										isToggling={togglingIds.has(student.id)}
										onToggleExpand={() => toggleExpand(student.id)}
										onToggleAnalytics={() => handleToggleOne(student)}
									/>
								))}
							</tbody>
						</table>
					</div>
				)}
			</div>

			{/* Pagination */}
			{totalPages > 1 && (
				<Pagination
					currentPage={currentPage}
					totalPages={totalPages}
					onPageChange={setCurrentPage}
					itemsPerPage={itemsPerPage}
					onItemsPerPageChange={(size) => {
						setItemsPerPage(size);
						setCurrentPage(1);
					}}
				/>
			)}
		</div>
	);
}
