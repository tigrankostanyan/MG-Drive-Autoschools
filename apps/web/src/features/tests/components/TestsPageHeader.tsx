import { Award, CheckCircle2, Clock, ShieldCheck } from "lucide-react";
import { PageHeader } from "@/components/learning";

export function TestsPageHeader() {
	return (
		<div className="w-full space-y-3.5">
			<PageHeader
				badge="Թեստեր"
				title="Քննական թեստեր"
				description="Հանձնեք ՃՈ քննությունը 1-ին իսկ փորձից՝ առանց լարվելու։ Նմանակեք քննությունը և պատրաստվեք վստահ։"
			/>

			<div className="flex flex-wrap items-center gap-2 pt-0.5">
				<div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
					<ShieldCheck className="size-3.5" />
					<span>50 Պաշտոնական թեստ</span>
				</div>
				<div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
					<CheckCircle2 className="size-3.5" />
					<span>Սխալների խելացի վերլուծություն</span>
				</div>
				<div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
					<Clock className="size-3.5" />
					<span>Իրական 20 րոպե ժամանակաչափ</span>
				</div>
				<div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
					<Award className="size-3.5" />
					<span>100% Իրական ձևաչափ</span>
				</div>
			</div>
		</div>
	);
}
