import { Link } from "@tanstack/react-router";
import { SOCIAL_LINKS } from "./data";

export function FooterBrand() {
	return (
		<div className="flex flex-col">
			<Link to="/" className="flex items-center gap-3 mb-5 group">
				<img
					src="/images/logo/logo.png"
					alt="MG Drive"
					className="h-11 sm:h-13 w-auto max-w-[200px] object-contain group-hover:scale-105 transition-transform brightness-0 invert"
				/>
			</Link>
			<p className="text-sm leading-relaxed text-slate-400 mb-6">
				ՀՀ ՃՈ կողմից հաստատված վարման դպրոց՝ պրոֆեսիոնալ վարման դասընթացներ, տեսական ու գործնական
				պարապմունքներ Երևանում և ամբողջ Հայաստանում։
			</p>

			<div className="flex items-center gap-2.5">
				{SOCIAL_LINKS.map(({ Icon, href, label }) => (
					<a
						key={label}
						href={href}
						aria-label={label}
						className="flex size-9 place-items-center justify-center rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:bg-primary hover:border-primary hover:text-white transition-all duration-200 hover:-translate-y-0.5 shadow-xs"
					>
						<Icon className="size-4" />
					</a>
				))}
			</div>
		</div>
	);
}
