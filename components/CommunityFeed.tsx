"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "./AuthProvider";
import { useRouter } from "next/navigation";
import AdminBadge from "./AdminBadge";
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

function ProfileAvatar({
  profile,
  userId,
  size = "w-6 h-6",
  textSize = "text-xs",
}: {
  profile?: { username?: string; avatar_url?: string } | null;
  userId?: string;
  size?: string;
  textSize?: string;
}) {
  const displayName = profile?.username || userId || "?";
  const initials = displayName.slice(0, 2).toUpperCase();

  if (profile?.avatar_url) {
    return (
      <img
        src={profile.avatar_url}
        alt={displayName}
        className={`${size} rounded-full object-cover`}
        onError={(e) => {
          // Si l'image ne se charge pas, remplacer par les initiales
          const target = e.target as HTMLImageElement;
          const parent = target.parentElement;
          if (parent) {
            parent.innerHTML = `
              <div class="${size} rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                <span class="${textSize} font-semibold text-primary">
                  ${initials}
                </span>
              </div>
            `;
          }
        }}
      />
    );
  }

  return (
    <div
      className={`${size} rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center`}
    >
      <span className={`${textSize} font-semibold text-primary`}>
        {initials}
      </span>
    </div>
  );
}

interface CommunityFeedProps {
  searchQuery?: string;
  selectedCategory?: string;
}

