import { AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";

type AuthKickDetail = { reason?: string };

export function AuthKickModal() {
	const [isOpen, setIsOpen] = useState(false);
	const [reason, setReason] = useState<string | null>(null);

	useEffect(() => {
		const handleAuthKick = (e: Event) => {
			if (!(e instanceof CustomEvent)) return;
			const detail = e.detail as AuthKickDetail | undefined;
			setReason(detail?.reason || "kicked_out");
			setIsOpen(true);
		};

		window.addEventListener("auth-kick", handleAuthKick);
		return () => window.removeEventListener("auth-kick", handleAuthKick);
	}, []);

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle className="flex items-center gap-2 text-destructive">
						<AlertCircle className="h-5 w-5" />
						Անվտանգության ահազանգ
					</DialogTitle>
					<DialogDescription className="pt-2 text-base font-medium">
						{reason === "kicked_out"
							? "Ձեր հաշիվը մուտք է գործվել այլ սարքից։ Դուք դուրս եք հանվել համակարգից անվտանգության նկատառումներով։"
							: "Ադմինիստրատորը դուրս է հանել ձեր հաշիվը համակարգից։"}
					</DialogDescription>
				</DialogHeader>
			</DialogContent>
		</Dialog>
	);
}
