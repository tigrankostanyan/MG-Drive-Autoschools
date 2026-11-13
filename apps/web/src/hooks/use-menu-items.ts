import { useState } from "react";
import { navItems } from "@/lib/nav-config";

export interface MenuItemRow {
	id: number;
	label: string;
	path: string;
}

/** Seeded from the canonical site nav, so the admin list cannot drift. */
const DEFAULT_MENU_ITEMS: MenuItemRow[] = navItems.map((item, idx) => ({
	id: idx + 1,
	label: item.label,
	path: item.to,
}));

/**
 * Local editing state for the nav-menu list shown in admin settings.
 *
 * NOTE: this is not yet wired to the real `/admin-menu` API
 * (`fetchMenuItems` / `reorderMenuItems` in `@/lib/api`) — persisting this
 * list is a follow-up, tracked separately from this architecture cleanup.
 */
export function useMenuItems(initialItems: MenuItemRow[] = DEFAULT_MENU_ITEMS) {
	const [menuItems, setMenuItems] = useState<MenuItemRow[]>(initialItems);

	const addMenuItem = () => {
		setMenuItems((items) => [...items, { id: Date.now(), label: "", path: "" }]);
	};

	const updateMenuItem = (id: number, field: "label" | "path", value: string) => {
		setMenuItems((items) =>
			items.map((item) => (item.id === id ? { ...item, [field]: value } : item)),
		);
	};

	const removeMenuItem = (id: number) => {
		setMenuItems((items) => items.filter((item) => item.id !== id));
	};

	return { menuItems, addMenuItem, updateMenuItem, removeMenuItem };
}
