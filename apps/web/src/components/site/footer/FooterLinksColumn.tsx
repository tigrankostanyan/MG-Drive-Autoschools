import { Link } from "@tanstack/react-router";

type FooterLink = { to: string; label: string; hash?: string };

export function FooterLinksColumn({ title, links }: { title: string; links: FooterLink[] }) {
	return (
		<div>
			<h3 className="text-primary text-xs font-bold uppercase tracking-wider mb-5">{title}</h3>
			<ul className="flex flex-col gap-3">
				{links.map((link) => (
					<li key={`${link.to}#${link.hash ?? ""}`}>
						<Link
							to={link.to}
							hash={link.hash ?? ""}
							className="text-sm text-slate-400 hover:text-white transition-colors duration-200"
						>
							{link.label}
						</Link>
					</li>
				))}
			</ul>
		</div>
	);
}
