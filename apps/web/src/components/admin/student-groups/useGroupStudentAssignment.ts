import { type Dispatch, type SetStateAction, useMemo, useState } from "react";
import { toast } from "sonner";
import type { UserData } from "@/components/admin/types";
import {
	assignStudentGroupStudents,
	fetchStudentGroupStudents,
	updateStudentGroup,
} from "@/lib/api/student-groups";
import type { StudentGroupData } from "@/lib/api/types";
import { serverErrorText } from "@/lib/api-errors";

export function useGroupStudentAssignment({
	studentGroups,
	onChange,
}: {
	studentGroups: StudentGroupData[];
	onChange: Dispatch<SetStateAction<StudentGroupData[]>>;
}) {
	const [expandedGroupId, setExpandedGroupId] = useState<number | null>(null);
	const [groupStudents, setGroupStudents] = useState<UserData[]>([]);
	const [allStudents, setAllStudents] = useState<UserData[]>([]);
	const [selectedStudentIds, setSelectedStudentIds] = useState<number[]>([]);
	const [sLoading, setSLoading] = useState(false);
	const [isAssigning, setIsAssigning] = useState(false);
	const [saving, setSaving] = useState(false);
	const reloadStudents = async (gid: number): Promise<number> => {
		setSLoading(true);
		setIsAssigning(false);
		try {
			const res = await fetchStudentGroupStudents(gid);
			setGroupStudents(res.students || []);
			setAllStudents(res.allStudents || []);
			setSelectedStudentIds((res.students || []).map((s) => s.id));
			return (res.students || []).length;
		} catch (err) {
			toast.error(serverErrorText(err, "Ուսանողների բեռնման սխալ"));
			return 0;
		} finally {
			setSLoading(false);
		}
	};
	const loadGroupStudents = async (gid: number) => {
		if (expandedGroupId === gid) {
			setExpandedGroupId(null);
			return;
		}
		setExpandedGroupId(gid);
		await reloadStudents(gid);
	};
	const handleSaveStudents = async () => {
		if (!expandedGroupId || saving) return;
		setSaving(true);
		try {
			await assignStudentGroupStudents(expandedGroupId, selectedStudentIds);
			toast.success("Ուսանողները պահպանվեցին");
			const count = await reloadStudents(expandedGroupId);
			onChange((prev) =>
				prev.map((g) => (g.id === expandedGroupId ? { ...g, studentCount: count } : g)),
			);
		} catch (err) {
			toast.error(serverErrorText(err, "Ուսանողների պահպանման սխալ"));
		} finally {
			setSaving(false);
		}
	};
	const handleToggleAccess = async (value: boolean) => {
		if (!expandedGroupId) return;
		try {
			const res = await updateStudentGroup(expandedGroupId, {
				grantStudentAccess: value,
			});
			toast.success(
				value ? "Խմբի ուսանողներին տրվեց անվճար մուտք" : "Խմբի ուսանողների անվճար մուտքը հանվեց",
			);
			onChange((prev) =>
				prev.map((g) =>
					g.id === expandedGroupId ? { ...g, grantStudentAccess: res.data.grantStudentAccess } : g,
				),
			);
		} catch (err) {
			toast.error(serverErrorText(err, "Կարգավորման պահպանման սխալ"));
		}
	};
	const handleStudentToggle = (id: number, checked: boolean) => {
		if (checked) setSelectedStudentIds((prev) => [...prev, id]);
		else setSelectedStudentIds((prev) => prev.filter((s) => s !== id));
	};
	const currentGroup = studentGroups.find((g) => g.id === expandedGroupId);
	const groupTitles = useMemo(
		() =>
			studentGroups.reduce<Record<number, string>>((acc, g) => {
				acc[g.id] = g.title;
				return acc;
			}, {}),
		[studentGroups],
	);

	return {
		expandedGroupId,
		setExpandedGroupId,
		groupStudents,
		allStudents,
		selectedStudentIds,
		sLoading,
		isAssigning,
		setIsAssigning,
		saving,
		currentGroup,
		groupTitles,
		loadGroupStudents,
		handleSaveStudents,
		handleToggleAccess,
		handleStudentToggle,
	};
}

export type GroupStudentAssignmentState = ReturnType<typeof useGroupStudentAssignment>;
