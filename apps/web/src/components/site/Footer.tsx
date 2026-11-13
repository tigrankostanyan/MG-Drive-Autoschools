import { useContactInfo } from "@/hooks/use-contact-info";
import { QUICK_LINKS, RESOURCES } from "./footer/data";
import { FooterBottom } from "./footer/FooterBottom";
import { FooterBrand } from "./footer/FooterBrand";
import { FooterContact } from "./footer/FooterContact";
import { FooterCta } from "./footer/FooterCta";
import { FooterLinksColumn } from "./footer/FooterLinksColumn";

export function Footer({ showCta = true }: { showCta?: boolean } = {}) {
	const contact = useContactInfo();

	return (
		<footer className="w-full flex flex-col">
			{showCta && <FooterCta />}

			{/* Main Footer Content */}
			<div className="bg-slate-950 text-slate-300 py-16 sm:py-20 2xl:py-24 border-t border-white/10">
				<div className="container relative z-10">
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 2xl:gap-16">
						{/* Column 1: Logo & Info */}
						<FooterBrand />

						{/* Column 2: Quick Links */}
						<FooterLinksColumn title="Արագ հղումներ" links={QUICK_LINKS} />

						{/* Column 3: Resources */}
						<FooterLinksColumn title="Ռեսուրսներ" links={RESOURCES} />

						{/* Column 4: Contact */}
						<FooterContact contact={contact} />
					</div>
				</div>
			</div>

			<FooterBottom />
		</footer>
	);
}
