import { Save, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AccountSettingsFooterProps {
	isSaving: boolean;
	onSave: () => void;
}

export function AccountSettingsFooter({ isSaving, onSave }: AccountSettingsFooterProps) {
	return (
		<div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
			<div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
				<ShieldCheck className="size-4 text-emerald-600 shrink-0" />
				<span>Ձեր անձնական տվյալները պաշտպանված են 256-bit SSL ծածկագրմամբ։</span>
			</div>

			<Button
				variant="primary"
				size="lg"
				onClick={onSave}
				isLoading={isSaving}
				className="w-full sm:w-auto min-w-[200px]"
			>
				<Save className="size-4" />
				<span>Պահպանել փոփոխությունները</span>
			</Button>
		</div>
	);
}
