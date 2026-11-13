import { CheckCircle2 } from "lucide-react";
import { useAuthModal } from "@/components/auth/auth-modal-context";
import { ABOUT_TAGS } from "./data";

export function AboutTagStrip() {
	const { openAuthModal } = useAuthModal();

	return (
		<div className="mt-16 sm:mt-20 flex flex-col items-center border-t border-slate-200/80 dark:border-slate-800/80 pt-10">
			<div className="flex flex-wrap justify-center gap-2.5 sm:gap-3">
				{ABOUT_TAGS.map((tag) => (
					<div
						key={tag}
						className="flex items-center gap-2 rounded-full border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 px-4 py-2 text-[12.5px] font-bold text-slate-700 dark:text-slate-300 shadow-xs transition-all hover:border-primary/40 hover:text-primary hover:-translate-y-0.5"
					>
						<div className="size-1.5 rounded-full bg-primary" />
						{tag}
					</div>
				))}
			</div>

			<div className="mt-7 flex items-center justify-center gap-3 text-[13.5px] font-medium text-slate-600 dark:text-slate-400">
				<div className="grid size-6 place-items-center rounded-full bg-primary/10 text-primary">
					<CheckCircle2 className="size-4" />
				</div>
				<p>
					Սկսենք ուսուցումը միասին․{" "}
					<button
						type="button"
						onClick={openAuthModal}
						className="text-primary font-black underline underline-offset-4 hover:text-primary/80 transition-colors cursor-pointer"
					>
						Գրանցվել հիմա
					</button>
				</p>
			</div>
		</div>
	);
}
