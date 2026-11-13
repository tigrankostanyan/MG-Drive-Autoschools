import type { ReactNode } from "react";

function Block({ className, children }: { className: string; children?: ReactNode }) {
	return <div className={`bg-muted/70 animate-pulse ${className}`}>{children}</div>;
}

const KEYS_THREE = ["a", "b", "c"];
const KEYS_FOUR = [...KEYS_THREE, "d"];
const KEYS_SIX = [...KEYS_FOUR, "e", "f"];

export function ListPageSkeleton() {
	return (
		<div className="container py-14">
			<Block className="h-4 w-16 rounded-full" />
			<Block className="mt-2 h-10 w-72 max-w-full rounded-xl" />
			<Block className="mt-2 h-5 w-96 max-w-full rounded-lg" />
			<div className="mt-8 grid gap-4 sm:grid-cols-3">
				{KEYS_THREE.map((key) => (
					<Block key={key} className="h-24 rounded-2xl" />
				))}
			</div>
			<div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
				{KEYS_SIX.map((key) => (
					<Block key={key} className="h-52 rounded-2xl" />
				))}
			</div>
		</div>
	);
}

export function QuizPageSkeleton() {
	return (
		<div className="container max-w-4xl py-10">
			<Block className="h-5 w-28 rounded-full" />
			<Block className="mt-4 h-8 w-3/4 max-w-full rounded-xl" />
			<Block className="mt-6 h-40 w-full rounded-3xl" />
			<div className="mt-6 space-y-3">
				{KEYS_FOUR.map((key) => (
					<Block key={key} className="h-14 w-full rounded-2xl" />
				))}
			</div>
			<div className="mt-8 flex items-center justify-between">
				<Block className="h-11 w-32 rounded-xl" />
				<Block className="h-11 w-32 rounded-xl" />
			</div>
		</div>
	);
}

export function ProfilePageSkeleton() {
	return (
		<div className="container max-w-6xl py-10">
			<div className="flex flex-col gap-8 md:flex-row">
				<div className="w-full md:w-64 shrink-0 space-y-3">
					{KEYS_SIX.map((key) => (
						<Block key={key} className="h-12 w-full rounded-2xl" />
					))}
				</div>
				<div className="flex-1 space-y-5">
					<Block className="h-8 w-56 rounded-xl" />
					<Block className="h-64 w-full rounded-3xl" />
					<Block className="h-40 w-full rounded-3xl" />
				</div>
			</div>
		</div>
	);
}

export function HomePageSkeleton() {
	return (
		<div>
			<div className="container py-20 lg:py-28">
				<Block className="h-5 w-40 rounded-full" />
				<Block className="mt-5 h-14 w-3/4 max-w-3xl rounded-2xl" />
				<Block className="mt-4 h-6 w-1/2 max-w-xl rounded-xl" />
				<div className="mt-9 flex gap-4">
					<Block className="h-12 w-48 rounded-full" />
					<Block className="h-12 w-40 rounded-full" />
				</div>
			</div>
			<section className="container py-16">
				<Block className="mx-auto h-4 w-40 rounded-full" />
				<Block className="mx-auto mt-3 h-9 w-96 max-w-full rounded-xl" />
				<div className="mt-12 grid gap-8 lg:grid-cols-4">
					{KEYS_FOUR.map((key) => (
						<Block key={key} className="h-56 rounded-3xl" />
					))}
				</div>
			</section>
			<section className="container py-16">
				<div className="grid gap-6 md:grid-cols-3">
					{KEYS_THREE.map((key) => (
						<Block key={key} className="h-72 rounded-[2.5rem]" />
					))}
				</div>
			</section>
			<section className="container py-16">
				<Block className="mx-auto h-8 w-72 max-w-full rounded-xl" />
				<div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
					{KEYS_SIX.map((key) => (
						<Block key={key} className="h-40 rounded-3xl" />
					))}
				</div>
			</section>
		</div>
	);
}
