"use client";
import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/components/AuthProvider";

export default function StarRatingClient({
  modId,
  initialAvg,
}: {
  modId: number;
  initialAvg: number;
}) {
  const { user } = useAuth();
  const [userRating, setUserRating] = useState<number | null>(null);
  const [avgRating, setAvgRating] = useState<number>(initialAvg);

  useEffect(() => {
    fetchUserRating();
    fetchAvgRating();
    // eslint-disable-next-line
  }, [modId, user]);

  async function fetchUserRating() {
    if (!user) return;
    const { data } = await supabase
      .from("mod_ratings")
      .select("rating")
      .eq("mod_id", modId)
      .eq("user_id", user.id)
      .single();
    setUserRating(data?.rating ?? null);
  }

  async function fetchAvgRating() {
    const { data } = await supabase
      .from("mod_ratings")
      .select("rating")
      .eq("mod_id", modId);
    if (data && data.length > 0) {
      const avg =
        data.reduce((acc, r) => acc + (r.rating || 0), 0) / data.length;
      setAvgRating(avg);
    } else {
      setAvgRating(0);
    }
  }

  async function handleRate(rating: number) {
    if (!user) return;
    setUserRating(rating);
    await supabase.from("mod_ratings").upsert(
      [
        {
          mod_id: modId,
          user_id: user.id,
          rating,
        },
      ],
      { onConflict: "mod_id,user_id" }
    );
    fetchAvgRating();
  }

  return (
    <div className="flex flex-col items-start gap-1">
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => handleRate(star)}
            className={
              star <= (userRating ?? Math.round(avgRating))
                ? "text-yellow-400 hover:scale-110 transition-transform"
                : "text-muted-foreground hover:text-yellow-400 hover:scale-110 transition-transform"
            }
            aria-label={`Donner ${star} étoile${star > 1 ? "s" : ""}`}
          >
            <Star
              className="w-6 h-6"
              fill={
                star <= (userRating ?? Math.round(avgRating))
                  ? "currentColor"
                  : "none"
              }
            />
          </button>
        ))}
        <span className="ml-2 text-sm text-muted-foreground">
          {avgRating ? avgRating.toFixed(1) : "0.0"}/5
        </span>
      </div>
      {user && (
        <span className="text-xs text-muted-foreground">
          Ma note : {userRating ? userRating + "★" : "Non noté"}
        </span>
      )}
    </div>
  );
}
