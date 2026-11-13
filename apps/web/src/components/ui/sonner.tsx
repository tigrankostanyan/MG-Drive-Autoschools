import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;
const Toaster = ({ ...props }: ToasterProps) => {
	return (
		<Sonner
			className="toaster group"
			position="bottom-right"
			toastOptions={{
				classNames: {
					toast:
						"group flex items-center gap-3 p-4 rounded-2xl border shadow-xl backdrop-blur-md bg-white/80 font-medium transition-all w-full",
					title: "text-[14px] font-bold",
					description: "text-gray-600 text-[13px] font-medium mt-1",
					actionButton: "bg-primary text-primary-foreground font-bold rounded-lg",
					cancelButton: "bg-gray-100 text-gray-600 font-bold rounded-lg",
					success:
						"!bg-emerald-50/90 !border-emerald-200 !text-emerald-700 [&>div>svg]:text-emerald-600",
					error: "!bg-red-50/90 !border-red-200 !text-red-700 [&>div>svg]:text-red-600",
					warning: "!bg-amber-50/90 !border-amber-200 !text-amber-700 [&>div>svg]:text-amber-600",
					info: "!bg-primary-light/90 !border-primary/20 !text-primary [&>div>svg]:text-primary",
					loader: "!text-primary",
				},
			}}
			{...props}
		/>
	);
};

export { Toaster };
