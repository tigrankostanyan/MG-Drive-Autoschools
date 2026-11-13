import { Car, type LucideIcon, MonitorPlay, Zap } from "lucide-react";

export interface CoursePlan {
	id: string;
	badge: string;
	badgeColor: string;
	icon: LucideIcon;
	title: string;
	subtitle: string;
	duration: string;
	schedule: string;
	features: string[];
	ctaText: string;
	ctaLink?: string;
	isRegister: boolean;
	packageValue?: string;
	popular: boolean;
}

export const COURSE_PLANS: CoursePlan[] = [
	{
		id: "theory",
		badge: "Տեսություն",
		badgeColor: "bg-blue-50 text-blue-700 border-blue-200/60",
		icon: MonitorPlay,
		title: "Տեսական դասընթաց",
		subtitle: "Ճանապարհային երթևեկության կանոնների ամբողջական կուրս",
		duration: "30 ժամ",
		schedule: "Շաբաթական 3 անգամ · 2 ժամ",
		features: [
			"Ճանապարհային նշաններ և գծանշումներ",
			"Խաչմերուկների անցման առաջնահերթություններ",
			"Քննական բոլոր թեմաների ինտերակտիվ վերլուծություն",
			"Առցանց թեստային համակարգ՝ անսահմանափակ հասանելիությամբ",
			"Փորձառու դասախոսների ուղղորդում",
		],
		ctaText: "Սկսել խմբերը",
		ctaLink: "/groups",
		isRegister: false,
		popular: false,
	},
	{
		id: "full",
		badge: "Ամենապահանջված",
		badgeColor: "bg-amber-50 text-amber-800 border-amber-200/80",
		icon: Zap,
		title: "Ամբողջական փաթեթ",
		subtitle: "Տեսություն + Գործնական վարում՝ զրոյից մինչև վարորդական իրավունք",
		duration: "46 ժամ",
		schedule: "2.5 ամիս · 10 շաբաթ",
		features: [
			"30 ժամ տեսական լիարժեք պարապմունքներ",
			"16 ժամ անհատական գործնական վարում",
			"Քաղաքային երթևեկություն և ավտոդրոմի վարժություններ",
			"Ներքին փորձնական քննության հանձնում",
			"Պաշտոնական քննության ամբողջական աջակցություն",
		],
		ctaText: "Գրանցվել հիմա",
		isRegister: true,
		packageValue: "ֆուլ փաթեթ",
		popular: true,
	},
	{
		id: "practice",
		badge: "Գործնական",
		badgeColor: "bg-emerald-50 text-emerald-800 border-emerald-200/60",
		icon: Car,
		title: "Գործնական վարում",
		subtitle: "Անհատական վարման դասեր փորձառու հրահանգիչների հետ",
		duration: "16 ժամ",
		schedule: "Ճկուն ժամանակացույց · ձեր ընտրությամբ",
		features: [
			"Ժամանակակից ուսումնական ավտոմեքենաներ (մեխանիկական / ավտոմատ)",
			"Զուգահեռ կայանում, էստակադա, հետընթաց վարժություններ",
			"Երևանի բարդ խաչմերուկներում վարելու հմտություններ",
			"Վախի և լարվածության հաղթահարման մեթոդաբանություն",
			"Անհատական մոտեցում յուրաքանչյուր ուսանողին",
		],
		ctaText: "Գրանցվել հիմա",
		isRegister: true,
		packageValue: "գործնական",
		popular: false,
	},
];
