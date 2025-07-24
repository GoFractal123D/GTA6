"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "./AuthProvider";

const TYPES = [
  { value: "guide", label: "Guide" },
  { value: "video", label: "Vidéo" },
  { value: "theory", label: "Théorie" },
];

export default function CommunityForm() {
  const { user } = useAuth();
  const [type, setType] = useState("guide");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    let fileUrl = "";
    if (file) {
      const { data, error: uploadError } = await supabase.storage
        .from("community-uploads")
        .upload(`${user.id}/${Date.now()}_${file.name}`, file);
      if (uploadError) {
        setError("Erreur upload fichier");
        setLoading(false);
        return;
      }
      fileUrl = data?.path || "";
    }
    const { error: insertError } = await supabase.from("community").insert({
      author_id: user.id,
      type,
      title,
      content,
      file_url: fileUrl,
    });
    if (insertError) setError(insertError.message);
    else {
      setTitle("");
      setContent("");
      setFile(null);
      setSuccess("Contenu publié !");
    }
    setLoading(false);
  };

  if (!user)
    return (
      <div className="text-center text-muted-foreground">
        Connecte-toi pour publier du contenu.
      </div>
    );

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-card/80 shadow-smooth rounded-xl p-6 flex flex-col gap-4 animate-fade-in"
    >
      <div className="flex gap-2">
        {TYPES.map((t) => (
          <button
            key={t.value}
            type="button"
            className={`px-3 py-1 rounded-lg font-medium border ${
              type === t.value
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground"
            } transition-colors`}
            onClick={() => setType(t.value)}
          >
            {t.label}
          </button>
        ))}
      </div>
      <input
        className="rounded-lg border border-border bg-background px-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-primary"
        placeholder="Titre du contenu"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <textarea
        className="rounded-lg border border-border bg-background px-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-primary min-h-[80px]"
        placeholder="Contenu, description, lien vidéo, etc."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        required
      />
      <input
        type="file"
        accept="image/*,video/*"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />
      <button
        type="submit"
        disabled={loading}
        className="w-full py-2 rounded-lg bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white font-semibold shadow-smooth hover:opacity-90 transition-all focus:outline-none focus:ring-2 focus:ring-primary"
      >
        {loading ? "Publication..." : "Publier"}
      </button>
      {error && <div className="text-red-500 text-sm">{error}</div>}
      {success && <div className="text-green-600 text-sm">{success}</div>}
    </form>
  );
}
