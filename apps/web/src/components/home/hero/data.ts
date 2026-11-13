import { CalendarDays, Car, ShieldCheck, ThumbsUp, Users } from "lucide-react";

export const heroCarBg = "/hero.jpg";
/** WebP variant (~87% smaller) — the primary source; `heroCarBg` is the fallback. */
export const heroCarBgWebp = "/hero.webp";
/** 800px-wide WebP (~34KB) for phones. */
export const heroCarBgMobileWebp = "/hero-mobile.webp";

export const HERO_DOCK_FEATURES = [
	{
		Icon: ShieldCheck,
		title: "ՀՀ ՃՈ ԼԻՑԵՆԶԻԱ",
		desc: "Պետականորեն վավերացված",
		isLast: false,
	},
	{
		Icon: Users,
		title: "ՀՄՈՒՏ ՀՐԱՀԱՆԳԻՉՆԵՐ",
		desc: "Համբերատար և փորձառու",
		isLast: false,
	},
	{
		Icon: CalendarDays,
		title: "ՃԿՈՒՆ ԳՐԱՖԻԿ",
		desc: "Առավոտյան և երեկոյան",
		isLast: false,
	},
	{
		Icon: Car,
		title: "ԱՆՎՏԱՆԳ ՄԵՔԵՆԱՆԵՐ",
		desc: "Կրկնակի ղեկով, մաքուր սրահ",
		isLast: false,
	},
	{
		Icon: ThumbsUp,
		title: "ԲԱՐՁՐ ԱՐԴՅՈՒՆՔ",
		desc: "94% առաջին փորձից հանձնում",
		isLast: true,
	},
];

export function splitHeroTitle(title?: string) {
	let titleLine1 = "Վարորդական իրավունք";
	let titleLine2 = "Հեշտ ու վստահ";

	if (title) {
		const cleanTitle = title.replace(/[.։]+$/, "").trim();
		const words = cleanTitle.split(/\s+/);
		if (words.length <= 2) {
			titleLine1 = words[0] || "Վարորդական իրավունք";
			titleLine2 = words.slice(1).join(" ") || "Հեշտ ու վստահ";
		} else {
			titleLine1 = words.slice(0, 2).join(" ");
			titleLine2 = words.slice(2).join(" ");
		}
	}

	return { titleLine1, titleLine2 };
}
