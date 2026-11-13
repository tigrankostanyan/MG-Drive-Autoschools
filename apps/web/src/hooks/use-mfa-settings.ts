import { useEffect, useState } from "react";
import { toast } from "sonner";
import type { MfaStatus } from "@/lib/api/auth";
import { disableMfa, enrollMfa, fetchMfaStatus, verifyMfaEnrollment } from "@/lib/api/auth";

export function useMfaSettings() {
	const [status, setStatus] = useState<MfaStatus | null>(null);
	const [pendingEnrollment, setPendingEnrollment] = useState<{
		secret: string;
		otpauthUri: string;
	} | null>(null);
	const [recoveryCodes, setRecoveryCodes] = useState<string[] | null>(null);
	const [code, setCode] = useState("");
	const [password, setPassword] = useState("");
	const [busy, setBusy] = useState(false);

	useEffect(() => {
		void (async () => {
			try {
				setStatus(await fetchMfaStatus());
			} catch {
				setStatus(null);
			}
		})();
	}, []);

	const copy = async (value: string) => {
		try {
			await navigator.clipboard.writeText(value);
			toast.success("Պատճենվեց");
		} catch {
			toast.error("Չհաջողվեց պատճենել");
		}
	};

	const handleEnroll = async () => {
		setBusy(true);
		try {
			const res = await enrollMfa();
			setPendingEnrollment(res);
			setCode("");
			setRecoveryCodes(null);
			toast.success("Սկանավորե՛ք գաղտնաբառը հավելվածում և հաստատե՛ք կոդով");
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "Չհաջողվեց սկսել MFA-ն");
		} finally {
			setBusy(false);
		}
	};

	const handleVerify = async () => {
		if (!/^\d{6}$/.test(code.trim())) {
			toast.error("Մուտքագրեք 6-նիշ կոդը");
			return;
		}
		setBusy(true);
		try {
			const res = await verifyMfaEnrollment(code.trim());
			setRecoveryCodes(res.recoveryCodes);
			setPendingEnrollment(null);
			setCode("");
			setStatus({ enabled: true, enrolledAt: new Date().toISOString() });
			toast.success("Երկգործոն նույնականացումը միացված է");
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "Կոդը սխալ է");
		} finally {
			setBusy(false);
		}
	};

	const handleDisable = async () => {
		if (!password || !/^\d{6}$/.test(code.trim())) {
			toast.error("Անհրաժեշտ է գաղտնաբառը և ընթացիկ 6-նիշ կոդը");
			return;
		}
		setBusy(true);
		try {
			await disableMfa(password, code.trim());
			setStatus({ enabled: false, enrolledAt: null });
			setPassword("");
			setCode("");
			setRecoveryCodes(null);
			toast.success("Երկգործոն նույնականացումն անջատված է");
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "Չհաջողվեց անջատել");
		} finally {
			setBusy(false);
		}
	};

	const cancelEnrollment = () => {
		setPendingEnrollment(null);
		setCode("");
	};

	return {
		status,
		pendingEnrollment,
		recoveryCodes,
		code,
		setCode,
		password,
		setPassword,
		busy,
		copy,
		handleEnroll,
		handleVerify,
		handleDisable,
		cancelEnrollment,
	};
}
