import { toast } from "sonner";
export type NotifyAction = {
	label: string;
	onClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
};

export const notify = {
	success: (
		message: string = "Պահպանված է",
		description?: string,
		id?: string | number,
		action?: NotifyAction,
	) => {
		toast.success(message, {
			...(description && { description }),
			...(id && { id }),
			...(action && { action }),
		});
	},
	error: (
		message: string = "Առաջացավ սխալ",
		description?: string,
		id?: string | number,
		action?: NotifyAction,
	) => {
		toast.error(message, {
			...(description && { description }),
			...(id && { id }),
			...(action && { action }),
		});
	},
	info: (message: string, description?: string, id?: string | number, action?: NotifyAction) => {
		toast.info(message, {
			...(description && { description }),
			...(id && { id }),
			...(action && { action }),
		});
	},
	warning: (message: string, description?: string, id?: string | number, action?: NotifyAction) => {
		toast.warning(message, {
			...(description && { description }),
			...(id && { id }),
			...(action && { action }),
		});
	},
	loading: (
		message: string = "Խնդրում ենք սպասել...",
		description?: string,
		id?: string | number,
	) => {
		return toast.loading(message, {
			...(description && { description }),
			...(id && { id }),
		});
	},
	dismiss: (id?: string | number) => {
		toast.dismiss(id);
	},
};
