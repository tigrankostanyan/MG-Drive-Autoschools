import { Mail, Phone } from "lucide-react";
import type { ContactItem } from "@/lib/api/types";
import { ContactSocial } from "./ContactSocial";
import {
	DEFAULT_EMAIL,
	DEFAULT_EMAIL_HREF,
	DEFAULT_MOBILE_PHONE,
	DEFAULT_MOBILE_PHONE_HREF,
	DEFAULT_PHONE,
	DEFAULT_PHONE_HREF,
	mailHref,
	telHref,
} from "./data";

export function ContactInfoPanel({ contact }: { contact: ContactItem | null }) {
	return (
		<div className="lg:col-span-5 flex">
			<div className="w-full bg-slate-950/95 border border-white/10 rounded-2xl sm:rounded-[2rem] p-5 sm:p-8 lg:p-10 2xl:p-12 flex flex-col justify-between relative overflow-hidden text-white shadow-[0_20px_50px_-10px_rgba(0,0,0,0.45)]">
				{/* Hairline top reflection */}
				<div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
				<div className="relative z-10">
					<h3 className="text-xl sm:text-2xl 2xl:text-3xl font-black mb-6 sm:mb-10 leading-snug tracking-tight">
						Ողջույն։ Մենք միշտ այստեղ ենք՝ օգնելու ձեզ։
					</h3>

					<div className="space-y-3.5 sm:space-y-4">
						{/* Hotline */}
						<div className="flex items-center gap-3.5 sm:gap-4 bg-white/[0.04] border border-white/10 rounded-xl sm:rounded-2xl p-3.5 sm:p-4 transition-all hover:bg-white/[0.08]">
							<div className="size-11 rounded-xl bg-blue-500/15 border border-blue-400/25 flex items-center justify-center text-blue-400 shrink-0">
								<Phone className="size-5" />
							</div>
							<div>
								<p className="text-xs sm:text-sm font-semibold text-slate-400 mb-0.5">Թեժ գիծ։</p>
								<a
									href={telHref(contact?.phone, DEFAULT_PHONE_HREF)}
									className="text-base sm:text-lg font-bold hover:text-blue-300 transition-colors"
									suppressHydrationWarning
								>
									{contact?.phone || DEFAULT_PHONE}
								</a>
							</div>
						</div>

						{/* SMS / Whatsapp */}
						<div className="flex items-center gap-3.5 sm:gap-4 bg-white/[0.04] border border-white/10 rounded-xl sm:rounded-2xl p-3.5 sm:p-4 transition-all hover:bg-white/[0.08]">
							<div className="size-11 rounded-xl bg-blue-500/15 border border-blue-400/25 flex items-center justify-center text-blue-400 shrink-0">
								<svg
									width="20"
									height="20"
									className="size-5"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
									aria-hidden="true"
								>
									<path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
									<path d="M8 12h.01" />
									<path d="M12 12h.01" />
									<path d="M16 12h.01" />
								</svg>
							</div>
							<div>
								<p className="text-xs sm:text-sm font-semibold text-slate-400 mb-0.5">
									SMS / Whatsapp
								</p>
								<a
									href={telHref(contact?.phone, DEFAULT_MOBILE_PHONE_HREF)}
									className="text-base sm:text-lg font-bold hover:text-blue-300 transition-colors"
									suppressHydrationWarning
								>
									{contact?.phone || DEFAULT_MOBILE_PHONE}
								</a>
							</div>
						</div>

						{/* Email */}
						<div className="flex items-center gap-3.5 sm:gap-4 bg-white/[0.04] border border-white/10 rounded-xl sm:rounded-2xl p-3.5 sm:p-4 transition-all hover:bg-white/[0.08]">
							<div className="size-11 rounded-xl bg-blue-500/15 border border-blue-400/25 flex items-center justify-center text-blue-400 shrink-0">
								<Mail className="size-5" />
							</div>
							<div>
								<p className="text-xs sm:text-sm font-semibold text-slate-400 mb-0.5">Էլ․ փոստ։</p>
								<a
									href={mailHref(contact?.email, DEFAULT_EMAIL_HREF)}
									className="text-sm sm:text-base font-bold hover:text-blue-300 transition-colors break-all"
									suppressHydrationWarning
								>
									{contact?.email || DEFAULT_EMAIL}
								</a>
							</div>
						</div>
					</div>
				</div>

				{/* Social Media */}
				<ContactSocial contact={contact} />
			</div>
		</div>
	);
}
