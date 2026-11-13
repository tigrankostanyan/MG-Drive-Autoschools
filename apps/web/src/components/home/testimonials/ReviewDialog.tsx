import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const STAR_MAX = 5;
const STAR_VALUES = Array.from({ length: STAR_MAX }, (_, i) => i + 1);

interface ReviewDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	rating: number;
	onRatingChange: (value: number) => void;
	hoverRating: number;
	onHoverRatingChange: (value: number) => void;
	comment: string;
	onCommentChange: (value: string) => void;
	submitting: boolean;
	onSubmit: () => void;
}

export function ReviewDialog({
	open,
	onOpenChange,
	rating,
	onRatingChange,
	hoverRating,
	onHoverRatingChange,
	comment,
	onCommentChange,
	submitting,
	onSubmit,
}: ReviewDialogProps) {
	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle>Թողեք ձեր կարծիքը</DialogTitle>
					<DialogDescription>
						Կիսվեք ձեր փորձառությամբ՝ օգնելու մյուսներին ճիշտ ընտրություն կատարել։
					</DialogDescription>
				</DialogHeader>
				<div className="space-y-4">
					{/* Native radios keep arrow-key navigation and group semantics. */}
					<fieldset className="m-0 border-0 p-0">
						<legend className="sr-only">Գնահատական</legend>
						<div className="flex gap-1.5 justify-center py-1">
							{STAR_VALUES.map((value) => (
								<label
									key={value}
									onMouseEnter={() => onHoverRatingChange(value)}
									onMouseLeave={() => onHoverRatingChange(0)}
									className="cursor-pointer transition-transform hover:scale-110"
								>
									<input
										type="radio"
										name="review-rating"
										value={value}
										checked={rating === value}
										onChange={() => onRatingChange(value)}
										aria-label={`${value} աստղ`}
										className="peer sr-only"
									/>
									<Star
										aria-hidden="true"
										className={`size-7 rounded-sm peer-focus-visible:ring-2 peer-focus-visible:ring-primary ${
											value <= (hoverRating || rating)
												? "text-amber-400 fill-amber-400"
												: "text-slate-300"
										}`}
									/>
								</label>
							))}
						</div>
					</fieldset>
					<div className="space-y-1.5">
						<Label htmlFor="review-comment">Մեկնաբանություն</Label>
						<Textarea
							id="review-comment"
							value={comment}
							onChange={(e) => onCommentChange(e.target.value)}
							placeholder="Ասեք, թե ինչպիսի՞ փորձառություն ունեցաք..."
							rows={4}
							maxLength={1000}
						/>
					</div>
				</div>
				<DialogFooter>
					<Button variant="outline" onClick={() => onOpenChange(false)} disabled={submitting}>
						Չեղարկել
					</Button>
					<Button onClick={onSubmit} disabled={submitting}>
						{submitting ? "Ուղարկվում է..." : "Ուղարկել"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
