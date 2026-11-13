import { Award, Camera, ShieldCheck, Sparkles } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/lib/format";

interface ProfileSidebarHeaderProps {
	avatar: string | undefined;
	displayName: string;
	isAdmin: boolean;
	avgScore: number;
}

export function ProfileSidebarHeader({
	avatar,
	displayName,
	isAdmin,
	avgScore,
}: ProfileSidebarHeaderProps) {
	return (
		<div className="p-6 sm:p-7 flex flex-col items-center text-center relative">
			{/* Avatar Container with Gradient Glow Ring */}
			<div className="relative mt-2">
				<div className="p-1 rounded-full bg-gradient-to-tr from-primary via-blue-600 to-primary shadow-lg shadow-primary/25">
					<Avatar className="size-24 sm:size-28 border-4 border-white dark:border-slate-900 bg-white dark:bg-slate-900">
						<AvatarImage src={avatar} />
						<AvatarFallback className="bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 text-3xl font-black text-slate-700 dark:text-slate-200">
							{getInitials(displayName)}
						</AvatarFallback>
					</Avatar>
				</div>

				{/* Camera Upload Button */}
				<button
					type="button"
					title="Փոխել նկարը"
					className="absolute bottom-1 right-1 grid size-9 place-items-center rounded-full border-2 border-white dark:border-slate-900 bg-primary text-white shadow-md hover:bg-primary-hover hover:scale-110 active:scale-95 transition-all cursor-pointer"
				>
					<Camera className="size-4" />
				</button>

				{/* Online Pulse Indicator */}
				<div className="absolute top-2 right-2 flex size-3.5">
					<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
					<span className="relative inline-flex rounded-full size-3.5 bg-emerald-500 border-2 border-white dark:border-slate-900" />
				</div>
			</div>

			{/* User Name & Badges */}
			<h2 className="mt-4 text-xl font-black text-slate-950 dark:text-white tracking-tight flex items-center justify-center gap-1.5">
				<span>{displayName}</span>
				<Sparkles className="size-4 text-primary shrink-0" />
			</h2>

			<div className="mt-2 flex flex-wrap items-center justify-center gap-2">
				{isAdmin ? (
					<span className="inline-flex items-center gap-1.5 rounded-full border border-primary/25 bg-primary/[0.06] px-3.5 py-1 text-xs font-black text-primary shadow-xs">
						<ShieldCheck className="size-3.5 text-primary" />
						Գլխավոր Ադմինիստրատոր
					</span>
				) : (
					<span className="inline-flex items-center gap-1.5 rounded-full border border-primary/25 bg-primary/[0.06] px-3.5 py-1 text-xs font-extrabold text-primary shadow-xs">
						<Award className="size-3.5 text-primary" />
						MG Drive PRO Ուսանող
					</span>
				)}
			</div>

			{/* Learning Level & Readiness Bar */}
			<div className="w-full mt-6 rounded-2xl bg-slate-50 dark:bg-slate-800/60 p-3.5 border border-slate-200/80 dark:border-slate-700/60 text-left">
				<div className="flex items-center justify-between text-xs font-bold mb-1.5">
					<span className="text-slate-600 dark:text-slate-400 flex items-center gap-1">
						<Award className="size-3.5 text-amber-500" />
						Առաջընթաց
					</span>
					<span className="text-primary font-black">{avgScore}%</span>
				</div>
				<div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
					<div
						className="h-full rounded-full bg-primary transition-all duration-700 shadow-sm"
						style={{ width: `${avgScore}%` }}
					/>
				</div>
				<p className="mt-2 text-[11px] text-slate-500 dark:text-slate-400 font-medium leading-tight">
					🎯 Միջին արդյունքը՝ {avgScore}%
				</p>
			</div>
		</div>
	);
}
