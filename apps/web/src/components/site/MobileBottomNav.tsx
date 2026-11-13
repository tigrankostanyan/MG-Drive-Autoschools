import { Link, useRouterState } from "@tanstack/react-router";
import { FileText, Home, Info, User, Users } from "lucide-react";
import { useAuthModal } from "@/components/auth/auth-modal-context";
import { useSession } from "@/hooks/use-session";
import { getVisibleNavItems } from "@/lib/nav-config";

const COLUMN_WIDTH_PERCENT = 20;

const MOBILE_NAV_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
	"/": Home,
	"/groups": Users,
	"/tests": FileText,
	"/how-it-works": Info,
	"/profile": User,
};

type NavLinkItem = {
	to: string;
	label: string;
	icon: React.ComponentType<{ className?: string }>;
};

type NavActionItem = {
	label: string;
	icon: React.ComponentType<{ className?: string }>;
	onClick: () => void;
};

type MobileNavItem = NavLinkItem | NavActionItem;

export function MobileBottomNav({
	initialUser = null,
}: {
	initialUser?: { name: string; role?: string } | null;
}) {
	const { user: sessionUser, ready } = useSession();
	const { openAuthModal } = useAuthModal();
	const user = ready ? sessionUser : initialUser;
	const location = useRouterState({ select: (s) => s.location.pathname });
	const visibleNavItems = getVisibleNavItems(user?.role);
	const navItems: MobileNavItem[] = visibleNavItems.map((item) => ({
		to: item.to,
		label: item.label,
		icon: MOBILE_NAV_ICONS[item.to] ?? Home,
	}));
	if (user) {
		navItems.push({ to: "/profile", label: "Պրոֆիլ", icon: User });
	} else {
		navItems.push({ label: "Մուտք", icon: User, onClick: openAuthModal });
	}
	const activeIndex = navItems.findIndex((item) =>
		"to" in item ? (item.to === "/" ? location === "/" : location.startsWith(item.to)) : false,
	);
	return (
		<div className="fixed bottom-0 left-0 z-50 w-full border-t border-slate-200/80 dark:border-slate-800 bg-white/95 dark:bg-slate-950/95 backdrop-blur-2xl hidden max-[576px]:block pb-safe shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
			<div className="px-2">
				<div className="relative grid h-[68px] grid-cols-5">
					{activeIndex !== -1 && (
						<div
							className="absolute top-2 flex size-10 items-center justify-center transition-all duration-300 cubic-bezier(0.4, 0, 0.2, 1) pointer-events-none"
							style={{
								left: `calc(${activeIndex * COLUMN_WIDTH_PERCENT}% + 10%)`,
								transform: "translateX(-50%)",
							}}
						>
							<div className="size-10 rounded-full bg-primary shadow-md shadow-primary/30" />
						</div>
					)}
					{navItems.map((item) => {
						if ("onClick" in item) {
							return (
								<button
									key={item.label}
									type="button"
									onClick={item.onClick}
									className="relative z-10 flex w-full flex-col items-center pt-2 pb-1 text-slate-500 hover:text-slate-900 cursor-pointer outline-none"
								>
									<div className="flex size-10 items-center justify-center">
										<item.icon className="size-5" />
									</div>
									<span className="text-[10px] leading-tight mt-0.5 font-medium">{item.label}</span>
								</button>
							);
						}
						const isActive = item.to === "/" ? location === "/" : location.startsWith(item.to);
						return (
							<Link
								key={item.to}
								to={item.to}
								className={`relative z-10 flex w-full flex-col items-center pt-2 pb-1 transition-all duration-300 ${
									isActive ? "text-primary" : "text-slate-500 hover:text-slate-900"
								}`}
							>
								<div
									className={`flex size-10 items-center justify-center transition-all duration-300 ${
										isActive ? "text-white scale-105" : ""
									}`}
								>
									<item.icon className="size-5" />
								</div>
								<span
									className={`text-[10px] transition-all duration-300 leading-tight mt-0.5 ${
										isActive ? "text-primary font-bold" : "font-medium"
									}`}
								>
									{item.label}
								</span>
							</Link>
						);
					})}
				</div>
			</div>
		</div>
	);
}
