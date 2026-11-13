import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

export interface NavLinkProps {
	to: string;
	label: string;
	isActive: boolean;
	className?: string;
	onClick?: () => void;
}

export function NavLink({ to, label, isActive, className, onClick }: NavLinkProps) {
	return (
		<Link
			to={to}
			onClick={onClick}
			className={cn(
				"relative py-3.5 text-[13px] font-bold uppercase tracking-wider transition-colors group outline-none focus:outline-none focus-visible:outline-none focus:ring-0 focus-visible:ring-0 border-0 select-none",
				isActive ? "text-primary" : "text-slate-700 hover:text-primary",
				className,
			)}
		>
			<span>{label}</span>
			{/* Active line indicator - EXACTLY ONE per route */}
			{isActive && (
				<span className="absolute bottom-0 left-0 w-full h-[2.5px] rounded-full bg-primary" />
			)}
			{/* Hover indicator for non-active items */}
			{!isActive && (
				<span className="absolute bottom-0 left-0 w-full h-[2.5px] rounded-full bg-primary scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300 ease-out" />
			)}
		</Link>
	);
}

export function MobileNavItem({ to, label, isActive, className, onClick }: NavLinkProps) {
	return (
		<Link
			to={to}
			onClick={onClick}
			className={cn(
				"px-4 py-3.5 text-[14px] font-bold uppercase tracking-wider rounded-lg transition-colors outline-none focus:outline-none focus-visible:outline-none focus:ring-0 focus-visible:ring-0 border-0 select-none",
				isActive ? "bg-primary/10 text-primary font-black" : "text-slate-700 hover:bg-slate-50",
				className,
			)}
		>
			{label}
		</Link>
	);
}
