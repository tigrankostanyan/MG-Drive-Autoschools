import { HeadContent, Scripts } from "@tanstack/react-router";
import type { ReactNode } from "react";

/** Document shell that wraps every route's rendered output. */
export function RootShell({ children }: { children: ReactNode }) {
	return (
		<html lang="hy">
			<head>
				<HeadContent />
			</head>
			<body>
				{children}
				<Scripts />
			</body>
		</html>
	);
}
