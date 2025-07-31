"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/components/AuthProvider";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, User, Eye, Heart, MessageCircle, Share2 } from "lucide-react";
import { toast } from "sonner";

const TYPE_LABELS = {
  guide: "Guide",
  theory: "Théorie",
  rp: "RP",
  event: "Événement",
};

export default function PostDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    likes: 0,
    comments: 0,
    shares: 0,
  });
  const [userInteractions, setUserInteractions] = useState({
    hasLiked: false,
    hasFavorited: false,
  });

  useEffect(() => {
    if (params.id) {
      fetchPostDetails();
    }
  }, [params.id, user]);

  const fetchPostDetails = async () => {
    setLoading(true);
    try {
      // Récupérer les détails de la publication
      const { data: postData, error: postError } = await supabase
        .from("community")
        .select("*")
        .eq("id", params.id)
        .single();

      if (postError) {
        console.error("Erreur lors de la récupération du post:", postError);
        toast.error("Publication non trouvée");
        router.push("/community");
        return;
      }

      setPost(postData);

      // Récupérer les statistiques d'interaction
      const [likesResult, commentsResult, sharesResult] = await Promise.all([
        supabase
          .from("post")
          .select("*", { count: "exact", head: true })
          .eq("post_id", params.id)
          .eq("action_type", "like"),
        supabase
          .from("post")
          .select("*", { count: "exact", head: true })
          .eq("post_id", params.id)
          .eq("action_type", "comment"),
        supabase
          .from("post")
          .select("*", { count: "exact", head: true })
          .eq("post_id", params.id)
          .eq("action_type", "share"),
      ]);

      setStats({
        likes: likesResult.count || 0,
        comments: commentsResult.count || 0,
        shares: sharesResult.count || 0,
      });

      // Vérifier les interactions de l'utilisateur actuel
      if (user) {
        const [userLike, userFavorite] = await Promise.all([
          supabase
            .from("post")
            .select("*")
            .eq("post_id", params.id)
            .eq("user_id", user.id)
            .eq("action_type", "like")
            .single(),
          supabase
            .from("post")
            .select("*")
            .eq("post_id", params.id)
            .eq("user_id", user.id)
            .eq("action_type", "favorite")
            .single(),
        ]);

        setUserInteractions({
          hasLiked: !!userLike.data,
          hasFavorited: !!userFavorite.data,
        });
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des détails:", error);
      toast.error("Erreur lors du chargement");
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (!user) {
      toast.error("Vous devez être connecté pour liker");
      return;
    }

    try {
      if (userInteractions.hasLiked) {
        // Supprimer le like
        await supabase
          .from("post")
          .delete()
          .eq("post_id", params.id)
          .eq("user_id", user.id)
          .eq("action_type", "like");

        setStats(prev => ({ ...prev, likes: Math.max(0, prev.likes - 1) }));
        setUserInteractions(prev => ({ ...prev, hasLiked: false }));
        toast.success("Like retiré");
      } else {
        // Ajouter le like
        await supabase
          .from("post")
          .insert({
            user_id: user.id,
            post_id: params.id,
            action_type: "like",
          });

        setStats(prev => ({ ...prev, likes: prev.likes + 1 }));
        setUserInteractions(prev => ({ ...prev, hasLiked: true }));
        toast.success("Post liké !");
      }
    } catch (error) {
      console.error("Erreur lors du like:", error);
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
        // Supprimer le favori
        await supabase
          .from("post")
          .delete()
          .eq("post_id", params.id)
          .eq("user_id", user.id)
          .eq("action_type", "favorite");

        setUserInteractions(prev => ({ ...prev, hasFavorited: false }));
        toast.success("Retiré des favoris");
      } else {
        // Ajouter le favori
        await supabase
          .from("post")
          .insert({
            user_id: user.id,
            post_id: params.id,
            action_type: "favorite",
          });

        setUserInteractions(prev => ({ ...prev, hasFavorited: true }));
        toast.success("Ajouté aux favoris !");
      }
    } catch (error) {
      console.error("Erreur lors du favori:", error);
      toast.error("Erreur lors de la sauvegarde");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-purple-50 to-slate-100 dark:from-slate-900 dark:via-purple-900 dark:to-slate-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Chargement de la publication...</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-purple-50 to-slate-100 dark:from-slate-900 dark:via-purple-900 dark:to-slate-900">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-300">Publication non trouvée</p>
          <Button onClick={() => router.push("/community")} className="mt-4">
            Retour à la communauté
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-slate-100 dark:from-slate-900 dark:via-purple-900 dark:to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Bouton retour */}
        <Button
          onClick={() => router.push("/community")}
          variant="ghost"
          className="mb-6 flex items-center gap-2 hover:bg-white/10"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour à la communauté
        </Button>

        {/* Contenu principal */}
        <div className="max-w-4xl mx-auto">
          {/* En-tête de la publication */}
          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-8 mb-8 border border-white/20 shadow-xl">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <span className={`px-4 py-2 rounded-full text-sm font-semibold uppercase tracking-wide ${
                  post.type === 'guide' ? 'bg-blue-500/20 text-blue-600 border border-blue-500/30' :
                  post.type === 'theory' ? 'bg-yellow-500/20 text-yellow-600 border border-yellow-500/30' :
                  post.type === 'rp' ? 'bg-green-500/20 text-green-600 border border-green-500/30' :
                  'bg-purple-500/20 text-purple-600 border border-purple-500/30'
                }`}>
                  {TYPE_LABELS[post.type] || post.type}
                </span>
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <Calendar className="w-4 h-4" />
                  {new Date(post.created_at).toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  {post.author_id?.slice(0, 8)}...
                </span>
              </div>
            </div>

            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
              {post.title}
            </h1>

            <div className="prose prose-lg max-w-none text-gray-700 dark:text-gray-300 leading-relaxed">
              <p className="text-lg">{post.content}</p>
            </div>
          </div>

          {/* Média */}
          {post.file_url && (
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-8 mb-8 border border-white/20 shadow-xl">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Média
              </h3>
              <div className="relative overflow-hidden rounded-xl">
                {post.file_url.match(/\.(mp4|webm)$/) ? (
                  <video
                    src={supabase.storage.from("community-uploads").getPublicUrl(post.file_url).data.publicUrl}
                    controls
                    className="w-full max-h-96 object-cover"
                  />
                ) : (
                  <img
                    src={supabase.storage.from("community-uploads").getPublicUrl(post.file_url).data.publicUrl}
                    alt="media"
                    className="w-full max-h-96 object-cover rounded-xl"
                  />
                )}
              </div>
            </div>
          )}

          {/* Actions et statistiques */}
          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-8 border border-white/20 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <button
                  onClick={handleLike}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    userInteractions.hasLiked
                      ? 'bg-red-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${userInteractions.hasLiked ? 'fill-current' : ''}`} />
                  <span>{stats.likes}</span>
                </button>

                <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                  <MessageCircle className="w-5 h-5 text-gray-500" />
                  <span className="text-gray-700 dark:text-gray-300">{stats.comments}</span>
                </div>

                <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                  <Share2 className="w-5 h-5 text-gray-500" />
                  <span className="text-gray-700 dark:text-gray-300">{stats.shares}</span>
                </div>
              </div>

              <button
                onClick={handleFavorite}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  userInteractions.hasFavorited
                    ? 'bg-red-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                <svg className={`w-5 h-5 ${userInteractions.hasFavorited ? 'fill-current' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <span>{userInteractions.hasFavorited ? "Favori" : "Sauvegarder"}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 