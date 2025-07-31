"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import VoteButton from "./VoteButton";
import CommentSection from "./CommentSection";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

const TYPE_LABELS = {
  guide: "Guide",
  theory: "Théorie",
  rp: "RP",
  event: "Événement",
};

export default function CommunityFeed() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeed();
  }, []);

  async function fetchFeed() {
    setLoading(true);
    try {
      console.log("Récupération des posts de la communauté...");

      // Récupérer les posts sans jointure (la table profiles n'existe pas ou n'est pas liée)
      const { data, error } = await supabase
        .from("community")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Erreur lors de la récupération des posts:", error);
        setItems([]);
      } else {
        console.log("Posts récupérés:", data);
        console.log("Détail du premier post:", data[0]);
        console.log("TYPE_LABELS disponibles:", Object.keys(TYPE_LABELS));
        console.log("Type du premier post:", data[0]?.type);
        console.log(
          "Est-ce que le type existe dans TYPE_LABELS?",
          TYPE_LABELS[data[0]?.type]
        );
        setItems(data || []);
      }
    } catch (error) {
      console.error("Exception lors de la récupération des posts:", error);
      setItems([]);
    } finally {
      setLoading(false);
    }
  }

  if (loading)
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <span>Chargement des publications...</span>
        </div>
      </div>
    );

  console.log("État actuel - items:", items);
  console.log("Nombre d'items:", items.length);
  console.log("Items est un array?", Array.isArray(items));

  if (!items.length)
    return (
      <div className="text-center py-12">
        <div className="text-muted-foreground mb-4">
          Aucun contenu pour le moment.
        </div>
        <Button onClick={fetchFeed} variant="outline" size="sm">
          <RefreshCw className="w-4 h-4 mr-2" />
          Actualiser
        </Button>
      </div>
    );

  return (
    <div className="space-y-6">
      {/* En-tête avec bouton de rafraîchissement */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Publications récentes</h2>
        <Button onClick={fetchFeed} variant="outline" size="sm">
          <RefreshCw className="w-4 h-4 mr-2" />
          Actualiser
        </Button>
      </div>

      {/* Debug temporaire */}
      <div className="bg-yellow-100 p-4 rounded-lg border">
        <h3 className="font-bold mb-2">Debug Info:</h3>
        <p>Nombre d'items: {items.length}</p>
        <p>Items: {JSON.stringify(items, null, 2)}</p>
      </div>

      {/* Liste des publications */}
      <div className="flex flex-col gap-6">
        {items.map((item, index) => {
          console.log(`Rendu de l'item ${index}:`, item);
          return (
            <div
              key={item.id}
              className="bg-card/80 shadow-smooth rounded-xl p-6 animate-fade-in"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-0.5 rounded bg-primary text-primary-foreground text-xs font-semibold">
                  {TYPE_LABELS[item.type] || item.type}
                </span>
                <span className="text-sm text-muted-foreground">
                  par {item.author_id}
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
          );
        })}
      </div>
    </div>
  );
}
