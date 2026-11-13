export function FooterBottom() {
	return (
		<div className="bg-slate-950 border-t border-white/10 py-6">
			<div className="container relative z-10 flex flex-col md:flex-row items-center justify-between gap-4">
				<p className="text-xs text-slate-500 text-center md:text-left">
					&copy; 2026 MG Drive. Բոլոր իրավունքները պաշտպանված են։
				</p>
				<div className="flex items-center gap-5 text-xs text-slate-400">
					<button type="button" className="hover:text-white transition-colors">
						Գաղտնիության քաղաքականություն
					</button>
					<span className="text-white/20">|</span>
					<button type="button" className="hover:text-white transition-colors">
						Օգտագործման պայմաններ
					</button>
				</div>
			</div>
		</div>
	);
}
