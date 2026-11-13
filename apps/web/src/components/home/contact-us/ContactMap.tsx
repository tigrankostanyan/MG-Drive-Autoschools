import { MapPin } from "lucide-react";
import type { ContactItem } from "@/lib/api/types";
import { safeMapEmbedUrl } from "@/lib/safe-url";
import { DEFAULT_ADDRESS, DEFAULT_MAP_IFRAME } from "./data";

export function ContactMap({ contact }: { contact: ContactItem | null }) {
	// Admin-editable value: only a Google Maps embed URL is ever framed.
	const mapSrc = safeMapEmbedUrl(contact?.map_iframe) ?? DEFAULT_MAP_IFRAME;
	return (
		<div className="container relative z-10 pb-16 sm:pb-20 2xl:pb-24">
			<div className="relative w-full h-[340px] sm:h-[400px] 2xl:h-[460px] rounded-3xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-900 group">
				<iframe
					key={mapSrc}
					src={mapSrc}
					width="100%"
					height="100%"
					style={{ border: 0 }}
					allowFullScreen
					loading="lazy"
					referrerPolicy="no-referrer-when-downgrade"
					sandbox="allow-scripts allow-same-origin allow-popups"
					title="MG Drive վարման դպրոցի գտնվելու վայրը քարտեզի վրա"
					className="w-full h-full grayscale-[20%] contrast-[1.05] opacity-90 transition-opacity group-hover:opacity-100"
					suppressHydrationWarning
				/>
				{/* Floating Location Card Overlay */}
				<div className="absolute top-4 left-4 sm:top-6 sm:left-6 z-10 bg-slate-950/85 backdrop-blur-md border border-white/10 rounded-2xl p-3.5 sm:p-4 text-white shadow-xl flex items-center gap-3 pointer-events-none">
					<div className="size-10 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center text-primary shrink-0">
						<MapPin className="size-5" />
					</div>
					<div>
						<p className="text-xs font-bold uppercase tracking-wider text-primary">Մեր հասցեն</p>
						<p className="text-sm font-bold text-white mt-0.5" suppressHydrationWarning>
							{contact?.address || DEFAULT_ADDRESS}
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}
