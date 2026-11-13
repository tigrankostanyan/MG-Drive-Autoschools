import { Button } from "@/components/ui/button";
import type { GroupRunner } from "@/features/groups";
import { toPercent } from "@/lib/utils";
import { PageSizeDropdown } from "./PageSizeDropdown";

export function GroupProgressToolbar({ runner }: { runner: GroupRunner }) {
	const {
		reviewMode,
		totalCorrect,
		examTotal,
		answered,
		showAll,
		perPage,
		pageSizes,
		toggleShowAll,
		handlePerPage,
	} = runner;

	const progressPercent = toPercent(reviewMode ? totalCorrect : answered, examTotal);

	return (
		<div className="w-full bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-xs sm:shadow-sm p-5 sm:p-6 lg:px-8 lg:py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
			{/* Left: Progress label + Progress bar */}
			<div className="flex-1 max-w-md w-full space-y-2">
				<div className="flex items-center justify-between text-xs font-semibold">
					<span className="text-slate-500 dark:text-slate-400 uppercase tracking-wider font-bold text-[11px]">
						{reviewMode ? "Քննության արդյունք" : "Առաջընթաց"}
					</span>
					<span className="text-slate-900 dark:text-slate-100 font-bold">
						{reviewMode
							? `${totalCorrect} / ${examTotal} (${progressPercent}%)`
							: `${answered} / ${examTotal} (${progressPercent}%)`}
					</span>
				</div>
				<div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
					<div
						className={`h-full transition-all duration-500 ease-out rounded-full ${
							reviewMode ? "bg-emerald-500" : "bg-primary"
						}`}
						style={{ width: `${progressPercent}%` }}
					/>
				</div>
				{reviewMode && (
					<div className="text-xs font-medium text-slate-500 pt-0.5">
						<span className="text-emerald-600 font-bold">{totalCorrect} ճիշտ</span>,{" "}
						<span className="text-rose-600 font-bold">{answered - totalCorrect} սխալ</span>
						{answered < examTotal && <span>, {examTotal - answered} բաց թողնված</span>}
					</div>
				)}
			</div>

			{/* Right: Controls (Page size selector & Show All toggle) */}
			<div className="flex items-center gap-3 shrink-0">
				{!reviewMode && (
					<>
						<Button
							variant={showAll ? "primary" : "outline"}
							size="sm"
							onClick={toggleShowAll}
							className={`h-9 px-3.5 rounded-xl text-xs font-semibold shadow-xs ${
								showAll
									? "bg-primary text-white"
									: "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200"
							}`}
						>
							{showAll ? "Էջավորել" : "Ցույց տալ բոլորը"}
						</Button>

						{!showAll && (
							<PageSizeDropdown value={perPage} options={pageSizes} onChange={handlePerPage} />
						)}
					</>
				)}
			</div>
		</div>
	);
}
