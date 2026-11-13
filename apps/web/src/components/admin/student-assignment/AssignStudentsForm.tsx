import { Check, Loader2, Search } from "lucide-react";
import { useState } from "react";
import type { UserData } from "@/components/admin/types";

export function AssignStudentsForm({
	expandedGroupId,
	allStudents,
	groupTitles,
	selectedStudentIds,
	saving,
	onStudentToggle,
	onCancelAssign,
	onSaveStudents,
}: {
	expandedGroupId: number;
	allStudents: UserData[];
	groupTitles: Record<number, string>;
	selectedStudentIds: number[];
	saving: boolean;
	onStudentToggle: (studentId: number, checked: boolean) => void;
	onCancelAssign: () => void;
	onSaveStudents: () => void;
}) {
	const [showAllStudents, setShowAllStudents] = useState(false);
	const [search, setSearch] = useState("");
	const normalizedSearch = search.trim().toLowerCase();
	const visibleStudents = allStudents.filter(
		(s) =>
			(showAllStudents || s.groupId == null || s.groupId === expandedGroupId) &&
			(!normalizedSearch ||
				s.name.toLowerCase().includes(normalizedSearch) ||
				(s.email ?? "").toLowerCase().includes(normalizedSearch)),
	);
	return (
		<div className="rounded-3xl border-2 border-accent bg-white p-6 shadow-xl dark:bg-slate-900">
			<div className="flex flex-wrap items-center justify-between gap-2">
				<h3 className="text-sm font-extrabold text-accent">
					Նշեք ուսանողներին, ովքեր պետք է լինեն այս խմբում
				</h3>
				<p className="text-xs font-bold text-slate-500">
					Ընդհանուր {allStudents.length} ուսանող • Ընտրված՝ {selectedStudentIds.length}
				</p>
			</div>
			<div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
				<div className="relative w-full sm:max-w-xs">
					<Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
					<input
						type="text"
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						placeholder="Որոնել անունով կամ էլ. փոստով..."
						className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm font-semibold text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-accent dark:border-slate-700 dark:bg-slate-800 dark:text-white"
					/>
				</div>
				<label className="flex w-fit cursor-pointer select-none items-center gap-2 text-xs font-bold text-slate-500 transition-colors hover:text-slate-700 dark:hover:text-slate-300">
					<input
						type="checkbox"
						checked={showAllStudents}
						onChange={(e) => setShowAllStudents(e.target.checked)}
						className="size-4 rounded text-accent focus:ring-0"
					/>
					Ցույց տալ նաև այլ խմբերում գտնվող ուսանողներին
				</label>
			</div>
			<div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[400px] overflow-y-auto pr-2">
				{visibleStudents.map((student) => {
					const isInAnotherGroup = student.groupId != null && student.groupId !== expandedGroupId;
					const isSelected = selectedStudentIds.includes(student.id);
					return (
						<label
							key={student.id}
							className={`flex items-center gap-3 p-3 rounded-2xl border transition-colors ${
								isInAnotherGroup
									? "cursor-not-allowed border-slate-200/60 bg-slate-50/50 opacity-60 dark:border-slate-800 dark:bg-slate-800/30"
									: isSelected
										? "border-accent bg-accent/5 dark:bg-accent/10 cursor-pointer"
										: "border-slate-200 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/50 cursor-pointer"
							}`}
						>
							<div className="relative flex shrink-0 items-center justify-center">
								<input
									type="checkbox"
									className="peer sr-only"
									checked={isSelected}
									disabled={isInAnotherGroup || saving}
									onChange={(e) => onStudentToggle(student.id, e.target.checked)}
								/>
								<div className="flex size-5.5 items-center justify-center rounded-[6px] border-2 border-slate-300 bg-white transition-all duration-200 peer-checked:border-accent peer-checked:bg-accent peer-disabled:opacity-50 dark:border-slate-600 dark:bg-slate-800 dark:peer-checked:border-accent dark:peer-checked:bg-accent">
									{isSelected && <Check className="size-3.5 text-white" strokeWidth={3} />}
								</div>
							</div>
							<div>
								<p className="font-bold text-sm text-slate-900 dark:text-white">{student.name}</p>
								<p className="text-xs text-slate-500">
									{isInAnotherGroup && student.groupId != null
										? `Արդեն խմբում՝ ${groupTitles[student.groupId] ?? `#${student.groupId}`}`
										: student.email}
								</p>
							</div>
						</label>
					);
				})}
				{visibleStudents.length === 0 && (
					<p className="col-span-full py-8 text-center text-xs font-bold text-slate-400">
						{normalizedSearch ? "Ոչինչ չի գտնվել" : "Ավելացնելու հասանելի ուսանողներ չկան"}
					</p>
				)}
			</div>
			<div className="mt-6 flex justify-end gap-3">
				<button
					type="button"
					onClick={onCancelAssign}
					disabled={saving}
					className="px-5 py-2.5 rounded-xl border font-bold text-slate-600 hover:bg-slate-50 disabled:pointer-events-none disabled:opacity-60 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800"
				>
					Չեղարկել
				</button>
				<button
					type="button"
					onClick={onSaveStudents}
					disabled={saving}
					aria-busy={saving ? true : undefined}
					className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-accent font-bold text-white shadow-md shadow-accent/25 hover:brightness-110 disabled:pointer-events-none disabled:opacity-70"
				>
					{saving && <Loader2 className="size-4 animate-spin" />}
					Պահպանել Փոփոխությունները
				</button>
			</div>
		</div>
	);
}
