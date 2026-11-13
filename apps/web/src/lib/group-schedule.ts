import type { StudentGroupAccess } from "./api/types";

/** ISO date to a local datetime-local value (YYYY-MM-DDTHH:mm). */
export function toDateTimeLocalValue(value?: string | null): string {
	if (!value) return "";
	const d = new Date(value);
	if (Number.isNaN(d.getTime())) return "";
	const pad = (n: number) => String(n).padStart(2, "0");
	return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

/** datetime-local value (or blank) to an ISO string, or null. */
export function fromDateTimeLocalValue(value: string): string | null {
	const v = value.trim();
	if (!v) return null;
	const d = new Date(v);
	return Number.isNaN(d.getTime()) ? null : d.toISOString();
}

/** Mirrors the server's accessControl.isGroupActive() window logic. */
export function isGroupActive(group?: StudentGroupAccess | null): boolean {
	if (!group) return false;
	const now = Date.now();
	const from = group.activeFrom ? new Date(group.activeFrom).getTime() : -Infinity;
	const until = group.activeUntil ? new Date(group.activeUntil).getTime() : Infinity;
	return now >= from && now <= until;
}

export type GroupScheduleState = "no-schedule" | "active" | "pending" | "expired";

/** Current schedule state for the group. */
export function getGroupScheduleState(group: StudentGroupAccess): GroupScheduleState {
	const now = Date.now();
	const from = group.activeFrom ? new Date(group.activeFrom).getTime() : null;
	const until = group.activeUntil ? new Date(group.activeUntil).getTime() : null;
	if (from != null && now < from) return "pending";
	if (until != null && now > until) return "expired";
	return from == null && until == null ? "no-schedule" : "active";
}

function formatShort(value?: string | null): string | null {
	if (!value) return null;
	const d = new Date(value);
	if (Number.isNaN(d.getTime())) return null;
	const pad = (n: number) => String(n).padStart(2, "0");
	return `${pad(d.getDate())}.${pad(d.getMonth() + 1)} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export type GroupScheduleInfo = {
	state: GroupScheduleState;
	/** Short badge label, e.g. "Activates 22.08 14:30". */
	label: string;
	/** Fuller line that always states the group's schedule status. */
	detail: string;
};

/** Schedule state plus human-readable labels and detail text. */
export function getGroupScheduleInfo(group: StudentGroupAccess): GroupScheduleInfo {
	const state = getGroupScheduleState(group);
	switch (state) {
		case "pending":
			return {
				state,
				label: `Ակտիվանում է ${formatShort(group.activeFrom) ?? "…"}`,
				detail: `Սպասվում է՝ կակտիվանա ${formatShort(group.activeFrom) ?? "…"}-ին`,
			};
		case "expired":
			return {
				state,
				label: `Անջատվել է ${formatShort(group.activeUntil) ?? "…"}`,
				detail: `Անջատվել է ${formatShort(group.activeUntil) ?? "…"}-ին`,
			};
		case "active":
			return {
				state,
				label: "Ակտիվ է",
				detail: group.activeUntil ? `Ակտիվ է մինչև ${formatShort(group.activeUntil)}-ը` : "Ակտիվ է",
			};
		case "no-schedule":
			return {
				state,
				label: "Ակտիվ",
				detail: "Առանց ժամանակացույցի — միշտ ակտիվ",
			};
	}
}
