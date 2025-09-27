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
    try {
      const { data, error } = await supabase
        .from("mod_ratings")
        .select("rating")
        .eq("mod_id", modId)
        .eq("user_id", user.id)
        .single();

      if (error && error.code !== "PGRST116") {
        // PGRST116 = no rows returned
        console.warn(
          "Erreur lors de la récupération de la note utilisateur:",
          error
        );
        return;
      }

      setUserRating(data?.rating ?? null);
    } catch (err) {
      console.warn("Erreur réseau lors de la récupération de la note:", err);
    }
  }

  async function fetchAvgRating() {
    try {
      const { data, error } = await supabase
        .from("mod_ratings")
        .select("rating")
        .eq("mod_id", modId);

      if (error) {
        console.warn(
          "Erreur lors de la récupération des notes moyennes:",
          error
        );
        setAvgRating(0);
        return;
      }

      if (data && data.length > 0) {
        const avg =
          data.reduce((acc, r) => acc + (r.rating || 0), 0) / data.length;
        setAvgRating(avg);
      } else {
        setAvgRating(0);
      }
    } catch (err) {
      console.warn("Erreur réseau lors de la récupération des notes:", err);
      setAvgRating(0);
    }
  }

  async function handleRate(rating: number) {
    if (!user) return;
    setUserRating(rating);
    try {
      const { error } = await supabase.from("mod_ratings").upsert(
        [
          {
            mod_id: modId,
            user_id: user.id,
            rating,
          },
        ],
        { onConflict: "mod_id,user_id" }
      );

      if (error) {
        console.error("Erreur lors de la sauvegarde de la note:", error);
        // Revenir à l'ancienne valeur en cas d'erreur
        fetchUserRating();
      } else {
        fetchAvgRating();
      }
    } catch (err) {
      console.error("Erreur réseau lors de la sauvegarde:", err);
      // Revenir à l'ancienne valeur en cas d'erreur
      fetchUserRating();
    }
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
