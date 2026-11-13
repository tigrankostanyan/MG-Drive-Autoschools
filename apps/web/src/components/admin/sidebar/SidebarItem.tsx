import { motion } from "framer-motion";
import { GripVertical } from "lucide-react";
import type { TabType } from "@/components/admin/types";
import type { SortableDragHandle } from "@/components/ui/sortable-grid";
import type { MenuDef, MenuTabKey } from "./menuDefs";

export function SidebarItem({
	tabKey,
	def,
	active,
	enabled,
	isOverlay,
	dragHandle,
	onSelect,
}: {
	tabKey: MenuTabKey;
	def: MenuDef;
	active: boolean;
	enabled: boolean;
	isOverlay: boolean;
	dragHandle: SortableDragHandle | null;
	onSelect: (tab: TabType) => void;
}) {
	const Icon = def.icon;

	return (
		<div className={`relative flex items-center rounded-xl ${isOverlay ? "z-50" : ""}`}>
			{enabled && dragHandle && (
				<span
					{...dragHandle.attributes}
					{...dragHandle.listeners}
					className={`absolute left-1.5 z-20 grid cursor-grab touch-none place-items-center rounded-lg p-1 transition-colors active:cursor-grabbing ${
						active
							? "text-white/70 hover:text-white"
							: "text-slate-300 opacity-70 hover:text-slate-500 hover:opacity-100 dark:text-slate-600 dark:hover:text-slate-300"
					}`}
				>
					<GripVertical className="size-4" />
				</span>
			)}
			<button
				type="button"
				onClick={() => onSelect(tabKey)}
				className={`group relative flex w-full items-center justify-between rounded-xl py-3 pl-9 pr-3.5 text-sm font-bold transition-colors duration-300 outline-none ${
					active
						? "text-white"
						: "text-slate-500 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/60 dark:hover:text-slate-200"
				} ${isOverlay ? "scale-[1.03] shadow-xl" : ""}`}
			>
				{active && (
					<motion.div
						layoutId="active-sidebar-tab"
						className="absolute inset-0 rounded-xl bg-primary shadow-md shadow-primary/30 z-0 pointer-events-none"
						initial={false}
						style={{ willChange: "transform" }}
						transition={{
							type: "spring",
							stiffness: 260,
							damping: 30,
							mass: 1,
						}}
					/>
				)}
				<div className="relative z-10 flex items-center gap-3.5">
					<Icon
						className={`size-5 transition-colors duration-300 ${active ? "text-white" : "text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300"}`}
					/>
					<span>{def.label}</span>
				</div>
				{def.badge !== undefined && def.badge > 0 && (
					<span
						className={`relative z-10 grid place-items-center rounded-full text-[11px] font-black transition-colors duration-300 ${
							def.isPillBadge
								? "size-5.5 bg-rose-500 text-white shadow-xs"
								: active
									? "px-2 py-0.5 bg-white/20 text-white"
									: "px-2 py-0.5 bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
						}`}
					>
						{def.badge}
					</span>
				)}
			</button>
		</div>
	);
}
