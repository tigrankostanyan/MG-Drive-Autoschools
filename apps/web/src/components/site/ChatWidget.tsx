import { MessageCircle, Send, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const RESPONSE_DELAY_MS = 420;

type Msg = { role: "bot" | "user"; text: string };
const rules: Array<{ keys: string[]; answer: string }> = [
	{
		keys: ["գին", "արժ", "վճար"],
		answer:
			"Տեսական դասընթացը՝ 35 000 դրամ, գործնական վարումը՝ 4 500 դրամ/ժամ։ Ամբողջական փաթեթը (տեսություն + 20 ժամ պրակտիկա)՝ 120 000 դրամ։",
	},
	{
		keys: ["խումբ", "դասընթաց"],
		answer:
			"Խմբերը սկսվում են ամեն երկուշաբթի։ «Խմբեր» էջում կարող եք ընտրել թեման և անմիջապես լրացնել հարցերը։",
	},
	{
		keys: ["թեստ", "քննութ"],
		answer:
			"Յուրաքանչյուր թեստ պարունակում է 20 հարց և տևում է 30 րոպե՝ ինչպես իրական քննությանը։ Անցումային շեմը՝ 18 ճիշտ պատասխան։",
	},
	{
		keys: ["գրանց", "մուտք", "հաշիվ"],
		answer: "Գրանցվել կարող եք Google-ով կամ էլ. փոստով՝ «Գրանցվել» կոճակի միջոցով։",
	},
	{
		keys: ["հասցե", "որտեղ", "կոնտակտ", "հեռախոս"],
		answer: "Մենք գտնվում ենք Երևան, Աբովյան 15։ Հեռ.՝ +374 10 55 44 33, երկ–շաբ 09:00–19:00։",
	},
	{
		keys: ["տարիք", "փաստաթուղթ"],
		answer: "B կարգի համար անհրաժեշտ է 18 տարեկան, անձնագիր և բժշկական տեղեկանք։",
	},
];
const fallback =
	"Կներեք, դեռ սովորում եմ 🙂 Կարող եք հարցնել գների, խմբերի, թեստերի, գրանցման կամ հասցեի մասին, կամ զանգահարել +374 10 55 44 33։";
export function ChatWidget() {
	const [open, setOpen] = useState(false);
	const [input, setInput] = useState("");
	const [msgs, setMsgs] = useState<Msg[]>([]);
	const scroller = useRef<HTMLDivElement>(null);
	useEffect(() => {
		setMsgs([{ role: "bot", text: "Բարև Ձեզ։ Ինչպե՞ս կարող եմ օգնել։" }]);
	}, []);
	useEffect(() => {
		const lastMessage = msgs.at(-1);
		if (!open || !lastMessage) return;
		scroller.current?.scrollTo({
			top: scroller.current.scrollHeight,
			behavior: "smooth",
		});
	}, [msgs, open]);
	const send = () => {
		const text = input.trim();
		if (!text) return;
		const q = text.toLowerCase();
		const hit = rules.find((r) => r.keys.some((k) => q.includes(k)));
		setInput("");
		setMsgs((m) => [...m, { role: "user", text }]);
		setTimeout(() => {
			setMsgs((m) => [...m, { role: "bot", text: hit ? hit.answer : fallback }]);
		}, RESPONSE_DELAY_MS);
	};
	return (
		<div className="fixed bottom-6 right-6 z-[60] flex flex-col items-end gap-3 max-[576px]:bottom-[88px] max-[576px]:right-4">
			{open && (
				<div className="surface-card flex h-[27rem] w-[22rem] max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200/80 bg-white dark:bg-slate-900 animate-in fade-in slide-in-from-bottom-3 duration-300">
					<div className="bg-primary flex items-center justify-between px-4 py-3.5 text-white shadow-xs">
						<div className="flex items-center gap-2">
							<span className="size-2 rounded-full bg-emerald-400 ring-2 ring-emerald-400/30 animate-pulse" />
							<span className="text-sm font-bold text-white tracking-wide">Առցանց Օգնական</span>
						</div>
						<button
							type="button"
							onClick={() => setOpen(false)}
							className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors outline-none cursor-pointer"
							aria-label="Փակել չատը"
						>
							<X className="size-4.5" />
						</button>
					</div>
					<div ref={scroller} className="flex-1 space-y-3 overflow-y-auto bg-slate-50/70 p-4">
						{msgs.map((m) => (
							<div
								key={`${m.role}-${m.text}`}
								className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-[13px] leading-relaxed shadow-xs ${
									m.role === "user"
										? "ml-auto bg-primary text-white font-medium"
										: "border border-slate-200/80 bg-white text-slate-800"
								}`}
							>
								{m.text}
							</div>
						))}
					</div>
					<div className="flex items-center gap-2 border-t border-slate-200/80 p-3 bg-white">
						<input
							value={input}
							onChange={(e) => setInput(e.target.value)}
							onKeyDown={(e) => e.key === "Enter" && send()}
							placeholder="Գրեք Ձեր հարցը..."
							className="h-10 flex-1 rounded-xl bg-slate-100/90 px-3.5 text-[13px] border border-slate-200/80 outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all text-slate-900 placeholder:text-slate-400"
						/>
						<button
							type="button"
							onClick={send}
							className="grid size-10 place-items-center rounded-xl bg-primary text-white hover:bg-primary/90 transition-all active:scale-95 outline-none shadow-xs cursor-pointer"
							aria-label="Ուղարկել"
						>
							<Send className="size-4" />
						</button>
					</div>
				</div>
			)}
			<button
				type="button"
				onClick={() => setOpen((v) => !v)}
				className="grid size-14 place-items-center rounded-full bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/40 active:translate-y-0 active:scale-95 outline-none cursor-pointer"
				aria-label="Բացել չատը"
			>
				<MessageCircle className="size-6.5" />
			</button>
		</div>
	);
}
