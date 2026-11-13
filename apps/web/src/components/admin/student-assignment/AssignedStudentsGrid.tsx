import type { UserData } from "@/components/admin/types";

export function AssignedStudentsGrid({ groupStudents }: { groupStudents: UserData[] }) {
	if (groupStudents.length === 0) return null;
	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
			{groupStudents.map((student) => (
				<div
					key={student.id}
					className="flex flex-col gap-2 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900"
				>
					<div className="flex items-center gap-3">
						<div className="grid size-10 place-items-center rounded-full bg-accent/10 text-accent font-bold">
							{student.name?.[0]?.toUpperCase()}
						</div>
						<div>
							<p className="font-bold text-slate-900 dark:text-white">{student.name}</p>
							<p className="text-xs text-slate-500">{student.phone || student.email}</p>
						</div>
					</div>
				</div>
			))}
		</div>
	);
}
