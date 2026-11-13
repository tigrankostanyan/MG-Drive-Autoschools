import { ListOrdered, Plus } from "lucide-react";
import { toast } from "sonner";
import { AdminCard } from "@/components/admin/AdminCard";
import { SaveButton } from "@/components/admin/SaveButton";
import type { MenuItemRow } from "@/hooks/use-menu-items";
import { MenuItemRowView } from "./MenuItemRowView";

export function MenuCard({
	menuItems,
	onAdd,
	onUpdate,
	onRemove,
	className = "",
}: {
	menuItems: MenuItemRow[];
	onAdd: () => void;
	onUpdate: (id: number, field: "label" | "path", value: string) => void;
	onRemove: (id: number) => void;
	className?: string;
}) {
	return (
		<AdminCard
			icon={ListOrdered}
			iconClassName="bg-gradient-to-br from-emerald-400 to-teal-600 shadow-lg shadow-emerald-500/30"
			stripClassName="bg-gradient-to-r from-emerald-500 to-teal-500 opacity-5"
			title="Նավիգացիոն Մենյու"
			description="Կառավարեք կայքի գլխավոր մենյուի հղումները:"
			className={`xl:col-span-2 ${className}`}
			headerAction={
				<button
					type="button"
					onClick={onAdd}
					className="flex items-center gap-2 rounded-2xl bg-slate-100 px-5 py-2.5 text-sm font-bold text-slate-700 transition-colors hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
				>
					<Plus className="size-4" />
					Ավելացնել Հղում
				</button>
			}
			footer={
				<SaveButton
					saving={false}
					label="Պահպանել Մենյուն"
					className="bg-[image:var(--gradient-accent)] shadow-accent/25 hover:shadow-accent/30"
					onClick={() => {
						toast.success("Մենյուի կարգավորումները հաջողությամբ պահպանվեցին (Mock)");
					}}
				/>
			}
		>
			<div className="mt-8 space-y-3">
				{menuItems.length > 0 && (
					<div className="hidden sm:flex items-center gap-4 px-5 text-xs font-bold uppercase tracking-wider text-slate-400">
						<span className="w-10 text-center">#</span>
						<span className="flex-1">Կոճակի Անվանում</span>
						<span className="flex-1">Հասցե / URL</span>
						<span className="w-10 text-center">Ջնջել</span>
					</div>
				)}
				{menuItems.map((item, idx) => (
					<MenuItemRowView
						key={item.id}
						index={idx + 1}
						item={item}
						onUpdate={(field, value) => onUpdate(item.id, field, value)}
						onRemove={() => onRemove(item.id)}
					/>
				))}
				{menuItems.length === 0 && (
					<div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 py-12 dark:border-slate-800">
						<ListOrdered className="size-12 text-slate-300 dark:text-slate-600" />
						<h3 className="mt-4 text-sm font-bold text-slate-700 dark:text-slate-300">
							Մենյուում հղումներ չկան
						</h3>
						<p className="mt-1 text-xs text-slate-500">
							Սեղմեք վերևի կոճակը՝ նոր հղում ավելացնելու համար
						</p>
					</div>
				)}
			</div>
		</AdminCard>
	);
}
