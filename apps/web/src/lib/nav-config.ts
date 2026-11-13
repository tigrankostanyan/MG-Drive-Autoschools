import type { UserRole } from "./auth-types";

export interface NavItem {
	to: string;
	label: string;
	roles?: UserRole[];
}

/** Nav items visible to all users regardless of role. */
const ALL_ROLES_NAV_ITEMS: NavItem[] = [
	{ to: "/", label: "Գլխավոր" },
	{ to: "/courses", label: "Դասընթացներ" },
	{ to: "/how-it-works", label: "Ուսուցման ընթացք" },
];

/** Groups and Tests are publicly visible in the nav. */
const ROLE_RESTRICTED_NAV_ITEMS: NavItem[] = [
	{ to: "/groups", label: "Խմբեր" },
	{ to: "/tests", label: "Թեստեր" },
];

export const navItems = [...ALL_ROLES_NAV_ITEMS, ...ROLE_RESTRICTED_NAV_ITEMS];

/** Return nav items visible to the given user role. */
export function getVisibleNavItems(userRole?: string | null): NavItem[] {
	return navItems.filter(
		(item) => !item.roles || (userRole && item.roles.includes(userRole as UserRole)),
	);
}

/** Exact active-section logic extracted verbatim from Header. */
export function isNavItemActive(pathname: string, linkTo: string): boolean {
	const cleanPath = pathname.replace(/\/$/, "") || "/";
	const cleanTo = linkTo.replace(/\/$/, "") || "/";

	if (cleanTo === "/") {
		return cleanPath === "/";
	}
	if (cleanTo === "/courses") {
		return cleanPath === "/courses" || cleanPath.startsWith("/courses/");
	}
	if (cleanTo === "/groups") {
		return cleanPath === "/groups" || cleanPath.startsWith("/groups/");
	}
	if (cleanTo === "/tests") {
		return cleanPath === "/tests" || cleanPath.startsWith("/tests/");
	}
	if (cleanTo === "/how-it-works") {
		return cleanPath === "/how-it-works" || cleanPath.startsWith("/how-it-works/");
	}
	return cleanPath === cleanTo;
}
