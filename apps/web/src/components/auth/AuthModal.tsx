import { type CredentialResponse, GoogleLogin } from "@react-oauth/google";
import { Loader2, ShieldCheck, Sparkles, X } from "lucide-react";
import { useEffect, useState } from "react";
import { googleLogin } from "@/lib/api/auth";
import { invalidateCsrfCache } from "@/lib/api/csrf";
import { friendlyError } from "@/lib/auth-errors";
import { setSessionUser } from "@/lib/auth-session";
import { notify } from "@/lib/notify";
import { recordAudit } from "@/lib/observability/audit";
import { useAuthModal } from "./auth-modal-context";

export function AuthModal() {
	const { isOpen, closeAuthModal } = useAuthModal();
	const [loading, setLoading] = useState(false);

	// Surface login failures as a toast instead of an inline form notice.
	const setError = (message: string) => {
		if (message) notify.error(message);
	};

	// Reset loading state when modal closes
	useEffect(() => {
		if (!isOpen) {
			setLoading(false);
		}
	}, [isOpen]);

	// Lock body scroll when modal is open
	useEffect(() => {
		if (!isOpen) return;
		const prevOverflow = document.body.style.overflow;
		document.body.style.overflow = "hidden";
		return () => {
			document.body.style.overflow = prevOverflow;
		};
	}, [isOpen]);

	// Handle Escape key to close modal
	useEffect(() => {
		if (!isOpen) return;
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Escape") closeAuthModal();
		};
		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [isOpen, closeAuthModal]);

	if (!isOpen) return null;

	const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
		if (!credentialResponse.credential) {
			setError("Google-ից նույնականացման տվյալներ չեն ստացվել։");
			return;
		}
		setLoading(true);
		try {
			const authResp = await googleLogin(credentialResponse.credential);
			setSessionUser(authResp.user);
			recordAudit("auth.signin.google", "success");
			notify.success("Բարի գալուստ", `${authResp.user.name || "Օգտատեր"}`);
			closeAuthModal();
		} catch (err: unknown) {
			recordAudit("auth.signin.google", "failure");
			const errorMsg = friendlyError(err) || "Google-ով մուտքը ձախողվեց։ Կրկին փորձեք։";
			setError(errorMsg);
			if (String(err).toLowerCase().includes("csrf")) {
				invalidateCsrfCache();
				setTimeout(() => {
					window.location.reload();
				}, 1500);
			}
		} finally {
			setLoading(false);
		}
	};

	const handleGoogleError = () => {
		setError("Google-ով մուտքը ձախողվեց։ Խնդրում ենք կրկին փորձել։");
	};

	return (
		<div
			className="fixed inset-0 z-[999] bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
			onMouseDown={closeAuthModal}
		>
			<div
				role="dialog"
				aria-modal="true"
				aria-label="Մուտք հաշիվ"
				className="w-full max-w-[420px] rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl flex flex-col gap-5 p-6 sm:p-7 relative animate-in zoom-in-95 duration-200"
				onMouseDown={(e) => e.stopPropagation()}
			>
				{/* Close Button */}
				<button
					type="button"
					onClick={closeAuthModal}
					aria-label="Փակել"
					className="absolute top-4.5 right-4.5 rounded-full p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 dark:hover:text-white transition-all focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 cursor-pointer"
				>
					<X className="h-4 w-4" />
				</button>

				{/* Header Section */}
				<div className="text-center space-y-2">
					<div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-primary">
						<Sparkles className="size-3.5" />
						<span className="text-[11px] font-bold tracking-wider uppercase">
							ՈՒՍՈՒՄՆԱԿԱՆ ՀԱՐԹԱԿ
						</span>
					</div>

					<h2 className="text-2xl font-black tracking-tight text-slate-950 dark:text-white text-center">
						Մուտք հաշիվ
					</h2>

					<p className="text-xs sm:text-[13px] text-slate-600 dark:text-slate-400 leading-relaxed text-center max-w-[330px] mx-auto">
						Մուտք գործեք համակարգ՝ քննական թեստերին, տեսական խմբերին և ձեր առաջընթացին
						հասանելիություն ստանալու համար։
					</p>
				</div>

				{/* Features / Benefits Strip */}
				<div className="rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800/80 p-3.5 text-left space-y-2">
					<div className="flex items-center gap-2.5 text-xs font-medium text-slate-700 dark:text-slate-300">
						<div className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
							<ShieldCheck className="size-3.5" />
						</div>
						<span>Արագ և ապահով գրանցում Google հաշվով</span>
					</div>
					<div className="flex items-center gap-2.5 text-xs font-medium text-slate-700 dark:text-slate-300">
						<div className="flex size-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
							<ShieldCheck className="size-3.5" />
						</div>
						<span>Պաշտոնական քննական թեստեր և խմբեր</span>
					</div>
				</div>

				{/* Google Auth Container */}
				<div className="flex flex-col items-center justify-center pt-1 min-h-[48px]">
					{loading ? (
						<div className="flex items-center justify-center gap-2 py-2.5 text-sm font-semibold text-primary">
							<Loader2 className="size-4.5 animate-spin" />
							<span>Մուտք է կատարվում...</span>
						</div>
					) : (
						<div className="w-full flex justify-center [&>div]:w-full [&>div]:max-w-[340px] [&>div]:flex [&>div]:justify-center">
							<GoogleLogin
								onSuccess={handleGoogleSuccess}
								onError={handleGoogleError}
								theme="outline"
								size="large"
								shape="pill"
								text="continue_with"
								width="340"
							/>
						</div>
					)}
				</div>

				{/* Terms and Privacy notice */}
				<p className="text-[11px] text-slate-400 dark:text-slate-500 text-center leading-normal">
					Մուտք գործելով՝ դուք ընդունում եք մեր{" "}
					<a
						href="/privacy"
						onClick={closeAuthModal}
						className="underline underline-offset-2 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
					>
						օգտագործման պայմանները
					</a>
					:
				</p>
			</div>
		</div>
	);
}
