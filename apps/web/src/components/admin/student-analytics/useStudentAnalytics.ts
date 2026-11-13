import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import type { StudentAnalyticsItem, StudentAnalyticsResponse } from "@/lib/api/analytics";
import {
	bulkToggleStudentAnalytics,
	fetchStudentAnalytics,
	toggleStudentAnalytics,
} from "@/lib/api/analytics";
import { serverErrorText } from "@/lib/api-errors";

export function useStudentAnalytics({
	initialGroupId,
}: {
	initialGroupId?: number | string | undefined;
} = {}) {
	const [data, setData] = useState<StudentAnalyticsResponse | null>(null);
	const [loading, setLoading] = useState(true);
	const [search, setSearch] = useState("");
	const [selectedGroupId, setSelectedGroupId] = useState<string>(
		initialGroupId ? String(initialGroupId) : "all",
	);
	const [selectedStatus, setSelectedStatus] = useState<string>("all");
	const [expandedStudentId, setExpandedStudentId] = useState<number | null>(null);
	const [togglingIds, setTogglingIds] = useState<Set<number>>(new Set());
	const [bulkToggling, setBulkToggling] = useState(false);

	const loadAnalytics = useCallback(async () => {
		try {
			setLoading(true);
			const res = await fetchStudentAnalytics({
				groupId: selectedGroupId,
				search,
				status: selectedStatus,
			});
			setData(res);
		} catch (err) {
			toast.error(serverErrorText(err, "Անալիտիկայի բեռնման սխալ"));
		} finally {
			setLoading(false);
		}
	}, [selectedGroupId, search, selectedStatus]);

	useEffect(() => {
		void loadAnalytics();
	}, [loadAnalytics]);

	const handleToggleOne = async (student: StudentAnalyticsItem) => {
		const nextVal = !student.include_in_analytics;
		setTogglingIds((prev) => new Set(prev).add(student.id));

		// Optimistic update
		setData((prev) => {
			if (!prev) return prev;
			return {
				...prev,
				students: prev.students.map((s) =>
					s.id === student.id ? { ...s, include_in_analytics: nextVal } : s,
				),
			};
		});

		try {
			await toggleStudentAnalytics(student.id, nextVal);
			toast.success(
				nextVal
					? `${student.name}-ը ներառվեց անալիտիկայում`
					: `${student.name}-ն անջատվեց անալիտիկայից`,
			);
		} catch (err) {
			// Revert on error
			setData((prev) => {
				if (!prev) return prev;
				return {
					...prev,
					students: prev.students.map((s) =>
						s.id === student.id ? { ...s, include_in_analytics: !nextVal } : s,
					),
				};
			});
			toast.error(serverErrorText(err, "Կարգավիճակի փոփոխման սխալ"));
		} finally {
			setTogglingIds((prev) => {
				const next = new Set(prev);
				next.delete(student.id);
				return next;
			});
		}
	};

	const handleBulkToggle = async (include: boolean, groupId?: string) => {
		setBulkToggling(true);
		try {
			const targetGroupId = groupId ?? (selectedGroupId !== "all" ? selectedGroupId : undefined);
			await bulkToggleStudentAnalytics({
				include,
				groupId: targetGroupId,
			});
			toast.success(
				include
					? "Բոլոր ուսանողները միացվեցին անալիտիկայում"
					: "Բոլոր ուսանողներն անջատվեցին անալիտիկայից",
			);
			await loadAnalytics();
		} catch (err) {
			toast.error(serverErrorText(err, "Խմբային փոփոխման սխալ"));
		} finally {
			setBulkToggling(false);
		}
	};

	const toggleExpand = (id: number) => {
		setExpandedStudentId((curr) => (curr === id ? null : id));
	};

	const students = data?.students ?? [];
	const summary = data?.summary ?? null;

	const allActive = useMemo(() => {
		return students.length > 0 && students.every((s) => s.include_in_analytics);
	}, [students]);

	return {
		students,
		summary,
		loading,
		search,
		setSearch,
		selectedGroupId,
		setSelectedGroupId,
		selectedStatus,
		setSelectedStatus,
		expandedStudentId,
		toggleExpand,
		togglingIds,
		bulkToggling,
		allActive,
		handleToggleOne,
		handleBulkToggle,
		reload: loadAnalytics,
	};
}
