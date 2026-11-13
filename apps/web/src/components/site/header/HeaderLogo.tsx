import { Link } from "@tanstack/react-router";
import type { ContactItem } from "@/lib/api/types";

export function HeaderLogo({ contact }: { contact: ContactItem | null }) {
	return (
		<Link
			to="/"
			className="flex items-center shrink-0 group outline-none focus:outline-none border-0"
			aria-label={contact?.companyName || "MG Drive"}
		>
			<img
				src="/images/logo/logo.png"
				alt={contact?.companyName || "MG Drive"}
				className="h-8 sm:h-10 md:h-11 w-auto max-w-[160px] sm:max-w-[180px] object-contain group-hover:scale-105 transition-transform"
			/>
		</Link>
	);
}
