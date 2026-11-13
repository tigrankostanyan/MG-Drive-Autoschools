import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react";
import type { ContactItem } from "@/lib/api/types";
import { safeHref } from "@/lib/safe-url";

export function ContactSocial({ contact }: { contact: ContactItem | null }) {
	// Admin-editable links: reject non-http(s) protocols before rendering.
	const facebook = safeHref(contact?.facebook);
	const instagram = safeHref(contact?.instagram);
	return (
		<div className="mt-8 sm:mt-12 pt-4 sm:pt-6 border-t border-white/20 relative z-10">
			<p className="text-xs sm:text-sm font-semibold text-white mb-3 sm:mb-4">Կապվեք մեզ հետ</p>
			<div className="flex items-center gap-4">
				{facebook && (
					<a
						href={facebook}
						target="_blank"
						rel="noopener noreferrer"
						aria-label="Facebook"
						className="text-white hover:text-blue-400 transition-colors"
					>
						<Facebook className="size-4.5 sm:size-5" />
					</a>
				)}
				{instagram && (
					<a
						href={instagram}
						target="_blank"
						rel="noopener noreferrer"
						aria-label="Instagram"
						className="text-white hover:text-pink-400 transition-colors"
					>
						<Instagram className="size-4.5 sm:size-5" />
					</a>
				)}
				{!facebook && !instagram && (
					<>
						<button
							type="button"
							aria-label="Facebook"
							className="text-white hover:text-blue-400 transition-colors"
						>
							<Facebook className="size-4.5 sm:size-5" />
						</button>
						<button
							type="button"
							aria-label="Instagram"
							className="text-white hover:text-pink-400 transition-colors"
						>
							<Instagram className="size-4.5 sm:size-5" />
						</button>
					</>
				)}
				<button
					type="button"
					aria-label="Twitter"
					className="text-white hover:text-blue-300 transition-colors"
				>
					<Twitter className="size-4.5 sm:size-5" />
				</button>
				<button
					type="button"
					aria-label="LinkedIn"
					className="text-white hover:text-blue-500 transition-colors"
				>
					<Linkedin className="size-4.5 sm:size-5" />
				</button>
			</div>
		</div>
	);
}
