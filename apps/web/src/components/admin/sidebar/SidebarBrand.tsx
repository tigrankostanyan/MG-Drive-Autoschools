import { GraduationCap } from "lucide-react";

export function SidebarBrand() {
	return (
		<div className="flex items-center gap-3 pb-8">
			<div className="flex size-10 items-center justify-center rounded-2xl bg-[image:var(--gradient-accent)] text-white shadow-lg shadow-accent/25">
				<GraduationCap className="size-5.5" />
			</div>
			<div>
				<span className="text-xl font-black tracking-tight text-slate-900 dark:text-white">
					MG Drive
				</span>
				<p className="text-[10px] font-bold uppercase tracking-wider text-accent dark:text-accent">
					Admin Pro
				</p>
			</div>
		</div>
	);
}
