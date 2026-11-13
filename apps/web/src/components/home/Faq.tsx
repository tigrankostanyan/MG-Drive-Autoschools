import { useState } from "react";
import { RevealOnScroll } from "@/components/shared/RevealOnScroll";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Badge } from "@/components/ui/badge";
import { CategoryTabs } from "./faq/CategoryTabs";
import { CATEGORIES, FAQ_DATA } from "./faq/data";
import { FaqCard } from "./faq/FaqCard";

export function Faq() {
	const [activeCategory, setActiveCategory] = useState("general");
	const currentCategoryData = CATEGORIES.find((c) => c.id === activeCategory) ?? CATEGORIES[0];
	const items = FAQ_DATA[activeCategory as keyof typeof FAQ_DATA] || [];

	return (
		<section
			id="faq"
			className="bg-background py-20 sm:py-24 lg:py-28 2xl:py-32 relative overflow-hidden"
		>
			{/* Background ambient accents */}
			<div className="pointer-events-none absolute left-[-10%] top-[10%] size-[600px] rounded-full bg-primary/10 blur-[150px]" />
			<div className="pointer-events-none absolute right-[-5%] bottom-[-10%] size-[500px] rounded-full bg-primary/10 blur-[130px]" />
			<div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(0,0,0,0.02)_1px,transparent_0)] bg-[length:32px_32px] dark:bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.02)_1px,transparent_0)] opacity-60" />

			<div className="container relative z-10">
				<RevealOnScroll>
					<SectionHeading
						eyebrow="Հաճախ տրվող հարցեր"
						title={
							<>
								Ունե՞ք հարցեր։{" "}
								<span className="text-primary font-black">Մենք ունենք պատասխաններ</span>
							</>
						}
						description="Ամեն ինչ, ինչ պետք է իմանաք մեր վարման դպրոցի, դասընթացների և քննությունների մասին՝ մեկ վայրում։"
					/>
				</RevealOnScroll>

				{/* 2-սյունակ դասավորություն */}
				<div className="grid lg:grid-cols-[340px_1fr] xl:grid-cols-[380px_1fr] 2xl:grid-cols-[420px_1fr] gap-8 lg:gap-12 2xl:gap-16 items-start">
					<RevealOnScroll delay={60}>
						<CategoryTabs activeCategory={activeCategory} onSelect={setActiveCategory} />
					</RevealOnScroll>

					<RevealOnScroll delay={120} className="space-y-3">
						<div className="flex items-center justify-between px-1 pb-1">
							<h3 className="font-bold text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">
								Հարց ու պատասխան
							</h3>
							<Badge variant="primary">
								{currentCategoryData?.title || ""} · {items.length} հարց
							</Badge>
						</div>

						<div className="space-y-3">
							{items.map((item) => (
								<FaqCard key={item.q} q={item.q} a={item.a} />
							))}
						</div>
					</RevealOnScroll>
				</div>
			</div>
		</section>
	);
}
