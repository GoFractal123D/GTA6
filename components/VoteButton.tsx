"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "./AuthProvider";

export default function VoteButton({
  targetType,
  targetId,
}: {
  targetType: "mod" | "comment";
  targetId: number;
}) {
  const { user } = useAuth();
  const [score, setScore] = useState(0);
  const [userVote, setUserVote] = useState<"up" | "down" | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchVotes();
  }, [targetId, user]);

  async function fetchVotes() {
    // Total score
    const { data: votes } = await supabase
      .from("votes")
      .select("*")
      .eq("target_type", targetType)
      .eq("target_id", targetId);
    setScore(
      (votes || []).reduce((acc, v) => acc + (v.vote_type === "up" ? 1 : -1), 0)
    );
    // User vote
    if (user) {
      const { data: myVote } = await supabase
        .from("votes")
        .select("*")
        .eq("target_type", targetType)
        .eq("target_id", targetId)
        .eq("user_id", user.id)
        .single();
      setUserVote(myVote?.vote_type ?? null);
    }
  }

  async function handleVote(type: "up" | "down") {
    if (!user) return;
    setLoading(true);
    // Upsert vote (anti-double vote)
    await supabase.from("votes").upsert(
      {
        user_id: user.id,
        target_type: targetType,
        target_id: targetId,
        vote_type: type,
      },
      { onConflict: ["user_id", "target_type", "target_id"] }
    );
    fetchVotes();
    setLoading(false);
  }

  return (
    <div>
      <button
        onClick={() => handleVote("up")}
        disabled={loading || userVote === "up"}
      >
        👍
      </button>
      <span>{score}</span>
      <button
        onClick={() => handleVote("down")}
        disabled={loading || userVote === "down"}
      >
        👎
      </button>
    </div>
  );
}
