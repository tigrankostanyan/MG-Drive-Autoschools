import { Link } from "@tanstack/react-router";
import { LayoutDashboard, LogIn, LogOut, Phone, UserRound, X } from "lucide-react";
import { useAuthModal } from "@/components/auth/auth-modal-context";
import { MobileNavItem } from "@/components/site/NavLink";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import type { ContactItem } from "@/lib/api/types";
import { getInitials } from "@/lib/format";
import { getVisibleNavItems, isNavItemActive } from "@/lib/nav-config";
import type { HeaderUser } from "./user-helpers";

export function MobileMenu({
	open,
	onClose,
	contact,
	user,
	onLogout,
	pathname,
}: {
	open: boolean;
	onClose: () => void;
	contact: ContactItem | null;
	user: HeaderUser | null;
	onLogout: () => void;
	pathname: string;
}) {
	const { openAuthModal } = useAuthModal();
	const isStaff = user?.role === "admin" || user?.role === "teacher";

	return (
		<div
			className={`fixed top-0 right-0 z-[202] flex h-dvh w-[85%] max-w-sm flex-col bg-white shadow-2xl transition-transform duration-300 xl:hidden ${
				open ? "translate-x-0" : "translate-x-full"
			}`}
			aria-hidden={!open}
		>
			<div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
				<span className="text-sm font-bold uppercase tracking-wider text-slate-800">Մենյու</span>
				<button
					type="button"
					onClick={onClose}
					aria-label="Փակել մենյուն"
					className="cursor-pointer rounded-lg p-2 text-slate-600 transition-colors hover:bg-slate-100"
				>
					<X className="size-5" />
				</button>
			</div>

			{user && (
				<div className="flex items-center gap-3 border-b border-slate-100 px-5 py-4">
					<Avatar className="size-10 shrink-0 border border-slate-200">
						{user.avatar && (
							<AvatarImage
								src={user.avatar}
								alt={user.name}
								referrerPolicy="no-referrer"
								className="object-cover"
							/>
						)}
						<AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
							{getInitials(user.name)}
						</AvatarFallback>
					</Avatar>
					<div className="min-w-0">
						<p className="truncate text-sm font-bold text-slate-900">{user.name}</p>
						<p className="truncate text-xs text-slate-400">{user.email}</p>
					</div>
				</div>
			)}

			<nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-3 py-4">
				{getVisibleNavItems(user?.role).map((item) => (
					<MobileNavItem
						key={item.to}
						to={item.to}
						label={item.label}
						isActive={isNavItemActive(pathname, item.to)}
						onClick={onClose}
					/>
				))}
			</nav>

			<div className="space-y-3 border-t border-slate-100 px-5 py-4">
				{contact?.phone && (
					<a
						href={`tel:${contact.phone}`}
						className="flex items-center justify-center gap-2 text-sm font-semibold text-slate-700 pb-1"
					>
						<Phone className="size-4 text-primary" />
						{contact.phone}
					</a>
				)}

				{user ? (
					<>
						<Button asChild variant="outline" className="h-11 w-full">
							<Link to="/profile" onClick={onClose}>
								<UserRound className="size-4" />
								Իմ պրոֆիլը
							</Link>
						</Button>
						{isStaff && (
							<Button asChild variant="outline" className="h-11 w-full">
								<Link to="/admin" onClick={onClose}>
									<LayoutDashboard className="size-4" />
									Վահանակ
								</Link>
							</Button>
						)}
						<Button
							variant="danger"
							className="h-11 w-full"
							onClick={() => {
								onClose();
								onLogout();
							}}
						>
							<LogOut className="size-4" />
							Ելք
						</Button>
					</>
				) : (
					<Button
						type="button"
						className="h-11 w-full"
						onClick={() => {
							onClose();
							openAuthModal();
						}}
					>
						<LogIn className="size-4" />
						Մուտք
					</Button>
				)}
			</div>
		</div>
	);
}
