import { createFileRoute } from "@tanstack/react-router";
import { Ban, Lock, ShieldAlert, ShieldCheck } from "lucide-react";
import { pageSeo } from "@/lib/seo";

export const Route = createFileRoute("/privacy")({
	head: () =>
		pageSeo({
			title: "Գաղտնիության քաղաքականություն և Կանոններ — MG Drive",
			description:
				"Կայքի օգտագործման կանոնները, անվտանգության երաշխիքները և պատժամիջոցները խախտումների դեպքում:",
			path: "/privacy",
		}),
	component: PrivacyPage,
});

function PrivacyPage() {
	return (
		<div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 md:py-20 font-sans selection:bg-primary/20 selection:text-primary">
			<div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
				<div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm ring-1 ring-slate-200 dark:ring-slate-800 p-8 md:p-12">
					<div className="mb-12 border-b border-slate-100 dark:border-slate-800 pb-10 text-center">
						<div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
							<ShieldCheck className="w-8 h-8 text-primary" />
						</div>
						<h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white tracking-tight mb-4">
							Գաղտնիության Քաղաքականություն և Կանոններ
						</h1>
						<p className="text-slate-500 dark:text-slate-400 text-lg max-w-2xl mx-auto">
							Մենք հոգ ենք տանում ձեր տվյալների անվտանգության մասին և խստորեն վերահսկում ենք կայքի
							բնականոն աշխատանքը։ Խնդրում ենք ծանոթանալ կանոններին։
						</p>
					</div>

					<div className="space-y-10 text-slate-600 dark:text-slate-300">
						{/* Section 1 */}
						<section className="flex flex-col md:flex-row gap-6">
							<div className="md:w-1/4 shrink-0">
								<div className="flex items-center gap-2 text-primary font-semibold">
									<Lock className="w-5 h-5" />
									<span>Անվտանգություն</span>
								</div>
							</div>
							<div className="md:w-3/4">
								<h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
									Տվյալների պաշտպանություն
								</h2>
								<p className="leading-relaxed">
									Մենք երաշխավորում ենք ձեր անձնական և վճարային տվյալների գաղտնիությունը: Բոլոր
									տվյալները գաղտնագրվում են ժամանակակից անվտանգության արձանագրություններով և չեն
									տրամադրվում երրորդ կողմի անձանց կամ կազմակերպություններին։ Ձեր գաղտնաբառերը և
									վճարային մանրամասները պահպանվում են բարձր մակարդակի պաշտպանվածությամբ։
								</p>
							</div>
						</section>

						<hr className="border-slate-100 dark:border-slate-800" />

						{/* Section 2 */}
						<section className="flex flex-col md:flex-row gap-6">
							<div className="md:w-1/4 shrink-0">
								<div className="flex items-center gap-2 text-orange-500 font-semibold">
									<ShieldAlert className="w-5 h-5" />
									<span>Կանոններ</span>
								</div>
							</div>
							<div className="md:w-3/4">
								<h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
									Կայքի կանոնների խախտում
								</h2>
								<p className="leading-relaxed">
									Կայքի օգտագործման կանոնները խախտելու դեպքում մենք իրավունք ենք վերապահում կիրառել
									սահմանափակումներ։ Եթե խախտեք կանոնները (ներառյալ անպատշաճ վարքագիծ, ուրիշների
									տվյալների օգտագործում, կամ այլ կանոնների անտեսում),{" "}
									<strong>ձեր հաշիվը կսառեցվի կամ կբլոկավորվի անվերջ</strong>՝ կախված խախտման
									ծանրությունից։ Բլոկավորման որոշումը բողոքարկման ենթակա չէ։
								</p>
							</div>
						</section>

						<hr className="border-slate-100 dark:border-slate-800" />

						{/* Section 3 */}
						<section className="flex flex-col md:flex-row gap-6">
							<div className="md:w-1/4 shrink-0">
								<div className="flex items-center gap-2 text-red-500 font-semibold">
									<Ban className="w-5 h-5" />
									<span>Խիստ արգելքներ</span>
								</div>
							</div>
							<div className="md:w-3/4">
								<h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
									Կեղծ վճարումներ և հարձակումներ
								</h2>
								<p className="leading-relaxed mb-4 text-red-600 dark:text-red-400 font-medium">
									Խստագույնս արգելվում է՝
								</p>
								<ul className="list-disc pl-5 mb-4 space-y-2">
									<li>Ֆեյք (կեղծ) վճարումներ իրականացնելու փորձերը:</li>
									<li>DDoS և այլ տիպի կիբերհարձակումները կայքի և սերվերների վրա:</li>
									<li>Համակարգի անվտանգությունը շրջանցելու փորձերը:</li>
								</ul>
								<div className="bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-300 p-4 rounded-xl text-sm font-medium leading-relaxed border border-red-100 dark:border-red-900">
									Նման գործողություններ նկատելու դեպքում տվյալ{" "}
									<strong>սարքը (Device) և IP հասցեն կբլոկավորվեն անվերադարձ</strong>։ Եթե նույն
									օգտվողը փորձի շրջանցել այս արգելքը՝ մուտք գործելով և խախտումներ անելով տարբեր
									սարքերից, նա այլևս չի կարողանա հաշիվ ստեղծել կայքում։
								</div>
							</div>
						</section>
					</div>
				</div>
			</div>
		</div>
	);
}
