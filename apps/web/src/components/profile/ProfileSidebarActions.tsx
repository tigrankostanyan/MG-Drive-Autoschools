import { Link } from "@tanstack/react-router";
import { ExternalLink, LogOut, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProfileSidebarActionsProps {
	isAdmin: boolean;
	isLoggingOut: boolean;
	onLogout: () => void;
}

export function ProfileSidebarActions({
	isAdmin,
	isLoggingOut,
	onLogout,
}: ProfileSidebarActionsProps) {
	return (
		<div className="p-5 sm:p-6 space-y-3 bg-white border-t border-slate-100">
			{/* Admin Panel button if admin */}
			{isAdmin && (
				<Button
					asChild
					className="w-full h-11 text-xs font-bold uppercase tracking-wider gap-2 shadow-md shadow-primary/25"
				>
					<Link to="/admin">
						<ShieldCheck className="size-4" />
						<span>Ադմին Պանել</span>
					</Link>
				</Button>
			)}

			{/* Public Profile link button if student */}
			{!isAdmin && (
				<Button asChild variant="outline" className="w-full gap-2">
					<Link to="/profile">
						<span>Դիտել հանրային պրոֆիլը</span>
						<ExternalLink className="size-3.5" />
					</Link>
				</Button>
			)}

			{/* Logout Button */}
			<Button
				type="button"
				variant="ghost"
				onClick={onLogout}
				disabled={isLoggingOut}
				className="w-full gap-2 text-rose-600 hover:bg-rose-50 hover:text-rose-700 dark:hover:bg-rose-950/30"
			>
				<LogOut className="size-4 text-rose-600" />
				<span>{isLoggingOut ? "Դուրս է գալիս..." : "Դուրս գալ հաշվից"}</span>
			</Button>
		</div>
	);
}
