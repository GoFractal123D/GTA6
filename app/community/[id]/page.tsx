"use client";
import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/components/AuthProvider";
import { Button } from "@/components/ui/button";
import AdminBadge from "@/components/AdminBadge";
import {
  ArrowLeft,
  Calendar,
  User,
  Heart,
  MessageCircle,
  Share2,
  Star,
  BadgeCheck,
  Bookmark,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";

const TYPE_LABELS = {
  guide: {
    label: "Guide",
    color: "bg-blue-500/20 text-blue-600 border-blue-500/30",
    icon: <Star className="w-4 h-4 mr-1 text-blue-400" />,
  },
  theory: {
    label: "Théorie",
    color: "bg-yellow-500/20 text-yellow-600 border-yellow-500/30",
    icon: <Star className="w-4 h-4 mr-1 text-yellow-400" />,
  },
  rp: {
    label: "RP",
    color: "bg-green-500/20 text-green-600 border-green-500/30",
    icon: <Star className="w-4 h-4 mr-1 text-green-400" />,
  },
  event: {
    label: "Événement",
    color: "bg-purple-500/20 text-purple-600 border-purple-500/30",
    icon: <Star className="w-4 h-4 mr-1 text-purple-400" />,
  },
};

function getInitials(name: string) {
  if (!name) return "?";
  return name.slice(0, 2).toUpperCase();
}

export default function PostDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user, userProfile } = useAuth();
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ likes: 0, comments: 0, shares: 0 });
  const [userInteractions, setUserInteractions] = useState({
    hasLiked: false,
    hasFavorited: false,
  });
  const [comments, setComments] = useState<any[]>([]);
  const [commentInput, setCommentInput] = useState("");
  const [commentLoading, setCommentLoading] = useState(false);
  const commentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (params.id) {
      fetchPostDetails();
      fetchComments();
    }
    // eslint-disable-next-line
  }, [params.id, user]);

  const fetchPostDetails = async () => {
    setLoading(true);
    try {
      // Récupérer la publication
      const { data: postData, error: postError } = await supabase
        .from("community")
        .select("*")
        .eq("id", params.id)
        .single();

      if (postError) {
        toast.error("Publication non trouvée");
        router.push("/community");
        return;
      }

      // Récupérer le profil de l'auteur
      const { data: authorProfile, error: profileError } = await supabase
        .from("profiles")
        .select("username")
        .eq("id", postData.author_id)
        .single();

      if (profileError) {
        console.error(
          "Erreur lors de la récupération du profil:",
          profileError
        );
      }

      setPost({
        ...postData,
        profiles: authorProfile,
      });

      // Requête optimisée pour toutes les statistiques en une fois
      const [statsResult, userInteractionsResult] = await Promise.all([
        // Statistiques globales
        supabase
          .from("post")
          .select("action_type")
          .eq("post_id", params.id)
          .in("action_type", ["like", "share"]),

        // Interactions utilisateur
        user
          ? supabase
              .from("post")
              .select("action_type")
              .eq("post_id", params.id)
              .eq("user_id", user.id)
              .in("action_type", ["like", "favorite"])
          : Promise.resolve({ data: [] }),
      ]);

      // Compter les statistiques
      const likes = (statsResult.data || []).filter(
        (item) => item.action_type === "like"
      ).length;
      const shares = (statsResult.data || []).filter(
        (item) => item.action_type === "share"
      ).length;

      // Compter les commentaires séparément (table différente)
      const { count: comments } = await supabase
        .from("community_comments")
        .select("*", { count: "exact", head: true })
        .eq("post_id", params.id);

      setStats({
        likes,
        comments: comments || 0,
        shares,
      });

      // Traiter les interactions utilisateur
      if (user) {
        const userInteractions = userInteractionsResult.data || [];
        setUserInteractions({
          hasLiked: userInteractions.some(
            (item) => item.action_type === "like"
          ),
          hasFavorited: userInteractions.some(
            (item) => item.action_type === "favorite"
          ),
        });
      }
    } catch (error) {
      toast.error("Erreur lors du chargement");
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const { data: commentsData, error } = await supabase
        .from("community_comments")
        .select("*")
        .eq("post_id", params.id)
        .order("created_at", { ascending: true });

      if (error) {
        toast.error("Erreur lors du chargement des commentaires");
        return;
      }

      // Récupérer les profils des commentateurs
      const userIds = [
        ...new Set((commentsData || []).map((comment) => comment.user_id)),
      ];

      if (userIds.length > 0) {
        const { data: profiles, error: profilesError } = await supabase
          .from("profiles")
          .select("id, username")
          .in("id", userIds);

        if (profilesError) {
          console.error(
            "Erreur lors de la récupération des profils:",
            profilesError
          );
        }

        // Créer un map pour un accès rapide aux profils
        const profilesMap = new Map();
        (profiles || []).forEach((profile) => {
          profilesMap.set(profile.id, profile);
        });

        // Ajouter les profils aux commentaires
        const commentsWithProfiles = (commentsData || []).map((comment) => ({
          ...comment,
          profiles: profilesMap.get(comment.user_id),
        }));

        setComments(commentsWithProfiles);
      } else {
        setComments(commentsData || []);
      }
    } catch (error) {
      toast.error("Erreur lors du chargement des commentaires");
    }
  };

  const handleLike = async () => {
    if (!user) {
      toast.error("Vous devez être connecté pour liker");
      return;
    }
    try {
      if (userInteractions.hasLiked) {
        await supabase
          .from("post")
          .delete()
          .eq("post_id", params.id)
          .eq("user_id", user.id)
          .eq("action_type", "like");
        setStats((prev) => ({ ...prev, likes: Math.max(0, prev.likes - 1) }));
        setUserInteractions((prev) => ({ ...prev, hasLiked: false }));
        toast.success("Like retiré");
      } else {
        await supabase.from("post").insert({
          user_id: user.id,
          post_id: params.id,
          action_type: "like",
        });
        setStats((prev) => ({ ...prev, likes: prev.likes + 1 }));
        setUserInteractions((prev) => ({ ...prev, hasLiked: true }));
        toast.success("Post liké !");
      }
    } catch (error) {
      toast.error("Erreur lors du like");
    }
  };

  const handleFavorite = async () => {
    if (!user) {
      toast.error("Vous devez être connecté pour sauvegarder");
      return;
    }
    try {
      if (userInteractions.hasFavorited) {
        await supabase
          .from("post")
          .delete()
          .eq("post_id", params.id)
          .eq("user_id", user.id)
          .eq("action_type", "favorite");
        setUserInteractions((prev) => ({ ...prev, hasFavorited: false }));
        toast.success("Retiré des favoris");
      } else {
        await supabase.from("post").insert({
          user_id: user.id,
          post_id: params.id,
          action_type: "favorite",
        });
        setUserInteractions((prev) => ({ ...prev, hasFavorited: true }));
        toast.success("Ajouté aux favoris !");
      }
    } catch (error) {
      toast.error("Erreur lors de la sauvegarde");
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("Vous devez être connecté pour commenter");
      return;
    }
    if (!commentInput.trim()) {
      toast.error("Le commentaire ne peut pas être vide");
      return;
    }
    setCommentLoading(true);
    try {
      await supabase.from("community_comments").insert({
        post_id: params.id,
        user_id: user.id,
        content: commentInput.trim(),
      });
      setCommentInput("");
      toast.success("Commentaire ajouté !");
      await fetchComments();
      setStats((prev) => ({ ...prev, comments: prev.comments + 1 }));
      setTimeout(() => {
        commentRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "end",
        });
      }, 200);
    } catch (error) {
      toast.error("Erreur lors de l'ajout du commentaire");
    } finally {
      setCommentLoading(false);
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    if (!user) {
      toast.error("Vous devez être connecté pour supprimer un commentaire");
      return;
    }

    try {
      const { error } = await supabase
        .from("community_comments")
        .delete()
        .eq("id", commentId)
        .eq("user_id", user.id);

      if (error) {
        toast.error("Erreur lors de la suppression du commentaire");
        return;
      }

      toast.success("Commentaire supprimé !");
      await fetchComments();
      setStats((prev) => ({
        ...prev,
        comments: Math.max(0, prev.comments - 1),
      }));
    } catch (error) {
      toast.error("Erreur lors de la suppression du commentaire");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-purple-50 to-slate-100 dark:from-slate-900 dark:via-purple-900 dark:to-slate-900 pt-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">
            Chargement de la publication...
          </p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-purple-50 to-slate-100 dark:from-slate-900 dark:via-purple-900 dark:to-slate-900 pt-20">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-300">
            Publication non trouvée
          </p>
          <Button onClick={() => router.push("/community")} className="mt-4">
            Retour à la communauté
          </Button>
        </div>
      </div>
    );
  }

  const typeMeta = TYPE_LABELS[post.type] || {
    label: post.type,
    color: "bg-gray-200 text-gray-700",
    icon: null,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-slate-100 dark:from-slate-900 dark:via-purple-900 dark:to-slate-900 pt-20">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Colonne de gauche - Contenu principal */}
          <div className="lg:col-span-2 space-y-8">
            {/* Carte principale - En haut à gauche */}
            <div className="bg-white/90 dark:bg-slate-900/90 rounded-3xl shadow-2xl border border-white/30 p-8 relative backdrop-blur-xl">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center text-xl font-bold text-primary border-2 border-primary/20 shadow-lg">
                    {getInitials(post.profiles?.username || post.author_id)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-semibold text-gray-900 dark:text-white">
                        {post.profiles?.username || "Auteur"}
                      </span>
                      {user && user.id === post.author_id && (
                        <BadgeCheck
                          className="w-4 h-4 text-green-500"
                          title="Vous êtes l'auteur"
                        />
                      )}
                      {userProfile?.role && userProfile.role !== "user" && (
                        <AdminBadge role={userProfile.role} size="sm" />
                      )}
                    </div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {post.profiles?.username
                        ? `@${post.profiles.username}`
                        : post.author_id?.slice(0, 8) + "..."}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400">
                  <Calendar className="w-5 h-5" />
                  <span className="text-base">
                    {new Date(post.created_at).toLocaleDateString("fr-FR", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>

              <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-6 leading-tight drop-shadow-lg">
                {post.title}
              </h1>

              <div className="prose prose-lg max-w-none text-gray-700 dark:text-gray-300 leading-relaxed mb-8">
                <p className="text-lg">{post.content}</p>
              </div>

              {/* Actions principales */}
              <div className="flex flex-wrap items-center gap-4 mt-4 mb-2">
                <button
                  onClick={handleLike}
                  className={`flex items-center gap-2 px-5 py-2 rounded-full font-semibold shadow transition-all duration-200 border-2 border-transparent hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary/40 ${
                    userInteractions.hasLiked
                      ? "bg-red-500 text-white hover:bg-red-600 border-red-500"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700"
                  }`}
                >
                  <Bookmark
                    className={`w-5 h-5 ${
                      userInteractions.hasLiked ? "fill-current" : ""
                    }`}
                  />
                  <span>{stats.likes}</span>
                </button>
                <div className="flex items-center gap-2 px-5 py-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 font-semibold shadow">
                  <MessageCircle className="w-5 h-5" />
                  <span>{stats.comments}</span>
                </div>
                <div className="flex items-center gap-2 px-5 py-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 font-semibold shadow">
                  <Share2 className="w-5 h-5" />
                  <span>{stats.shares}</span>
                </div>
                <button
                  onClick={handleFavorite}
                  className={`flex items-center gap-2 px-5 py-2 rounded-full font-semibold shadow transition-all duration-200 border-2 border-transparent hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary/40 ${
                    userInteractions.hasFavorited
                      ? "bg-yellow-500 text-white hover:bg-yellow-600 border-yellow-500"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700"
                  }`}
                >
                  <Bookmark
                    className={`w-5 h-5 ${
                      userInteractions.hasFavorited ? "fill-current" : ""
                    }`}
                  />
                  <span>
                    {userInteractions.hasFavorited ? "Favori" : "Sauvegarder"}
                  </span>
                </button>
                <Button
                  onClick={() => router.push("/community")}
                  variant="ghost"
                  className="ml-auto flex items-center gap-2 hover:bg-primary/10 text-primary font-bold"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Retour
                </Button>
              </div>
            </div>

            {/* Carte média - En bas de la première carte */}
            {(post.file_url && post.file_url.match(/\.(jpg|jpeg|png|webp)$/)) ||
            (post.file_url && post.file_url.match(/\.(mp4|webm)$/)) ? (
              <div className="bg-white/90 dark:bg-slate-900/90 rounded-3xl shadow-2xl border border-white/30 p-6 relative backdrop-blur-xl">
                {/* Badge type en haut */}
                <div className="mb-4">
                  <span
                    className={`inline-flex items-center px-4 py-2 rounded-full text-base font-semibold uppercase tracking-wide shadow-lg ${typeMeta.color}`}
                  >
                    {typeMeta.icon}
                    {typeMeta.label}
                  </span>
                </div>

                {/* Image de couverture */}
                {post.file_url &&
                  post.file_url.match(/\.(jpg|jpeg|png|webp)$/) && (
                    <div className="rounded-2xl overflow-hidden shadow-xl border border-white/20">
                      <img
                        src={
                          supabase.storage
                            .from("community-uploads")
                            .getPublicUrl(post.file_url).data.publicUrl
                        }
                        alt="cover"
                        className="w-full h-96 object-cover object-center"
                      />
                    </div>
                  )}

                {/* Média vidéo */}
                {post.file_url && post.file_url.match(/\.(mp4|webm)$/) && (
                  <div className="rounded-2xl overflow-hidden shadow-xl border border-white/20">
                    <video
                      src={
                        supabase.storage
                          .from("community-uploads")
                          .getPublicUrl(post.file_url).data.publicUrl
                      }
                      controls
                      className="w-full max-h-96 object-cover"
                    />
                  </div>
                )}
              </div>
            ) : null}
          </div>

          {/* Colonne de droite - Section commentaires */}
          <div className="lg:col-span-1">
            <div className="bg-white/90 dark:bg-slate-900/90 rounded-3xl shadow-2xl border border-white/30 p-6 relative backdrop-blur-xl h-full">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-primary" />
                Commentaires
                <span className="ml-2 px-2 py-1 rounded-full bg-primary/10 text-primary text-sm font-semibold">
                  {stats.comments}
                </span>
              </h2>

              {/* Formulaire d'ajout de commentaire */}
              {user ? (
                <form
                  onSubmit={handleCommentSubmit}
                  className="flex flex-col gap-3 mb-6"
                >
                  <input
                    type="text"
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm"
                    placeholder="Écrire un commentaire..."
                    value={commentInput}
                    onChange={(e) => setCommentInput(e.target.value)}
                    disabled={commentLoading}
                    maxLength={500}
                    required
                  />
                  <Button
                    type="submit"
                    disabled={commentLoading || !commentInput.trim()}
                    className="h-10 px-4 text-sm font-bold"
                  >
                    {commentLoading ? "Envoi..." : "Commenter"}
                  </Button>
                </form>
              ) : (
                <div className="mb-6 text-gray-500 dark:text-gray-400 text-sm">
                  Connectez-vous pour commenter.
                </div>
              )}

              {/* Liste des commentaires */}
              <div
                className="space-y-4 max-h-96 overflow-y-auto"
                ref={commentRef}
              >
                {comments.length === 0 && (
                  <div className="text-gray-400 text-center text-sm">
                    Aucun commentaire pour le moment.
                  </div>
                )}
                {comments.map((c, idx) => (
                  <div
                    key={c.id}
                    className={`group flex items-start gap-3 p-3 rounded-xl bg-gradient-to-br from-primary/5 to-primary/0 border border-primary/10 shadow hover:shadow-lg transition-all duration-200 ${
                      user && c.user_id === user.id
                        ? "ring-2 ring-primary/30"
                        : ""
                    }`}
                    style={{ animation: `fadeIn 0.5s ${idx * 0.05}s both` }}
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center text-sm font-bold text-primary border-2 border-primary/20 flex-shrink-0">
                      {getInitials(c.profiles?.username || c.user_id)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-gray-900 dark:text-white text-sm truncate">
                            {c.profiles?.username ||
                              c.user_id?.slice(0, 8) + "..."}
                          </span>
                          {post.author_id === c.user_id && (
                            <span className="ml-1 px-1.5 py-0.5 rounded bg-primary/10 text-primary text-xs font-bold flex items-center gap-1 flex-shrink-0">
                              <BadgeCheck className="w-2.5 h-2.5" /> Auteur
                            </span>
                          )}
                          {user &&
                            c.user_id === user.id &&
                            userProfile?.role &&
                            userProfile.role !== "user" && (
                              <AdminBadge role={userProfile.role} size="sm" />
                            )}
                        </div>
                        {user && c.user_id === user.id && (
                          <button
                            onClick={() => handleDeleteComment(c.id)}
                            className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1 rounded-full hover:bg-red-100 dark:hover:bg-red-900/30 text-red-500 hover:text-red-600"
                            title="Supprimer le commentaire"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                      <div className="text-gray-700 dark:text-gray-200 text-sm leading-relaxed">
                        {c.content}
                      </div>
                      <span className="text-xs text-gray-400 mt-1 block">
                        {new Date(c.created_at).toLocaleDateString("fr-FR", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
