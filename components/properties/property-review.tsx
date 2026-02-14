"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { User } from "better-auth";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useTransition } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Prisma } from "@/lib/generated/prisma/client";
import { formatDate, getInitials } from "@/lib/utils";
import { Spinner } from "@/components/ui/spinner";
import { propertyReviewAction } from "@/actions/property.action";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type PropertyReviewWithReviewer = Prisma.PropertyReviewGetPayload<{
  include: { reviewer: true };
}>;

const STARS = [1, 2, 3, 4, 5] as const;

export function PropertyReview({
  propertyReviews,
  propertyId,
  user,
}: {
  propertyReviews: PropertyReviewWithReviewer[];
  propertyId: string;
  user: User;
}) {
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [pending, startTransition] = useTransition();

  const averageRating =
    propertyReviews.length > 0
      ? propertyReviews.reduce((acc, r) => acc + r.rating, 0) /
        propertyReviews.length
      : 0;

  const submitReview = () => {
    if (!rating || !feedback) return;

    startTransition(async () => {
      const res = await propertyReviewAction({
        propertyId,
        feedback,
        rating,
      });

      if (res?.error) {
        toast.error(res.error);
      } else {
        toast.success("Review submitted");
        setRating(0);
        setFeedback("");
      }
    });
  };

  return (
    <Card className="mt-8">
      <CardHeader className="border-b">
        <div className="flex items-center justify-between">
          <CardTitle>Reviews</CardTitle>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
              <span className="text-lg font-semibold">
                {averageRating.toFixed(1)}
              </span>
              <span className="text-sm text-muted-foreground">
                ({propertyReviews.length})
              </span>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {propertyReviews.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No reviews yet. Be the first
          </p>
        ) : (
          <div className="space-y-6">
            {propertyReviews.map((review) => (
              <div
                key={review.id}
                className="border-b border-border pb-6 last:border-0"
              >
                <div className="flex items-start gap-4">
                  <Avatar>
                    <AvatarImage
                      src={review.reviewer.image || "/placeholder.svg"}
                    />
                    <AvatarFallback>
                      {getInitials(review.reviewer.name || "U")}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-semibold">
                          {review.reviewer.name}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {formatDate(review.createdAt)}
                        </div>
                      </div>

                      <div className="flex gap-1">
                        {Array.from({
                          length: Math.round(review.rating),
                        }).map((_, i) => (
                          <Star
                            key={i}
                            className="h-4 w-4 fill-yellow-400 text-yellow-400"
                          />
                        ))}
                      </div>
                    </div>

                    {review.feedback && (
                      <p className="mt-2 text-muted-foreground">
                        {review.feedback}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter>
        {user && (
          <Dialog>
            <DialogTrigger asChild>
              <Button size="lg" className="w-full" variant={"secondary"}>
                Give Review
              </Button>
            </DialogTrigger>

            <DialogContent>
              <DialogHeader>
                <DialogTitle className="text-xl">Leave a Review</DialogTitle>
              </DialogHeader>

              {/* Rating */}
              <div className="flex items-center gap-2">
                {STARS.map((s) => (
                  <button
                    key={s}
                    onClick={() => setRating(s)}
                    className="transition hover:scale-110"
                  >
                    <Star
                      className={`h-10 w-10 ${
                        s <= rating
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-muted-foreground"
                      }`}
                    />
                  </button>
                ))}
              </div>

              {/* Feedback */}
              <Textarea
                className="min-h-40"
                placeholder="Share your experience…"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
              />

              <Button onClick={submitReview} disabled={!rating || pending}>
                {pending ? <Spinner /> : " Submit Review"}
              </Button>
            </DialogContent>
          </Dialog>
        )}
      </CardFooter>
    </Card>
  );
}
