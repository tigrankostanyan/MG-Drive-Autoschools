import { Link, useRouter } from "@tanstack/react-router";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ApiError } from "@/lib/api/client";
import { normalizeError } from "@/lib/api/errors";
import { logError } from "@/lib/error-logger";

export function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
	// Report once per error instance; rendering must not re-log and flood the console.
	useEffect(() => {
		logError(error, { scope: "route.error" });
	}, [error]);

	const router = useRouter();
	const normalizedError = normalizeError(error);

	// Distinct messages based on error type
	const isAuthError = normalizedError.isAuthError;
	const isNetworkError = normalizedError.isNetworkError;

	let title = "Էջը չհաջողվեց բեռնել";
	let description = "Տեղի է ունեցել սխալ։ Կարող եք թարմացնել էջը կամ վերադառնալ գլխավոր էջ։";

	if (isAuthError && error instanceof ApiError && error.message === "kicked_out") {
		title = "Սեսիան ընդհատվել է";
		description = "Ձեր հաշիվը մուտք է գործել այլ սարքից։ Խնդրում ենք մուտք գործել նորից։";
	} else if (isAuthError) {
		title = "Նույնականացման սխալ";
		description = "Ձեր սեսիան լրացել է։ Խնդրում ենք մուտք գործել նորից։";
	} else if (isNetworkError) {
		title = "Ցանցի կապ չկա";
		description = "Չհաջողվեց կապվել սերվերի հետ։ Խնդրում ենք ստուգել կապը և փորձել կրկին։";
	} else if (normalizedError.status >= 500) {
		title = "Սերվերի սխալ";
		description = "Սերվերի վրա սխալ տեղի ունեցավ։ Խնդրում ենք փորձել մի փոքր ուշ։";
	}

	return (
		<div className="flex min-h-screen items-center justify-center bg-background px-4">
			<div className="max-w-md text-center">
				<h1 className="text-xl font-bold tracking-tight text-foreground">{title}</h1>
				<p className="mt-2 text-sm text-muted-foreground leading-relaxed">{description}</p>
				<div className="mt-6 flex flex-wrap justify-center gap-3">
					<Button
						variant="primary"
						onClick={() => {
							router.invalidate();
							reset();
						}}
					>
						Կրկին փորձել
					</Button>
					<Button asChild variant="outline">
						<Link to="/">Գլխավոր էջ</Link>
					</Button>
				</div>
			</div>
		</div>
	);
}
