import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

export function NotFoundComponent() {
	return (
		<div className="flex min-h-screen items-center justify-center bg-background px-4">
			<div className="max-w-md text-center">
				<p aria-hidden="true" className="text-7xl font-bold text-foreground">
					404
				</p>
				<h1 className="mt-4 text-xl font-semibold text-foreground">Էջը չի գտնվել</h1>
				<p className="mt-2 text-sm text-muted-foreground">
					Ձեր փնտրած էջը գոյություն չունի կամ տեղափոխվել է։
				</p>
				<div className="mt-6 flex justify-center">
					<Button asChild variant="primary">
						<Link to="/">Գլխավոր էջ</Link>
					</Button>
				</div>
			</div>
		</div>
	);
}
