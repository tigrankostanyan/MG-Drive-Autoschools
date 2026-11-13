export const MFA_CODE_LENGTH = 6;
export const RECOVERY_CODE_MAX_LENGTH = 32;

/** Returns a user-facing message when the MFA input cannot be submitted. */
export function validateMfaInput(value: string, useRecoveryCode: boolean): string | null {
	const trimmed = value.trim();
	if (!trimmed) {
		return useRecoveryCode ? "Մուտքագրեք վերականգնման կոդը։" : "Մուտքագրեք հավելվածի 6-նիշ կոդը։";
	}
	if (!useRecoveryCode && trimmed.length !== MFA_CODE_LENGTH) {
		return "Մուտքագրեք հավելվածի 6-նիշ կոդը։";
	}
	return null;
}
