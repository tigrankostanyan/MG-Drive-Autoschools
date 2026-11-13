import { Facebook, Instagram, Twitter, Youtube } from "lucide-react";

export const QUICK_LINKS = [
	{ to: "/", label: "Գլխավոր" },
	{ to: "/courses", label: "Դասընթացներ" },
	{ to: "/groups", label: "Խմբեր" },
	{ to: "/tests", label: "Թեստեր" },
	{ to: "/how-it-works", label: "Ուսուցման ընթացք" },
];

/** In-page anchors on the home route — these sections already exist. */
export const RESOURCES = [
	{ to: "/", hash: "about", label: "Մեր մասին" },
	{ to: "/", hash: "faq", label: "Հաճախ տրվող հարցեր" },
	{ to: "/privacy", label: "Գաղտնիություն և Կանոններ" },
	{ to: "/", hash: "contact", label: "Կապ մեզ հետ" },
];

export const SOCIAL_LINKS = [
	{ Icon: Facebook, href: "#", label: "Facebook" },
	{ Icon: Instagram, href: "#", label: "Instagram" },
	{ Icon: Youtube, href: "#", label: "Youtube" },
	{ Icon: Twitter, href: "#", label: "Twitter" },
];
