import { Award, CheckCircle2, Target, XCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { IconBox } from "@/components/ui/icon-box";
import type { ProfileStats } from "@/lib/api/profile";

function StatCard({
	icon,
	label,
	value,
	variant = "primary",
}: {
	icon: React.ReactNode;
	label: string;
	value: string;
	variant?: "primary" | "success" | "danger" | "secondary";
}) {
	return (
		<Card variant="interactive" padding="sm" className="flex items-center gap-4">
			<IconBox variant={variant} size="lg" shape="rounded" className="shadow-xs shrink-0">
				{icon}
			</IconBox>
			<div>
				<p className="text-2xl font-black text-slate-900 tracking-tight">{value}</p>
				<p className="text-xs font-bold text-slate-500 mt-0.5">{label}</p>
			</div>
		</Card>
	);
}

export function TestsTabStatsGrid({ stats }: { stats: ProfileStats | undefined }) {
	return (
		<div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
			<StatCard
				icon={<Award className="size-6 text-blue-600" />}
				label="Ընդհանուր թեստեր"
				value={String(stats?.totalTests ?? 0)}
				variant="primary"
			/>
			<StatCard
				icon={<CheckCircle2 className="size-6 text-emerald-600" />}
				label="Հաջող հանձնված"
				value={String(stats?.passedTests ?? 0)}
				variant="success"
			/>
			<StatCard
				icon={<XCircle className="size-6 text-rose-600" />}
				label="Չհանձնված"
				value={String(stats?.failedTests ?? 0)}
				variant="danger"
			/>
			<StatCard
				icon={<Target className="size-6 text-indigo-600" />}
				label="Միջին գնահատական"
				value={`${stats?.avgScore ?? 0}%`}
				variant="secondary"
			/>
		</div>
	);
}
