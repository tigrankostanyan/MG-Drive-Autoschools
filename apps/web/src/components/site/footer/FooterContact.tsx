import { Mail, MapPin, Phone } from "lucide-react";
import type { ContactItem } from "@/lib/api/types";

export function FooterContact({ contact }: { contact: ContactItem | null }) {
	return (
		<div>
			<h3 className="text-white text-xs font-bold uppercase tracking-wider mb-5">Կապ մեզ հետ</h3>
			<ul className="flex flex-col gap-4">
				<li className="flex items-start gap-3.5 group">
					<Phone className="mt-0.5 size-4.5 shrink-0 text-primary" />
					{contact?.phone ? (
						<a
							href={`tel:${contact.phone.replace(/\s+/g, "")}`}
							className="text-sm text-slate-300 hover:text-white transition-colors"
							suppressHydrationWarning
						>
							{contact.phone}
						</a>
					) : (
						<span className="text-sm text-slate-300" suppressHydrationWarning>
							Հետագակություն չկա
						</span>
					)}
				</li>
				<li className="flex items-start gap-3.5 group">
					<Mail className="mt-0.5 size-4.5 shrink-0 text-primary" />
					{contact?.email ? (
						<a
							href={`mailto:${contact.email}`}
							className="text-sm text-slate-300 hover:text-white transition-colors"
							suppressHydrationWarning
						>
							{contact.email}
						</a>
					) : (
						<span className="text-sm text-slate-300" suppressHydrationWarning>
							Հետագակություն չկա
						</span>
					)}
				</li>
				<li className="flex items-start gap-3.5">
					<MapPin className="mt-0.5 size-4.5 shrink-0 text-primary" />
					<span className="text-sm text-slate-300" suppressHydrationWarning>
						{contact?.address ? (
							<>
								{contact.address}
								<br />
							</>
						) : null}
					</span>
				</li>
			</ul>
		</div>
	);
}
