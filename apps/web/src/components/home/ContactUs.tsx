import { RevealOnScroll } from "@/components/shared/RevealOnScroll";
import { useContactInfo } from "@/hooks/use-contact-info";
import { ContactForm } from "./contact-us/ContactForm";
import { ContactInfoPanel } from "./contact-us/ContactInfoPanel";
import { ContactMap } from "./contact-us/ContactMap";

export function ContactUs() {
	const contact = useContactInfo();

	return (
		<section id="contact" className="hero-ink relative text-foreground overflow-hidden">
			{/* Ambient atmospheric glows matching dark landing sections */}
			<div className="pointer-events-none absolute -right-40 -top-40 size-[600px] rounded-full bg-blue-500/15 blur-[140px]" />
			<div className="pointer-events-none absolute -left-40 -bottom-40 size-[600px] rounded-full bg-indigo-500/10 blur-[140px]" />
			<div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(59,130,246,0.12),rgba(255,255,255,0))]" />
			<div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.03)_1px,transparent_0)] bg-[length:32px_32px]" />

			{/* Main Contact Card Container */}
			<div className="container relative z-10 py-10 sm:py-16 lg:py-20 2xl:py-24">
				<RevealOnScroll>
					<div className="w-full relative bg-white dark:bg-slate-900 rounded-3xl sm:rounded-[2.5rem] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.18)] dark:shadow-none dark:border dark:border-slate-800 grid grid-cols-1 lg:grid-cols-12 p-2 sm:p-4 2xl:p-5 gap-4 lg:gap-0">
						{/* Left Panel: Form */}
						<ContactForm />

						{/* Right Panel: Contact Info */}
						<ContactInfoPanel contact={contact} />
					</div>
				</RevealOnScroll>
			</div>

			{/* Map Section: Integrated into the design system */}
			<ContactMap contact={contact} />
		</section>
	);
}
