import { ArrowRight, Menu, Phone } from "lucide-react";
import { useAuthModal } from "@/components/auth/auth-modal-context";
import { Button } from "@/components/ui/button";
import { IconBox } from "@/components/ui/icon-box";
import type { ContactItem } from "@/lib/api/types";
import { ProfileDropdown } from "./ProfileDropdown";
import type { HeaderUser } from "./user-helpers";

export function HeaderActions({
	contact,
	isLoggedIn,
	user,
	sessionPending,
	onLogout,
	onMenuOpen,
}: {
	contact: ContactItem | null;
	isLoggedIn: boolean;
	user: HeaderUser | null;
	sessionPending: boolean;
	onLogout: () => void;
	onMenuOpen: () => void;
}) {
	const { openAuthModal } = useAuthModal();
	return (
		<div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
			{/* Clickable Phone Number — only render if phone data is available */}
			{contact?.phone && (
				<a
					href={`tel:${contact.phone.replace(/\s+/g, "")}`}
					className="hidden md:flex items-center gap-2.5 text-slate-800 hover:text-primary font-bold text-[13px] tracking-wide transition-colors duration-200 py-1.5 px-3.5 rounded-full bg-slate-50 hover:bg-slate-100 group outline-none focus:outline-none border-0 select-none"
					title={"Զանգահարել մեզ"}
				>
					<IconBox
						variant="primary"
						size="sm"
						shape="circle"
						className="group-hover:bg-primary group-hover:text-white transition-colors duration-200 pointer-events-none"
					>
						<Phone className="size-3.5 pointer-events-none" />
					</IconBox>
					<span className="tabular-nums font-semibold pointer-events-none">{contact.phone}</span>
				</a>
			)}

			{isLoggedIn && user ? (
				<ProfileDropdown user={user} onLogout={onLogout} />
			) : sessionPending ? (
				<div
					className="hidden lg:flex items-center gap-2.5 py-1 px-2 rounded-full pointer-events-none"
					aria-hidden="true"
				>
					<div className="text-right hidden xl:block">
						<div className="h-3 w-16 bg-slate-200/80 rounded animate-pulse" />
						<div className="h-2 w-10 bg-slate-100 rounded animate-pulse mt-1 ml-auto" />
					</div>
					<div className="size-9.5 rounded-full bg-slate-200/80 animate-pulse" />
				</div>
			) : (
				<Button
					type="button"
					onClick={openAuthModal}
					className="hidden sm:inline-flex h-10.5 px-6 text-[12px] group"
				>
					<div className="flex items-center gap-2">
						<span>Մուտք</span>
						<div className="size-5.5 rounded-full bg-white/20 flex items-center justify-center transition-transform duration-300 group-hover:translate-x-0.5">
							<ArrowRight className="size-3" />
						</div>
					</div>
				</Button>
			)}

			<button
				type="button"
				className="xl:hidden -mr-1.5 min-[361px]:-mr-2 p-1.5 min-[361px]:p-2 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors outline-none focus:outline-none border-0 flex items-center justify-center cursor-pointer"
				onClick={onMenuOpen}
				aria-label="Toggle menu"
			>
				<Menu className="size-6" />
			</button>
		</div>
	);
}
