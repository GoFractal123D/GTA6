"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "./AuthProvider";
import CommentSection from "./CommentSection";
import VoteButton from "./VoteButton";

export default function ModDetail({ modId }: { modId: number }) {
  const [mod, setMod] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMod();
  }, [modId]);

  async function fetchMod() {
    setLoading(true);
    const { data } = await supabase
      .from("mods")
      .select("*, author:profiles(username)")
      .eq("id", modId)
      .single();
    setMod(data);
    setLoading(false);
  }

  if (loading) return <div>Chargement...</div>;
  if (!mod) return <div>Mod introuvable</div>;
  return (
    <div>
      <h2>{mod.title}</h2>
      <p>{mod.description}</p>
      <p>Par {mod.author?.username || "Inconnu"}</p>
      <VoteButton targetType="mod" targetId={mod.id} />
      <CommentSection modId={mod.id} />
    </div>
  );
}
