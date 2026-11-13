import { BookOpen, CheckCircle2, FolderCheck, Zap } from "lucide-react";
import { PageHeader } from "@/components/learning";

export function GroupsPageHeader() {
	return (
		<div className="w-full space-y-3.5">
			<PageHeader
				badge="Խմբեր"
				title="Տեսական խմբեր"
				description="Հատուկ մշակված դասակարգում՝ 2x ավելի արագ և որակյալ ուսուցում։ Անցեք հարցերը ըստ թեմաների և ամրապնդեք գիտելիքները։"
			/>

			<div className="flex flex-wrap items-center gap-2 pt-0.5">
				<div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
					<BookOpen className="size-3.5" />
					<span>Բացառիկ մեթոդաբանություն</span>
				</div>
				<div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
					<CheckCircle2 className="size-3.5" />
					<span>2x Արագացված յուրացում</span>
				</div>
				<div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
					<FolderCheck className="size-3.5" />
					<span>100% Խորքային իմացություն</span>
				</div>
				<div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20">
					<Zap className="size-3.5" />
					<span>Առանց անգիր անելու</span>
				</div>
			</div>
		</div>
	);
}
