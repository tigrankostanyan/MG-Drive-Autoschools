import { useEffect, useState } from "react";
import { useAsyncSubmit } from "@/hooks/use-async-submit";
import type { ReviewItem } from "@/lib/api/reviews";
import { addReview, fetchReviews } from "@/lib/api/reviews";
import { type AuthUser, getKnownUser } from "@/lib/auth-guard";
import { subscribeSessionChange } from "@/lib/cross-tab";
import { logError } from "@/lib/error-logger";
import { notify } from "@/lib/notify";

const DEFAULT_RATING = 5;

export function useReviews() {
	const [testimonials, setTestimonials] = useState<ReviewItem[] | null>(null);
	const [user, setUser] = useState<AuthUser | null>(() => getKnownUser());
	const [dialogOpen, setDialogOpen] = useState(false);
	const [rating, setRating] = useState(DEFAULT_RATING);
	const [hoverRating, setHoverRating] = useState(0);
	const [comment, setComment] = useState("");

	useEffect(() => {
		const abortController = new AbortController();
		fetchReviews()
			.then((res) => {
				if (!abortController.signal.aborted) setTestimonials(res.data);
			})
			.catch((error) => {
				if (abortController.signal.aborted) return;
				logError(error, { scope: "reviews.useReviews" });
			});
		return () => {
			abortController.abort();
		};
	}, []);

	useEffect(() => {
		const sync = () => setUser(getKnownUser());
		window.addEventListener("auth-change", sync);
		const unsubscribe = subscribeSessionChange(sync);
		return () => {
			window.removeEventListener("auth-change", sync);
			unsubscribe();
		};
	}, []);

	const refreshReviews = () => {
		fetchReviews()
			.then((res) => setTestimonials(res.data))
			.catch((error) => logError(error, { scope: "reviews.refresh" }));
	};

	const openReviewDialog = () => {
		if (!user) {
			notify.info("Մուտք գործեք կարծիք թողնելու համար");
			window.location.href = "/auth";
			return;
		}
		setRating(DEFAULT_RATING);
		setHoverRating(0);
		setComment("");
		setDialogOpen(true);
	};

	const { isSubmitting: submitting, run } = useAsyncSubmit({
		fallbackError: "Չհաջողվեց պահպանել կարծիքը",
		onSuccess: () => {
			notify.success("Շնորհակալություն ձեր կարծիքի համար");
			setDialogOpen(false);
			refreshReviews();
		},
		onError: (message) => notify.error(message),
	});

	const submitReview = () => {
		const text = comment.trim();
		if (!text) {
			notify.error("Մեկնաբանության տեքստը պարտադիր է");
			return;
		}
		// `run` ignores the call while a review is already being submitted.
		void run(() => addReview({ rating, comment: text }));
	};

	const isEmpty = testimonials !== null && testimonials.length === 0;

	return {
		testimonials,
		dialogOpen,
		setDialogOpen,
		rating,
		setRating,
		hoverRating,
		setHoverRating,
		comment,
		setComment,
		submitting,
		openReviewDialog,
		submitReview,
		isEmpty,
	};
}