export default function CommunityFeed({
  searchQuery = "",
  selectedCategory = "all",
}: CommunityFeedProps) {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false); // Ne pas charger par défaut
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const { user, userProfile } = useAuth();
  const router = useRouter();

  useEffect(() => {
    fetchFeed();
  }, [user, searchQuery, selectedCategory]); // Recharger quand l'utilisateur change ou les filtres

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
    // Système de cache pour les publications
    const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
    const CACHE_KEY = `community_feed_cache_${selectedCategory}_${searchQuery}`;
    const CACHE_VERSION = "v1";

    // Vérifier le cache d'abord
    try {
      const cachedData = localStorage.getItem(CACHE_KEY);
      if (cachedData) {
        const { data, timestamp, version } = JSON.parse(cachedData);
        const isValid = Date.now() - timestamp < CACHE_DURATION;
        const isCorrectVersion = version === CACHE_VERSION;

        if (isValid && isCorrectVersion) {
          console.log(
            "[CommunityFeed] Utilisation du cache pour les publications"
          );
          setItems(data);
          setIsInitialLoad(false);
          return; // Sortir ici, pas de loading nécessaire
        } else {
          console.log(
            "[CommunityFeed] Cache expiré, rechargement des publications"
          );
          localStorage.removeItem(CACHE_KEY);
        }
      } else {
        console.log(
          "[CommunityFeed] Aucun cache trouvé, chargement des publications"
        );
      }
    } catch (error) {
      console.warn(
        "[CommunityFeed] Erreur lors de la lecture du cache:",
        error
      );
      localStorage.removeItem(CACHE_KEY);
    }

    // Seulement ici, afficher le loading car on va faire des requêtes réseau
    setLoading(true);
    try {
      console.log("[CommunityFeed] Début de la récupération des posts");

      // Récupérer les publications de la table community avec filtrage
      let query = supabase.from("community").select("*");

      // Filtrage par catégorie
      if (selectedCategory !== "all") {
        query = query.eq("type", selectedCategory);
      }

      // Filtrage par recherche textuelle
      if (searchQuery.trim()) {
        query = query.or(
          `title.ilike.%${searchQuery}%,content.ilike.%${searchQuery}%`
        );
      }

      const { data: posts, error: postsError } = await query.order(
        "created_at",
        { ascending: false }
      );

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

      // Récupérer tous les IDs d'utilisateurs uniques
      const userIds = [...new Set((posts || []).map((post) => post.author_id))];

      // Récupérer les profils utilisateurs en une seule requête avec avatars
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("id, username, avatar_url")
        .in("id", userIds);

      if (profilesError) {
        console.error(
          "[CommunityFeed] Erreur lors de la récupération des profils:",
          profilesError
        );
      }

      // Créer un map pour un accès rapide aux profils
      const profilesMap = new Map();
      (profiles || []).forEach((profile) => {
        profilesMap.set(profile.id, profile);
      });

      // Récupérer toutes les statistiques en une seule requête optimisée
      const postIds = (posts || []).map((post) => post.id);

      if (postIds.length === 0) {
        setItems([]);
        return;
      }

      // Requête optimisée pour toutes les statistiques
      const [
        likesResult,
        commentsResult,
        sharesResult,
        userInteractionsResult,
      ] = await Promise.all([
        // Likes pour tous les posts
        supabase
          .from("post")
          .select("post_id, action_type")
          .in("post_id", postIds)
          .eq("action_type", "like"),

        // Commentaires pour tous les posts
        supabase
          .from("community_comments")
          .select("post_id")
          .in("post_id", postIds),

        // Partages pour tous les posts
        supabase
          .from("post")
          .select("post_id, action_type")
          .in("post_id", postIds)
          .eq("action_type", "share"),

        // Interactions de l'utilisateur actuel
        user
          ? supabase
              .from("post")
              .select("post_id, action_type")
              .in("post_id", postIds)
              .eq("user_id", user.id)
              .in("action_type", ["like", "favorite"])
          : Promise.resolve({ data: [] }),
      ]);

      // Créer des maps pour un accès rapide aux statistiques
      const likesMap = new Map();
      const commentsMap = new Map();
      const sharesMap = new Map();
      const userLikesMap = new Map();
      const userFavoritesMap = new Map();

      // Traiter les likes
      (likesResult.data || []).forEach((like) => {
        likesMap.set(like.post_id, (likesMap.get(like.post_id) || 0) + 1);
      });

      // Traiter les commentaires
      (commentsResult.data || []).forEach((comment) => {
        commentsMap.set(
          comment.post_id,
          (commentsMap.get(comment.post_id) || 0) + 1
        );
      });

      // Traiter les partages
      (sharesResult.data || []).forEach((share) => {
        sharesMap.set(share.post_id, (sharesMap.get(share.post_id) || 0) + 1);
      });

      // Traiter les interactions utilisateur
      (userInteractionsResult.data || []).forEach((interaction) => {
        if (interaction.action_type === "like") {
          userLikesMap.set(interaction.post_id, true);
        } else if (interaction.action_type === "favorite") {
          userFavoritesMap.set(interaction.post_id, true);
        }
      });

      // Assembler les données finales
      const postsWithStats = (posts || []).map((post) => ({
        ...post,
        profiles: profilesMap.get(post.author_id),
        likes: likesMap.get(post.id) || 0,
        comments: commentsMap.get(post.id) || 0,
        share: sharesMap.get(post.id) || 0,
        userHasLiked: userLikesMap.get(post.id) || false,
        favorite: userFavoritesMap.get(post.id) || false,
      }));

      console.log(
        "[CommunityFeed] Posts avec statistiques:",
        postsWithStats.length
      );
      setItems(postsWithStats);
      setIsInitialLoad(false);

      // Sauvegarder dans le cache
      try {
        const cacheData = {
          data: postsWithStats,
          timestamp: Date.now(),
          version: CACHE_VERSION,
        };
        localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
        console.log("[CommunityFeed] Données sauvegardées dans le cache");
      } catch (error) {
        console.warn(
          "[CommunityFeed] Erreur lors de la sauvegarde du cache:",
          error
        );
      }
    } catch (error) {
      console.error(
        "[CommunityFeed] Exception lors de la récupération des posts:",
        error
      );
      toast.error("Erreur lors du chargement des publications");
      setItems([]);
      setIsInitialLoad(false);
    } finally {
      setLoading(false);
    }
  }

  if (isInitialLoad)
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
          {searchQuery || selectedCategory !== "all" ? (
            <>
              Aucun résultat trouvé pour{" "}
              {selectedCategory !== "all" &&
                `la catégorie "${
                  TYPE_LABELS[selectedCategory as keyof typeof TYPE_LABELS]
                }"`}
              {searchQuery && selectedCategory !== "all" && " et "}
              {searchQuery && `la recherche "${searchQuery}"`}.
            </>
          ) : (
            "Aucun contenu pour le moment."
          )}
        </div>
        <Button
          onClick={() => {
            // Vider le cache et recharger
            const CACHE_KEY = `community_feed_cache_${selectedCategory}_${searchQuery}`;
            localStorage.removeItem(CACHE_KEY);
            setIsInitialLoad(true);
            fetchFeed();
          }}
          variant="outline"
          size="sm"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Actualiser
        </Button>
      </div>
    );

  return (
    <div className="space-y-6" style={{ position: "relative", zIndex: 10 }}>
      {/* En-tête avec bouton de rafraîchissement */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent text-white">
            Publications récentes
          </h2>
          <p className="text-muted-foreground mt-1 text-white">
            {items.length} publication{items.length > 1 ? "s" : ""} trouvée
            {items.length > 1 ? "s" : ""}
            {searchQuery || selectedCategory !== "all"
              ? " avec les filtres actifs"
              : ""}
          </p>
        </div>
        <Button
          onClick={() => {
            // Vider le cache et recharger
            const CACHE_KEY = `community_feed_cache_${selectedCategory}_${searchQuery}`;
            localStorage.removeItem(CACHE_KEY);
            setIsInitialLoad(true);
            fetchFeed();
          }}
          variant="outline"
          size="sm"
          className="bg-background/80 backdrop-blur-sm border-border/50 hover:border-primary/50 hover:bg-primary/5 transition-all duration-200"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Actualiser
        </Button>
      </div>

      {/* Liste des publications */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {items.map((item, index) => {
          return (
            <article
              key={item.id}
              className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-card/90 to-card/70 backdrop-blur-xl border border-border/50 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-[1.02] hover:border-primary/30 animate-fade-in cursor-pointer h-full flex flex-col"
              style={{
                position: "relative",
                zIndex: 1001,
                animationDelay: `${index * 100}ms`,
                animationFillMode: "both",
              }}
              onClick={() => handleCardClick(item.id)}
            >
              {/* En-tête de la carte */}
              <div className="p-4 pb-3 flex-shrink-0">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold uppercase tracking-wide ${
                        item.type === "guide"
                          ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                          : item.type === "theory"
                          ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                          : item.type === "rp"
                          ? "bg-green-500/20 text-green-400 border border-green-500/30"
                          : "bg-purple-500/20 text-purple-400 border border-purple-500/30"
                      }`}
                    >
                      {TYPE_LABELS[item.type as keyof typeof TYPE_LABELS] ||
                        item.type}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <ProfileAvatar
                      profile={item.profiles}
                      userId={item.author_id}
                      size="w-6 h-6"
                      textSize="text-xs"
                    />
                    {user &&
                      item.author_id === user.id &&
                      userProfile?.role &&
                      userProfile.role !== "user" && (
                        <AdminBadge role={userProfile.role} size="sm" />
                      )}
                  </div>
                </div>

                {/* Titre */}
                <h2 className="text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors duration-300 line-clamp-2">
                  {item.title}
                </h2>

                {/* Date */}
                <span className="text-xs text-muted-foreground font-medium">
                  {new Date(item.created_at).toLocaleDateString("fr-FR", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </div>

              {/* Média */}
              {item.file_url && (
                <div className="relative overflow-hidden flex-shrink-0">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent z-10"></div>
                  {item.file_url.match(/\.(mp4|webm)$/) ? (
                    <video
                      src={
                        supabase.storage
                          .from("community-uploads")
                          .getPublicUrl(item.file_url).data.publicUrl
                      }
                      controls
                      className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <img
                      src={
                        supabase.storage
                          .from("community-uploads")
                          .getPublicUrl(item.file_url).data.publicUrl
                      }
                      alt="media"
                      className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  )}
                </div>
              )}

              {/* Contenu */}
              <div className="p-4 pb-3 flex-grow">
                <div className="prose prose-sm max-w-none">
                  <p className="text-muted-foreground leading-relaxed line-clamp-3 text-sm">
                    {item.content}
                  </p>
                </div>
              </div>

              {/* Actions et interactions */}
              <div className="p-4 pt-2 flex-shrink-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={(e) =>
                        handleButtonClick(e, () => handleLike(item.id))
                      }
                      className={`flex items-center gap-1 text-xs transition-colors duration-200 ${
                        item.userHasLiked
                          ? "text-red-500 hover:text-red-600"
                          : "text-muted-foreground hover:text-primary"
                      }`}
                    >
                      <svg
                        className={`w-3 h-3 transition-all duration-200 ${
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
                      className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors duration-200"
                    >
                      <svg
                        className="w-3 h-3"
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
                      className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors duration-200"
                    >
                      <svg
                        className="w-3 h-3"
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
                    className={`flex items-center gap-1 text-xs transition-colors duration-200 ${
                      item.favorite
                        ? "text-yellow-500 hover:text-yellow-600"
                        : "text-muted-foreground hover:text-primary"
                    }`}
                  >
                    <Bookmark
                      className={`w-3 h-3 transition-all duration-200 ${
                        item.favorite ? "fill-current" : ""
                      }`}
                    />
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
