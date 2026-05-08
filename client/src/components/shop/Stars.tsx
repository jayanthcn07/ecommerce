import { Star } from "lucide-react";

export const Stars = ({ value, size = 14 }: { value: number; size?: number }) => {
  const full = Math.floor(value);
  const half = value - full >= 0.5;
  return (
    <span className="inline-flex items-center" aria-label={`Rated ${value} out of 5`}>
      {Array.from({ length: 5 }).map((_, i) => {
        const filled = i < full || (i === full && half);
        return (
          <Star
            key={i}
            width={size}
            height={size}
            className={filled ? "fill-rating text-rating" : "text-muted-foreground/40"}
          />
        );
      })}
    </span>
  );
};
