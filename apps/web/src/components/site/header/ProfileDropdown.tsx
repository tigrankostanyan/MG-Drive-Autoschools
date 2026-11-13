import { Link } from "@tanstack/react-router";
import { ChevronDown, LayoutDashboard, LogOut, UserRound } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatShortName, getInitials } from "@/lib/format";
import type { HeaderUser } from "./user-helpers";

export function ProfileDropdown({ user, onLogout }: { user: HeaderUser; onLogout: () => void }) {
	const [open, setOpen] = useState(false);
	const ref = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		const onPointerDown = (e: MouseEvent) => {
			if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
		};
		document.addEventListener("mousedown", onPointerDown);
		return () => document.removeEventListener("mousedown", onPointerDown);
	}, []);

	const isStaff = user.role === "admin" || user.role === "teacher";

	return (
		<div className="relative" ref={ref}>
			<button
				type="button"
				onClick={() => setOpen((o) => !o)}
				aria-haspopup="menu"
				aria-expanded={open}
				className="flex items-center gap-2 p-1 pr-2 rounded-full hover:bg-slate-100 transition-colors outline-none focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 border-0 cursor-pointer"
			>
				<Avatar className="size-8 border border-slate-200 pointer-events-none">
					{user.avatar && (
						<AvatarImage
							src={user.avatar}
							alt={user.name}
							referrerPolicy="no-referrer"
							className="object-cover"
						/>
					)}
					<AvatarFallback className="bg-primary/10 text-primary text-[11px] font-bold">
						{getInitials(user.name)}
					</AvatarFallback>
				</Avatar>
				<span className="hidden xl:block max-w-[140px] truncate text-[13px] font-semibold text-slate-700">
					{formatShortName(user.name)}
				</span>
				<ChevronDown
					className={`size-4 text-slate-500 transition-transform ${open ? "rotate-180" : ""}`}
				/>
			</button>

			{open && (
				<div
					role="menu"
					className="absolute right-0 mt-2 z-[210] w-56 rounded-2xl border border-slate-100 bg-white py-2 shadow-lg"
				>
					<div className="mb-1 border-b border-slate-100 px-4 py-2 flex items-center gap-3">
						<Avatar className="size-9 border border-slate-200 shrink-0">
							{user.avatar && (
								<AvatarImage
									src={user.avatar}
									alt={user.name}
									referrerPolicy="no-referrer"
									className="object-cover"
								/>
							)}
							<AvatarFallback className="bg-primary/10 text-primary text-[11px] font-bold">
								{getInitials(user.name)}
							</AvatarFallback>
						</Avatar>
						<div className="min-w-0 flex-1">
							<p className="truncate text-sm font-bold text-slate-900">{user.name}</p>
							<p className="truncate text-xs text-slate-400">{user.email}</p>
						</div>
					</div>

					<Link
						to="/profile"
						onClick={() => setOpen(false)}
						className="flex items-center gap-3 px-4 py-2 text-sm text-slate-700 transition-colors hover:bg-slate-50 hover:text-primary"
					>
						<UserRound className="size-4" />
						Իմ պրոֆիլը
					</Link>

					{isStaff && (
						<Link
							to="/admin"
							onClick={() => setOpen(false)}
							className="flex items-center gap-3 px-4 py-2 text-sm text-slate-700 transition-colors hover:bg-slate-50 hover:text-primary"
						>
							<LayoutDashboard className="size-4" />
							Կառավարման վահանակ
						</Link>
					)}

					<div className="mt-1 border-t border-slate-100 pt-1">
						<button
							type="button"
							onClick={() => {
								setOpen(false);
								onLogout();
							}}
							className="flex w-full cursor-pointer items-center gap-3 px-4 py-2 text-sm text-red-600 transition-colors hover:bg-red-50"
						>
							<LogOut className="size-4" />
							Ելք
						</button>
					</div>
				</div>
			)}
		</div>
	);
}
