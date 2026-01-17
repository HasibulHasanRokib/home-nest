"use client";

import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Spinner } from "../ui/spinner";
import { Card, CardContent } from "../ui/card";
import { addReviewAction } from "@/app/profile/actions";

type ReviewRatings = {
  communication: number;
  responsiveness?: number;
  propertyCare?: number;
  fairness?: number;
};

type ReviewCategory = {
  key: keyof ReviewRatings;
  label: string;
  points: string[];
};

const REVIEW_CATEGORIES: ReviewCategory[] = [
  {
    key: "communication",
    label: "Communication",
    points: ["Clear instructions", "Easy to reach"],
  },
  {
    key: "responsiveness",
    label: "Responsiveness",
    points: ["Quick replies", "Solves issues fast"],
  },
  {
    key: "fairness",
    label: "Fairness",
    points: ["Transparent dealings", "No hidden pressure"],
  },
  {
    key: "propertyCare",
    label: "Property Care",
    points: ["Maintains cleanliness", "Avoids damage"],
  },
];

const STARS = [1, 2, 3, 4, 5] as const;

function StarRating({
  rating,
  onChange,
  label,
  points,
}: {
  rating: number;
  onChange: (v: number) => void;
  label: string;
  points: string[];
}) {
  return (
    <div className="flex items-center justify-between border-b px-6 py-4 ">
      <div>
        <p className="text-sm font-medium">{label}</p>
        <ul className="mt-1 list-disc list-inside text-xs text-muted-foreground">
          {points.map((p, i) => (
            <li key={i}>{p}</li>
          ))}
        </ul>
      </div>

      <div className="flex gap-1">
        {STARS.map((s) => (
          <button key={s} type="button" onClick={() => onChange(s)}>
            <Star
              className={`h-5 w-5 ${
                s <= rating
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-muted-foreground"
              }`}
            />
          </button>
        ))}
      </div>
    </div>
  );
}

export function ProfileReview({ userId }: { userId: string }) {
  const categories = REVIEW_CATEGORIES;

  const initialRatings = Object.fromEntries(
    categories.map((c) => [c.key, 0])
  ) as ReviewRatings;

  const [ratings, setRatings] = useState<ReviewRatings>(initialRatings);
  const [pending, startTransition] = useTransition();

  const avgRating =
    Object.values(ratings).reduce((a, b) => a + (b ?? 0), 0) /
    categories.length;

  const submitReview = (e: React.FormEvent) => {
    e.preventDefault();

    startTransition(async () => {
      const res = await addReviewAction({
        userId,
        rating: Number(avgRating.toFixed(2)),
      });

      if (res?.error) {
        toast("Something went wrong", { description: res.error });
      } else {
        toast("Review submitted 🔥");
        setRatings(initialRatings);
      }
    });
  };

  return (
    <Card>
      <CardContent>
        <form onSubmit={submitReview}>
          {categories.map((c) => (
            <StarRating
              key={c.key}
              rating={ratings[c.key] ?? 0}
              label={c.label}
              points={c.points}
              onChange={(v) => setRatings((prev) => ({ ...prev, [c.key]: v }))}
            />
          ))}

          <Button disabled={pending} className="mt-8 w-full">
            {pending ? <Spinner /> : "Submit Review"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
