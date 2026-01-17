import { Star } from "lucide-react";

export function StarRating({
  rating = 0,
  maxStars = 5,
}: {
  rating?: number;
  maxStars?: number;
}) {
  return (
    <div className="flex items-center">
      {[...Array(maxStars)].map((_, i) => (
        <Star
          key={i}
          className={`h-5 w-5 ${
            i < Math.floor(rating || 0)
              ? "fill-yellow-400 text-yellow-400"
              : "text-gray-300"
          }`}
        />
      ))}
      <span className="ml-1 text-sm text-gray-600">({rating.toFixed(1)})</span>
    </div>
  );
}
