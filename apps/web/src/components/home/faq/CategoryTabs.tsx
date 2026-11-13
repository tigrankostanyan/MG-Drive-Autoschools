import { ArrowRight, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { IconBox } from "@/components/ui/icon-box";
import { CATEGORIES } from "./data";

export function CategoryTabs({
	activeCategory,
	onSelect,
}: {
	activeCategory: string;
	onSelect: (id: string) => void;
}) {
	return (
		<div className="space-y-5">
			<div className="flex items-center justify-between px-1">
				<h3 className="font-bold text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">
					Ըստ բաժինների
				</h3>
			</div>

			<div className="space-y-2.5">
				{CATEGORIES.map((cat) => {
					const isActive = activeCategory === cat.id;
					const Icon = cat.icon;
					return (
						<button
							type="button"
							key={cat.id}
							onClick={() => onSelect(cat.id)}
							className={`w-full flex items-center justify-between p-3.5 sm:p-4 rounded-2xl border transition-all duration-200 text-left ${
								isActive
									? "border-primary/40 bg-primary/10 shadow-sm text-primary"
									: "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:border-primary/30 hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-700 dark:text-slate-200"
							}`}
						>
							<div className="flex items-center gap-3.5">
								<div
									className={`grid size-10 rounded-xl place-items-center transition-all ${
										isActive
											? "bg-primary text-white shadow-md shadow-primary/30"
											: "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
									}`}
								>
									<Icon className="size-4.5" />
								</div>
								<div>
									<p
										className={`text-sm font-bold transition-colors ${
											isActive
												? "text-slate-950 dark:text-white"
												: "text-slate-800 dark:text-slate-200"
										}`}
									>
										{cat.title}
									</p>
									<p
										className={`text-xs ${isActive ? "text-primary font-semibold" : "text-slate-500 dark:text-slate-400"}`}
									>
										{cat.count} հարց
									</p>
								</div>
							</div>
							<ArrowRight
								className={`size-4 transition-transform ${
									isActive ? "text-primary translate-x-1" : "text-slate-400"
								}`}
							/>
						</button>
					);
				})}
			</div>

			{/* High-Contrast, Legible Contact Card */}
			<div className="rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-blue-950 p-6 text-white shadow-xl shadow-slate-950/15 relative overflow-hidden border border-slate-800">
				<div className="pointer-events-none absolute -right-6 -top-6 size-28 rounded-full bg-primary/25 blur-2xl" />
				<div className="relative z-10">
					<IconBox variant="glass" size="md" className="text-blue-400 mb-3.5">
						<HelpCircle className="size-5" />
					</IconBox>
					<h4 className="text-lg font-black text-white mb-1.5 tracking-tight">Դեռ ունե՞ք հարցեր</h4>
					<p className="text-slate-300 text-xs sm:text-[13px] leading-relaxed mb-5 font-normal">
						Չգտա՞ք ձեզ հուզող հարցի պատասխանը։ Մեր թիմը սիրով կօգնի ձեզ ցանկացած հարցում։
					</p>
					<Button
						onClick={() => {
							const contactEl = document.getElementById("contact");
							if (contactEl) {
								contactEl.scrollIntoView({ behavior: "smooth" });
							} else {
								window.scrollTo({
									top: document.body.scrollHeight,
									behavior: "smooth",
								});
							}
						}}
						className="w-full gap-2"
					>
						<span>Կապվեք մեզ հետ</span>
						<ArrowRight className="size-3.5" />
					</Button>
				</div>
			</div>
		</div>
	);
}
