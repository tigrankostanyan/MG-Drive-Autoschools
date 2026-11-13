import { useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useContactInfo } from "@/hooks/use-contact-info";
import { useSession } from "@/hooks/use-session";
import { logout } from "@/lib/api/auth";
import type { AuthUser } from "@/lib/auth-guard";
import { normalizeUser } from "@/lib/auth-guard";
import { getVisibleNavItems, isNavItemActive } from "@/lib/nav-config";
import { logger } from "@/lib/observability/logger";
import { HeaderActions } from "./header/HeaderActions";
import { HeaderLogo } from "./header/HeaderLogo";
import { MobileMenu } from "./header/MobileMenu";
import { toHeaderUser } from "./header/user-helpers";
import { NavLink } from "./NavLink";

export function Header({
	initialUser = null,
	initialSessionStatus = "none",
}: {
	initialUser?: AuthUser | null;
	initialSessionStatus?: "ok" | "expired" | "none";
}) {
	const [open, setOpen] = useState(false);
	const [scrolled, setScrolled] = useState(false);
	const contact = useContactInfo();

	const { pathname } = useRouterState({ select: (s) => s.location });

	const [initial] = useState(() => toHeaderUser(initialUser));
	const { user: sessionUser, ready } = useSession();
	const user = ready ? toHeaderUser(normalizeUser(sessionUser)) : initial;
	const [sessionPending, setSessionPending] = useState(initialSessionStatus === "expired");

	const isLoggedIn = Boolean(user);

	const handleLogout = async () => {
		setOpen(false);
		setSessionPending(false);
		try {
			await logout();
		} catch (err) {
			logger.error("header.logout_failed", "Logout failed", { error: err });
		}
	};

	useEffect(() => {
		if (ready) setSessionPending(false);
	}, [ready]);

	useEffect(() => {
		const onScroll = () => setScrolled(window.scrollY > 10);
		window.addEventListener("scroll", onScroll, { passive: true });
		return () => window.removeEventListener("scroll", onScroll);
	}, []);

	const closeMobileMenu = () => setOpen(false);

	return (
		<header
			className={`fixed top-0 left-0 w-full flex flex-col bg-white ${open ? "z-[200]" : "z-50"}`}
		>
			{/* Main Clean Header */}
			<div
				className={`w-full bg-white/95 backdrop-blur-md transition-all duration-300 border-b border-slate-100 ${
					scrolled ? "py-2 shadow-[0_4px_20px_-4px_rgba(15,23,42,0.06)]" : "py-2.5 sm:py-3"
				}`}
			>
				<div className="w-full max-w-[1600px] mx-auto px-3 min-[361px]:px-4 sm:px-6 lg:px-8 flex items-center justify-between">
					{/* Logo Section */}
					<HeaderLogo contact={contact} />

					{/* Desktop Navigation */}
					<nav className="hidden xl:flex items-center gap-8 h-full">
						{getVisibleNavItems(user?.role).map((link) => (
							<NavLink
								key={link.to}
								to={link.to}
								label={link.label}
								isActive={isNavItemActive(pathname, link.to)}
							/>
						))}
					</nav>

					{/* Actions */}
					<HeaderActions
						contact={contact}
						isLoggedIn={isLoggedIn}
						user={user}
						sessionPending={sessionPending}
						onLogout={handleLogout}
						onMenuOpen={() => setOpen(true)}
					/>
				</div>
			</div>

			{/* Mobile Menu Overlay */}
			<button
				type="button"
				aria-label="Փակել ընտրացանկը"
				className={`fixed inset-0 z-[201] bg-slate-900/80 backdrop-blur-sm transition-opacity duration-300 xl:hidden ${
					open ? "opacity-100" : "opacity-0 pointer-events-none"
				}`}
				onClick={closeMobileMenu}
			/>

			{/* Mobile Menu Panel */}
			<MobileMenu
				open={open}
				onClose={closeMobileMenu}
				contact={contact}
				user={user}
				onLogout={handleLogout}
				pathname={pathname}
			/>
		</header>
	);
}
