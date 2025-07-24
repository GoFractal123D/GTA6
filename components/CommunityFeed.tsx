"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import VoteButton from "./VoteButton";
import CommentSection from "./CommentSection";

const TYPE_LABELS = {
  guide: "Guide",
  video: "Vidéo",
  theory: "Théorie",
};

export default function CommunityFeed() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeed();
  }, []);

  async function fetchFeed() {
    setLoading(true);
    const { data } = await supabase
      .from("community")
      .select("*, author:profiles(username)")
      .order("created_at", { ascending: false });
    setItems(data || []);
    setLoading(false);
  }

  if (loading) return <div>Chargement...</div>;
  if (!items.length)
    return (
      <div className="text-center text-muted-foreground">
        Aucun contenu pour le moment.
      </div>
    );

  return (
    <div className="flex flex-col gap-6">
      {items.map((item) => (
        <div
          key={item.id}
          className="bg-card/80 shadow-smooth rounded-xl p-6 animate-fade-in"
        >
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2 py-0.5 rounded bg-primary text-primary-foreground text-xs font-semibold">
              {TYPE_LABELS[item.type]}
            </span>
            <span className="text-sm text-muted-foreground">
              par {item.author?.username || "Inconnu"}
            </span>
          </div>
          <h3 className="text-lg font-bold mb-2">{item.title}</h3>
          <div className="mb-2 whitespace-pre-line text-base">
            {item.content}
          </div>
          {item.file_url && (
            <div className="mb-2">
              {item.file_url.match(/\.(mp4|webm)$/) ? (
                <video
                  src={
                    supabase.storage
                      .from("community-uploads")
                      .getPublicUrl(item.file_url).data.publicUrl
                  }
                  controls
                  className="rounded-lg max-h-64 w-full object-cover"
                />
              ) : (
                <img
                  src={
                    supabase.storage
                      .from("community-uploads")
                      .getPublicUrl(item.file_url).data.publicUrl
                  }
                  alt="media"
                  className="rounded-lg max-h-64 w-full object-cover"
                />
              )}
            </div>
          )}
          <div className="flex items-center gap-4 mt-2">
            <VoteButton targetType="community" targetId={item.id} />
          </div>
          <div className="mt-4">
            <CommentSection modId={item.id} />
          </div>
        </div>
      ))}
    </div>
  );
}
