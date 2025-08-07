"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "./AuthProvider";
import { useRouter } from "next/navigation";
import {
  Users,
  Trophy,
  Calendar,
  Star,
  TrendingUp,
  Heart,
  MessageCircle,
  Share2,
  Search,
  Filter,
  Bookmark,
} from "lucide-react";

const TYPE_LABELS = {
  guide: "Guide",
  theory: "Théorie",
  rp: "RP",
  event: "Événement",
};

export default function CommunityFeed() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    fetchFeed();
  }, [user]); // Recharger quand l'utilisateur change

  // Fonction pour naviguer vers la page de détail
  const handleCardClick = (postId: number) => {
    router.push(`/community/${postId}`);
  };

  // Fonction pour empêcher la propagation lors du clic sur les boutons
  const handleButtonClick = (e: React.MouseEvent, action: () => void) => {
    e.stopPropagation();
    action();
  };

  // Fonction pour gérer les likes
  const handleLike = async (postId: number) => {
    if (!user) {
      toast.error("Vous devez être connecté pour liker");
      return;
    }

    try {
      // Vérifier si l'utilisateur a déjà liké
      const { data: existingLike } = await supabase
        .from("post")
        .select("*")
        .eq("post_id", postId)
        .eq("user_id", user.id)
        .eq("action_type", "like")
        .single();

      if (existingLike) {
        // Supprimer le like
        await supabase.from("post").delete().eq("id", existingLike.id);

        setItems((prev) =>
          prev.map((item) =>
            item.id === postId
              ? {
                  ...item,
                  likes: Math.max(0, (item.likes || 0) - 1),
                  userHasLiked: false,
                }
              : item
          )
        );
        toast.success("Like retiré");
      } else {
        // Ajouter le like
        await supabase.from("post").insert({
          user_id: user.id,
          post_id: postId,
          action_type: "like",
        });

        setItems((prev) =>
          prev.map((item) =>
            item.id === postId
              ? {
                  ...item,
                  likes: (item.likes || 0) + 1,
                  userHasLiked: true,
                }
              : item
          )
        );
        toast.success("Post liké !");
      }
    } catch (error) {
      console.error("Erreur lors du like:", error);
      toast.error("Erreur lors du like");
    }
  };

  // Fonction pour gérer les commentaires
  const handleComment = async (postId: number) => {
    if (!user) {
      toast.error("Vous devez être connecté pour commenter");
      return;
    }

    try {
      // Pour le moment, juste afficher un message
      toast.success("Fonctionnalité commentaire à venir !");
    } catch (error) {
      console.error("Erreur lors du commentaire:", error);
      toast.error("Erreur lors du commentaire");
    }
  };

  // Fonction pour gérer les partages
  const handleShare = async (postId: number) => {
    if (!user) {
      toast.error("Vous devez être connecté pour partager");
      return;
    }

    try {
      // Pour le moment, juste afficher un message
      toast.success("Fonctionnalité partage à venir !");
    } catch (error) {
      console.error("Erreur lors du partage:", error);
      toast.error("Erreur lors du partage");
    }
  };

  // Fonction pour gérer les favoris
  const handleFavorite = async (postId: number) => {
    if (!user) {
      toast.error("Vous devez être connecté pour sauvegarder");
      return;
    }

    try {
      // Vérifier si l'utilisateur a déjà mis en favori
      const { data: existingFavorite } = await supabase
        .from("post")
        .select("*")
        .eq("post_id", postId)
        .eq("user_id", user.id)
        .eq("action_type", "favorite")
        .single();

      if (existingFavorite) {
        // Supprimer le favori
        await supabase.from("post").delete().eq("id", existingFavorite.id);

        setItems((prev) =>
          prev.map((item) =>
            item.id === postId ? { ...item, favorite: false } : item
          )
        );
        toast.success("Retiré des favoris");
      } else {
        // Ajouter le favori
        await supabase.from("post").insert({
          user_id: user.id,
          post_id: postId,
          action_type: "favorite",
        });

        setItems((prev) =>
          prev.map((item) =>
            item.id === postId ? { ...item, favorite: true } : item
          )
        );
        toast.success("Ajouté aux favoris !");
      }
    } catch (error) {
      console.error("Erreur lors du favori:", error);
      toast.error("Erreur lors de la sauvegarde");
    }
  };

  async function fetchFeed() {
    setLoading(true);
    try {
      console.log("[CommunityFeed] Début de la récupération des posts");

      // Récupérer les publications de la table community
      const { data: posts, error: postsError } = await supabase
        .from("community")
        .select("*")
        .order("created_at", { ascending: false });

      if (postsError) {
        console.error(
          "[CommunityFeed] Erreur lors de la récupération des posts:",
          postsError
        );
        toast.error("Erreur lors du chargement des publications");
        setItems([]);
        return;
      }

      console.log("[CommunityFeed] Posts récupérés:", posts?.length || 0);

      // Pour chaque publication, récupérer les statistiques d'interaction
      const postsWithStats = await Promise.all(
        (posts || []).map(async (post) => {
          try {
            // Récupérer les likes
            const { count: likes, error: likesError } = await supabase
              .from("post")
              .select("*", { count: "exact", head: true })
              .eq("post_id", post.id)
              .eq("action_type", "like");

            if (likesError) {
              console.error(
                "[CommunityFeed] Erreur likes pour post",
                post.id,
                ":",
                likesError
              );
            }

            // Récupérer les commentaires
            const { count: comments, error: commentsError } = await supabase
              .from("community_comments")
              .select("*", { count: "exact", head: true })
              .eq("post_id", post.id);

            if (commentsError) {
              console.error(
                "[CommunityFeed] Erreur commentaires pour post",
                post.id,
                ":",
                commentsError
              );
            }

            // Récupérer les partages
            const { count: shares, error: sharesError } = await supabase
              .from("post")
              .select("*", { count: "exact", head: true })
              .eq("post_id", post.id)
              .eq("action_type", "share");

            if (sharesError) {
              console.error(
                "[CommunityFeed] Erreur partages pour post",
                post.id,
                ":",
                sharesError
              );
            }

            // Vérifier les interactions de l'utilisateur actuel (seulement si connecté)
            let userHasLiked = false;
            let isFavorited = false;

            if (user) {
              try {
                // Vérifier si l'utilisateur a liké
                const { data: userLike, error: userLikeError } = await supabase
                  .from("post")
                  .select("*")
                  .eq("post_id", post.id)
                  .eq("user_id", user.id)
                  .eq("action_type", "like")
                  .single();

                if (userLikeError && userLikeError.code !== "PGRST116") {
                  console.error(
                    "[CommunityFeed] Erreur vérification like utilisateur:",
                    userLikeError
                  );
                }
                userHasLiked = !!userLike;

                // Vérifier si l'utilisateur a mis en favori
                const { data: userFavorite, error: userFavoriteError } =
                  await supabase
                    .from("post")
                    .select("*")
                    .eq("post_id", post.id)
                    .eq("user_id", user.id)
                    .eq("action_type", "favorite")
                    .single();

                if (
                  userFavoriteError &&
                  userFavoriteError.code !== "PGRST116"
                ) {
                  console.error(
                    "[CommunityFeed] Erreur vérification favori utilisateur:",
                    userFavoriteError
                  );
                }
                isFavorited = !!userFavorite;
              } catch (error) {
                // Erreur normale si l'utilisateur n'a pas d'interactions
                console.log(
                  "[CommunityFeed] Aucune interaction trouvée pour cet utilisateur"
                );
              }
            }

            return {
              ...post,
              likes: likes || 0,
              comments: comments || 0,
              share: shares || 0,
              favorite: isFavorited,
              userHasLiked: userHasLiked,
            };
          } catch (error) {
            console.error(
              "[CommunityFeed] Erreur lors du traitement du post",
              post.id,
              ":",
              error
            );
            return {
              ...post,
              likes: 0,
              comments: 0,
              share: 0,
              favorite: false,
              userHasLiked: false,
            };
          }
        })
      );

      console.log(
        "[CommunityFeed] Posts avec statistiques:",
        postsWithStats.length
      );
      setItems(postsWithStats);
    } catch (error) {
      console.error(
        "[CommunityFeed] Exception lors de la récupération des posts:",
        error
      );
      toast.error("Erreur lors du chargement des publications");
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
    <div className="space-y-6" style={{ position: "relative", zIndex: 1000 }}>
      {/* En-tête avec bouton de rafraîchissement */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
            Publications récentes
          </h2>
          <p className="text-muted-foreground mt-1">
            Découvrez les derniers contenus de la communauté
          </p>
        </div>
        <Button
          onClick={fetchFeed}
          variant="outline"
          size="sm"
          className="bg-background/80 backdrop-blur-sm border-border/50 hover:border-primary/50 hover:bg-primary/5 transition-all duration-200"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Actualiser
        </Button>
      </div>

      {/* Liste des publications */}
      <div className="flex flex-col gap-8">
        {items.map((item, index) => {
          return (
            <article
              key={item.id}
              className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-card/90 to-card/70 backdrop-blur-xl border border-border/50 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-[1.02] hover:border-primary/30 animate-fade-in cursor-pointer"
              style={{
                position: "relative",
                zIndex: 1001,
                animationDelay: `${index * 100}ms`,
                animationFillMode: "both",
              }}
              onClick={() => handleCardClick(item.id)}
            >
              {/* En-tête de la carte */}
              <div className="p-6 pb-4">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wide ${
                          item.type === "guide"
                            ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                            : item.type === "theory"
                            ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                            : item.type === "rp"
                            ? "bg-green-500/20 text-green-400 border border-green-500/30"
                            : "bg-purple-500/20 text-purple-400 border border-purple-500/30"
                        }`}
                      >
                        {TYPE_LABELS[item.type] || item.type}
                      </span>
                      <div className="w-1 h-1 rounded-full bg-muted-foreground/50"></div>
                      <span className="text-sm text-muted-foreground font-medium">
                        {new Date(item.created_at).toLocaleDateString("fr-FR", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                      <span className="text-xs font-semibold text-primary">
                        {item.author_id?.slice(0, 2).toUpperCase()}
                      </span>
                    </div>
                    <span className="text-sm text-muted-foreground font-medium">
                      {item.author_id?.slice(0, 8)}...
                    </span>
                  </div>
                </div>

                {/* Titre */}
                <h2 className="text-2xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors duration-300">
                  {item.title}
                </h2>

                {/* Contenu */}
                <div className="prose prose-sm max-w-none">
                  <p className="text-muted-foreground leading-relaxed line-clamp-3">
                    {item.content}
                  </p>
                </div>
              </div>

              {/* Média */}
              {item.file_url && (
                <div className="relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent z-10"></div>
                  {item.file_url.match(/\.(mp4|webm)$/) ? (
                    <video
                      src={
                        supabase.storage
                          .from("community-uploads")
                          .getPublicUrl(item.file_url).data.publicUrl
                      }
                      controls
                      className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <img
                      src={
                        supabase.storage
                          .from("community-uploads")
                          .getPublicUrl(item.file_url).data.publicUrl
                      }
                      alt="media"
                      className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  )}
                </div>
              )}

              {/* Actions et interactions */}
              <div className="p-6 pt-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={(e) =>
                        handleButtonClick(e, () => handleLike(item.id))
                      }
                      className={`flex items-center gap-2 text-sm transition-colors duration-200 ${
                        item.userHasLiked
                          ? "text-red-500 hover:text-red-600"
                          : "text-muted-foreground hover:text-primary"
                      }`}
                    >
                      <svg
                        className={`w-4 h-4 transition-all duration-200 ${
                          item.userHasLiked ? "fill-current" : ""
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
                        />
                      </svg>
                      {item.likes || 0}
                    </button>
                    <button
                      onClick={(e) =>
                        handleButtonClick(e, () => handleComment(item.id))
                      }
                      className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors duration-200"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                        />
                      </svg>
                      {item.comments || 0}
                    </button>
                    <button
                      onClick={(e) =>
                        handleButtonClick(e, () => handleShare(item.id))
                      }
                      className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors duration-200"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
                        />
                      </svg>
                      {item.share || 0}
                    </button>
                  </div>
                  <button
                    onClick={(e) =>
                      handleButtonClick(e, () => handleFavorite(item.id))
                    }
                    className={`flex items-center gap-2 text-sm transition-colors duration-200 ${
                      item.favorite
                        ? "text-yellow-500 hover:text-yellow-600"
                        : "text-muted-foreground hover:text-primary"
                    }`}
                  >
                    <Bookmark
                      className={`w-4 h-4 transition-all duration-200 ${
                        item.favorite ? "fill-current" : ""
                      }`}
                    />
                    {item.favorite ? "Favori" : "Sauvegarder"}
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
