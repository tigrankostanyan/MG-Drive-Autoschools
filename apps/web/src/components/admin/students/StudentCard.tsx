import { GripVertical, Trash2 } from "lucide-react";
import { CustomSelect } from "@/components/ui/custom-select";
import type { SortableDragHandle } from "@/components/ui/sortable-grid";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";
import type { UserItem } from "@/lib/api/types";
import { StudentContactRow } from "./StudentContactRow";

export interface StudentCardProps {
	user: UserItem;
	enabled: boolean;
	isOverlay: boolean;
	dragHandle: SortableDragHandle | null;
	onToggleAnalytics: (user: UserItem) => void;
	onTogglePaid: (user: UserItem) => void;
	onChangeRole: (user: UserItem, role: string) => void;
	onDelete: (id: number) => void;
}

export function StudentCard({
	user,
	enabled,
	isOverlay,
	dragHandle,
	onToggleAnalytics,
	onTogglePaid,
	onChangeRole,
	onDelete,
}: StudentCardProps) {
	const { copiedField, copy } = useCopyToClipboard();

	const handleCopy = (e: React.MouseEvent, text: string | undefined, field: "email" | "phone") => {
		e.stopPropagation();
		void copy(text, field);
	};

	return (
		<div
			className={`group relative z-0 hover:z-10 focus-within:z-10 rounded-3xl border p-5 transition-all duration-200 ${
				isOverlay
					? "border-accent/60 bg-accent/10 shadow-2xl scale-[1.02] cursor-grabbing dark:bg-primary/20"
					: "border-slate-200/80 bg-white hover:border-accent/50 hover:shadow-md dark:border-slate-800 dark:bg-slate-900/60"
			}`}
		>
			<div className="flex items-start justify-between gap-3">
				<div className="flex items-center gap-3 min-w-0">
					{enabled && dragHandle && (
						<span
							{...dragHandle.attributes}
							{...dragHandle.listeners}
							className="cursor-grab active:cursor-grabbing text-slate-300 hover:text-slate-500 dark:text-slate-600 dark:hover:text-slate-400 transition-colors touch-none"
						>
							<GripVertical className="size-4" />
						</span>
					)}
					<div className="grid size-11 shrink-0 place-items-center rounded-2xl bg-[image:var(--gradient-accent)] font-black text-white shadow-md shadow-accent/20">
						{user.name.charAt(0).toUpperCase()}
					</div>
					<div className="min-w-0">
						<p className="truncate text-sm font-black text-slate-900 dark:text-white">
							{user.name}
						</p>
						<p className="text-[11px] font-semibold text-slate-400">ID: {user.id}</p>
					</div>
				</div>
				<button
					type="button"
					onClick={() => onDelete(user.id)}
					title="Հեռացնել"
					className="grid size-8 shrink-0 place-items-center rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 dark:bg-rose-950/40 dark:text-rose-400"
				>
					<Trash2 className="size-3.5" />
				</button>
			</div>
			<div className="mt-4 space-y-1 text-xs">
				<StudentContactRow
					user={user}
					field="email"
					copied={copiedField === "email"}
					onCopy={handleCopy}
				/>
				<StudentContactRow
					user={user}
					field="phone"
					copied={copiedField === "phone"}
					onCopy={handleCopy}
				/>
			</div>
			<div className="mt-4 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-4 dark:border-slate-800">
				<CustomSelect
					value={user.role || "student"}
					onChange={(val) => onChangeRole(user, val)}
					options={[
						{ value: "student", label: "Ուսանող" },
						{ value: "user", label: "Օգտվող" },
					]}
				/>
				<button
					type="button"
					onClick={() => onTogglePaid(user)}
					className={`rounded-full px-2.5 py-1 text-[11px] font-bold transition-colors ${
						user.has_paid
							? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400"
							: "bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400"
					}`}
				>
					{user.has_paid ? "Վճարված է" : "Չվճարված"}
				</button>
				<button
					type="button"
					onClick={() => onToggleAnalytics(user)}
					className={`rounded-full px-2.5 py-1 text-[11px] font-bold transition-colors ${
						user.include_in_analytics !== false
							? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400"
							: "bg-slate-100 text-slate-400 dark:bg-slate-800"
					}`}
				>
					{user.include_in_analytics !== false ? "Ակտիվ" : "Անջատված"}
				</button>
			</div>
		</div>
	);
}
