import { LayoutGroup } from "framer-motion";
import { type Dispatch, type SetStateAction, useMemo } from "react";
import { SortableGrid } from "@/components/ui/sortable-grid";
import { useListReorder } from "@/hooks/use-list-reorder";
import { reorderMenuItems } from "@/lib/api/admin-menu";
import type {
	AdminMenuItemData,
	GroupData,
	RegistrationItem,
	StudentGroupData,
	TestData,
	UserItem,
} from "@/lib/api/types";
import { logger } from "@/lib/observability/logger";
import { buildMenuDefs, isMenuTabKey, MENU_TAB_KEYS, type MenuTabKey } from "./sidebar/menuDefs";
import { SidebarBrand } from "./sidebar/SidebarBrand";
import { SidebarFooter } from "./sidebar/SidebarFooter";
import { SidebarItem } from "./sidebar/SidebarItem";
import type { TabType } from "./types";

type KnownMenuItem = AdminMenuItemData & { tabKey: MenuTabKey };

export function AdminSidebar({
	activeTab,
	onSelectTab,
	groups,
	tests,
	students,
	registrations,
	studentGroups,
	menuItems,
	onMenuItemsChange,
}: {
	activeTab: TabType;
	onSelectTab: (tab: TabType) => void;
	groups: GroupData[];
	tests: TestData[];
	students: UserItem[];
	registrations: RegistrationItem[];
	studentGroups: StudentGroupData[];
	menuItems: AdminMenuItemData[];
	onMenuItemsChange: Dispatch<SetStateAction<AdminMenuItemData[]>>;
}) {
	const menuDefs = useMemo(
		() =>
			buildMenuDefs({
				groups,
				tests,
				students,
				registrations,
				studentGroups,
			}),
		[groups, tests, students, registrations, studentGroups],
	);

	const knownItems = useMemo<KnownMenuItem[]>(() => {
		const known = menuItems.filter((m): m is KnownMenuItem => isMenuTabKey(m.tabKey));
		return known.length > 0
			? known
			: MENU_TAB_KEYS.map((tabKey, i) => ({
					id: i + 1,
					tabKey,
					sortControl: i + 1,
				}));
	}, [menuItems]);

	const { localItems, handleDragEnd } = useListReorder<KnownMenuItem, AdminMenuItemData>({
		items: knownItems,
		reorder: reorderMenuItems,
		onChange: onMenuItemsChange,
		successMessage: "Մենյուի հերթականությունը պահպանվեց",
		onError: (err) =>
			logger.error("admin_sidebar.reorder_failed", "reorderMenuItems error", { error: err }),
	});

	return (
		<aside className="w-full md:w-64 lg:w-72 shrink-0 md:h-screen md:sticky md:top-0 border-r border-slate-200/70 bg-white/95 p-6 backdrop-blur-xl dark:border-slate-800/80 dark:bg-[#111622]/95 flex flex-col justify-between overflow-y-auto z-30">
			<div>
				<SidebarBrand />
				<LayoutGroup id="admin-sidebar">
					<nav className="space-y-1.5">
						<SortableGrid
							items={localItems}
							enabled
							gridClassName="space-y-1.5"
							onDragEnd={handleDragEnd}
							renderItem={({ item, enabled, isOverlay, dragHandle }) => (
								<SidebarItem
									key={item.tabKey}
									tabKey={item.tabKey}
									def={menuDefs[item.tabKey]}
									active={activeTab === item.tabKey}
									enabled={enabled}
									isOverlay={isOverlay}
									dragHandle={dragHandle}
									onSelect={onSelectTab}
								/>
							)}
						/>
					</nav>
				</LayoutGroup>
			</div>
			<SidebarFooter activeTab={activeTab} onSelectTab={onSelectTab} />
		</aside>
	);
}
