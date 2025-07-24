"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "./AuthProvider";

export default function ModForm({
  onModCreated,
}: {
  onModCreated?: () => void;
}) {
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    console.log("Tentative d'insertion :", {
      title,
      description,
      author_id: user?.id,
    });
    const { data, error } = await supabase.from("mods").insert({
      title,
      description,
      author_id: user?.id,
    });
    setLoading(false);
    console.log("Résultat insertion mod :", { data, error });
    if (error) {
      setError(error.message);
      alert("Erreur Supabase : " + error.message);
    } else {
      alert("Mod publié avec succès !");
      setTitle("");
      setDescription("");
      onModCreated?.();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Titre du mod"
        required
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description"
        required
      />
      <button type="submit" disabled={loading}>
        Publier
      </button>
      {error && <div style={{ color: "red" }}>{error}</div>}
    </form>
  );
}
